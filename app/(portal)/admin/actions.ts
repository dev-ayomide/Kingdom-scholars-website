'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { requireRole } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildAccountMail, createAccount, listAuthUsers } from '@/lib/accounts'
import { sendMails, type Mail } from '@/lib/email'
import { normaliseKey } from '@/lib/pdf'
import { titleCase } from '@/lib/format'
import { AUTH_USERS_TAG } from '@/lib/admin-data'
import type { ActionState, ImportResult } from '@/lib/types'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim()

// No revalidatePath here on purpose: a server-side refresh re-triggers the
// site-wide loading screen and wipes the form's message. The browser calls
// router.refresh() after success instead (see ActionForm / CsvImporter).
function done(message: string): ActionState {
  return { ok: message }
}

export async function createClass(_p: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase } = await requireRole(['admin'])
  const name = str(fd, 'name')
  if (!name) return { error: 'Please type the name of the class.' }
  const { error } = await supabase.from('classes').insert({ name })
  if (error) return { error: error.code === '23505' ? 'That class is already on the list.' : 'Could not create class.' }
  return done(`Added the class ${name}.`)
}

export async function createStudent(_p: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase } = await requireRole(['admin'])
  const full_name = str(fd, 'fullName')
  const admission_no = str(fd, 'admissionNo')
  const class_id = str(fd, 'classId')
  if (!full_name || !admission_no || !UUID.test(class_id)) return { error: 'Please fill in every box.' }
  const { error } = await supabase.from('students').insert({ full_name, admission_no, class_id })
  if (error) return { error: error.code === '23505' ? 'That admission number is already used by another child.' : 'We could not add this child. Please try again.' }
  return done(`Added ${full_name}.`)
}

export async function moveStudent(_p: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase } = await requireRole(['admin'])
  const studentId = str(fd, 'studentId')
  const classId = str(fd, 'classId')
  if (!UUID.test(studentId) || !UUID.test(classId)) return { error: 'Please choose a child and a class.' }
  const { error } = await supabase.from('students').update({ class_id: classId }).eq('id', studentId)
  if (error) return { error: 'We could not move this child. Please try again.' }
  return done('Done. The child has been moved to the new class.')
}

// ------------------------------------------------------------- accounts

// Creates a teacher/parent login and emails them a link to set their own
// password. The admin never sees or shares a password.
export async function inviteAccount(_p: ActionState, fd: FormData): Promise<ActionState> {
  await requireRole(['admin'])
  const email = str(fd, 'email').toLowerCase()
  const full_name = str(fd, 'fullName')
  const role = str(fd, 'role')

  if (!full_name || !EMAIL.test(email)) return { error: 'Please type a name and a correct email address.' }
  if (role !== 'parent' && role !== 'teacher' && role !== 'admin') return { error: 'Please choose what this person should be able to do.' }

  const created = await createAccount(email, full_name, role)
  if ('error' in created) {
    return { error: /already|exists|registered/i.test(created.error) ? 'That email address already has an account.' : created.error }
  }

  revalidateTag(AUTH_USERS_TAG)
  const mail = await buildAccountMail(email, full_name, 'invite')
  const { sent } = mail ? await sendMails([mail]) : { sent: 0 }
  return sent
    ? { ok: `${full_name} has been added. A welcome email was sent to ${email}.` }
    : { ok: `${full_name} has been added, but the welcome email could not be sent. Open "Welcome emails" on the Parents page and press "Send again".` }
}

export async function resendInvite(fd: FormData) {
  await requireRole(['admin'])
  const id = str(fd, 'profileId')
  if (!UUID.test(id)) return
  const service = createAdminClient()
  const [{ data: profile }, { data: authUser }] = await Promise.all([
    service.from('profiles').select('full_name').eq('id', id).single<{ full_name: string }>(),
    service.auth.admin.getUserById(id),
  ])
  const email = authUser.user?.email
  if (!profile || !email) return
  const mail = await buildAccountMail(email, profile.full_name, 'invite')
  if (mail) await sendMails([mail])
  revalidatePath('/admin')
}

// ------------------------------------------------------------- assignments

export async function assignTeacher(_p: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase } = await requireRole(['admin'])
  const teacher_id = str(fd, 'teacherId')
  const class_id = str(fd, 'classId')
  if (!UUID.test(teacher_id) || !UUID.test(class_id)) return { error: 'Please choose a teacher and a class.' }
  const { error } = await supabase.from('teacher_classes').upsert({ teacher_id, class_id })
  if (error) return { error: 'We could not give this class. Please try again.' }
  return done('Done. The teacher now has this class.')
}

export async function unassignTeacher(fd: FormData) {
  const { supabase } = await requireRole(['admin'])
  const teacher_id = str(fd, 'teacherId')
  const class_id = str(fd, 'classId')
  if (!UUID.test(teacher_id) || !UUID.test(class_id)) return
  await supabase.from('teacher_classes').delete().match({ teacher_id, class_id })
  revalidatePath('/admin')
}

export async function linkParent(_p: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase } = await requireRole(['admin'])
  const parent_id = str(fd, 'parentId')
  const student_id = str(fd, 'studentId')
  if (!UUID.test(parent_id) || !UUID.test(student_id)) return { error: 'Please choose a parent and a child.' }
  const { error } = await supabase.from('parent_students').upsert({ parent_id, student_id })
  if (error) return { error: 'We could not connect them. Please try again.' }
  return done('Done. The parent is now connected to the child.')
}

export async function unlinkParent(fd: FormData) {
  const { supabase } = await requireRole(['admin'])
  const parent_id = str(fd, 'parentId')
  const student_id = str(fd, 'studentId')
  if (!UUID.test(parent_id) || !UUID.test(student_id)) return
  await supabase.from('parent_students').delete().match({ parent_id, student_id })
  revalidatePath('/admin')
}

// ------------------------------------------------------------- CSV imports
// The browser parses the CSV and sends it in small chunks, so a large school
// never hits a request-time or body-size limit.

type Row = Record<string, string>

// Columns: full_name, admission_no, class (class must already exist).
export async function importStudentRows(
  rows: Row[],
  _opts?: { sendInvites: boolean }
): Promise<ImportResult> {
  await requireRole(['admin'])
  const service = createAdminClient()
  const result: ImportResult = { created: 0, linked: 0, skipped: 0, emailed: 0, errors: [] }

  const [{ data: classes }, { data: existing }] = await Promise.all([
    service.from('classes').select('id, name'),
    service.from('students').select('admission_no'),
  ])
  const classByName = new Map((classes ?? []).map((c) => [normaliseKey(c.name as string), c.id as string]))
  const taken = new Set((existing ?? []).map((s) => normaliseKey(s.admission_no as string)))

  const toInsert: { full_name: string; admission_no: string; class_id: string }[] = []
  for (const r of rows) {
    const where = `Row ${r.line}`
    if (!r.full_name || !r.admission_no || !r.class) {
      result.errors.push(`${where}: the name, admission number and class are all needed.`)
      continue
    }
    const classId = classByName.get(normaliseKey(r.class))
    if (!classId) {
      result.errors.push(`${where}: the class "${r.class}" is not on the list. Add the class first.`)
      continue
    }
    const key = normaliseKey(r.admission_no)
    if (taken.has(key)) {
      result.skipped++
      continue
    }
    taken.add(key)
    toInsert.push({ full_name: r.full_name, admission_no: r.admission_no, class_id: classId })
  }

  if (toInsert.length) {
    const { error } = await service.from('students').insert(toInsert)
    if (error) result.errors.push(`Could not save this group of students: ${error.message}`)
    else result.created = toInsert.length
  }
  return result
}

// Columns: parent_name, parent_email, admission_no. One row per parent-child
// pair, so a parent with two children has two rows. Creates the parent's
// login if needed, links them to the child, and (optionally) emails an invite.
export async function importParentRows(
  rows: Row[],
  opts: { sendInvites: boolean }
): Promise<ImportResult> {
  await requireRole(['admin'])
  const service = createAdminClient()
  const result: ImportResult = { created: 0, linked: 0, skipped: 0, emailed: 0, errors: [] }

  const [{ data: students }, users] = await Promise.all([
    service.from('students').select('id, admission_no'),
    listAuthUsers(),
  ])
  const studentByKey = new Map((students ?? []).map((s) => [normaliseKey(s.admission_no as string), s.id as string]))
  const userByEmail = new Map(users.map((u) => [u.email, u.id]))

  const { data: profiles } = await service
    .from('profiles')
    .select('id, role')
    .in('id', users.map((u) => u.id))
  const roleById = new Map((profiles ?? []).map((p) => [p.id as string, p.role as string]))

  const byEmail = new Map<string, Row[]>()
  for (const r of rows) {
    const email = r.parent_email.toLowerCase()
    if (!EMAIL.test(email)) {
      result.errors.push(`Row ${r.line}: "${r.parent_email}" is not a correct email address.`)
      continue
    }
    byEmail.set(email, [...(byEmail.get(email) ?? []), r])
  }

  const mails: Mail[] = []
  const links: { parent_id: string; student_id: string }[] = []

  for (const [email, group] of byEmail) {
    let parentId = userByEmail.get(email)
    const name = group.find((g) => g.parent_name)?.parent_name ?? ''

    if (parentId) {
      const role = roleById.get(parentId)
      if (role && role !== 'parent') {
        result.errors.push(`Row ${group[0].line}: ${email} already has a ${role} account, so it cannot be used for a parent.`)
        continue
      }
      if (!role) {
        await service.from('profiles').insert({ id: parentId, role: 'parent', full_name: name || email })
      }
    } else {
      if (!name) {
        result.errors.push(`Row ${group[0].line}: a parent name is needed for the new email ${email}.`)
        continue
      }
      const created = await createAccount(email, name, 'parent')
      if ('error' in created) {
        result.errors.push(`Row ${group[0].line}: ${email}: ${created.error}`)
        continue
      }
      parentId = created.id
      result.created++
      if (opts.sendInvites) {
        const mail = await buildAccountMail(email, name, 'invite')
        if (mail) mails.push(mail)
        else result.errors.push(`${email}: added, but the welcome email could not be prepared. Use "Send again" on the Parents page.`)
      }
    }

    for (const r of group) {
      const studentId = studentByKey.get(normaliseKey(r.admission_no))
      if (!studentId) {
        result.errors.push(`Row ${r.line}: we cannot find a child with admission number "${r.admission_no}".`)
        continue
      }
      links.push({ parent_id: parentId, student_id: studentId })
    }
  }

  if (links.length) {
    const { error } = await service.from('parent_students').upsert(links)
    if (error) result.errors.push(`Could not save links: ${error.message}`)
    else result.linked = links.length
  }

  if (mails.length) {
    const { sent, failed, blocked } = await sendMails(mails)
    result.emailed = sent
    if (blocked) result.errors.push(`The people were added, but no emails were sent. ${blocked} You can send them later from the Parents page.`)
    failed.forEach((e) => result.errors.push(`${e}: the welcome email could not be sent. Use "Send again" on the Parents page.`))
  }

  if (result.created > 0) revalidateTag(AUTH_USERS_TAG)
  return result
}

// Emails a fresh set-up link to everyone who has never signed in. Each call
// makes a new link, so any earlier (e.g. broken) invite link stops working.
export async function resendAllPending(_p: ActionState, _fd: FormData): Promise<ActionState> {
  await requireRole(['admin'])
  const service = createAdminClient()
  const [users, { data: profiles }] = await Promise.all([
    listAuthUsers(),
    service.from('profiles').select('id, full_name'),
  ])
  const nameById = new Map((profiles ?? []).map((p) => [p.id as string, p.full_name as string]))
  const pending = users.filter((u) => nameById.has(u.id) && !u.lastSignIn)
  if (pending.length === 0) return { ok: 'Everyone has already signed in, so no emails were needed.' }

  const mails: Mail[] = []
  for (const u of pending) {
    const mail = await buildAccountMail(u.email, nameById.get(u.id)!, 'invite')
    if (mail) mails.push(mail)
  }
  const { sent, failed, blocked } = await sendMails(mails)
  if (blocked) return { error: blocked }
  return failed.length
    ? { error: `${sent} sent, but ${failed.length} could not be sent: ${failed.slice(0, 5).join(', ')}${failed.length > 5 ? ' and more' : ''}.` }
    : { ok: `${sent} welcome email${sent === 1 ? ' was' : 's were'} sent.` }
}

// Fixes a typo in someone's email address or name. Their children and
// connections stay exactly as they are.
export async function updateAccount(_p: ActionState, fd: FormData): Promise<ActionState> {
  await requireRole(['admin'])
  const id = str(fd, 'profileId')
  const fullName = str(fd, 'fullName')
  const email = str(fd, 'email').toLowerCase()
  const resend = fd.get('resend') === 'on'

  if (!UUID.test(id)) return { error: 'Please choose a person.' }
  if (!fullName && !email) return { error: 'Please type a new name or a new email address.' }
  if (email && !EMAIL.test(email)) return { error: 'That email address does not look right. Please check it.' }

  const service = createAdminClient()
  const { data: profile } = await service.from('profiles').select('full_name').eq('id', id).single<{ full_name: string }>()
  if (!profile) return { error: 'We cannot find this person.' }

  if (email) {
    const users = await listAuthUsers()
    if (users.some((u) => u.email === email && u.id !== id)) {
      return { error: 'That email address already belongs to someone else.' }
    }
    const { error } = await service.auth.admin.updateUserById(id, { email, email_confirm: true })
    if (error) return { error: 'We could not change the email address. Please try again.' }
  }
  if (fullName) {
    const { error } = await service.from('profiles').update({ full_name: fullName }).eq('id', id)
    if (error) return { error: 'We could not change the name. Please try again.' }
  }
  revalidateTag(AUTH_USERS_TAG)

  let note = ''
  if (email) {
    // Always make a fresh link, which cancels any link sent to the old address.
    const mail = await buildAccountMail(email, fullName || profile.full_name, 'invite')
    if (resend && mail) {
      const { sent } = await sendMails([mail])
      note = sent ? ` A welcome email was sent to ${email}.` : ' The welcome email could not be sent. Use "Send again" under Welcome emails.'
    } else {
      note = ' No email was sent. Use "Send again" under Welcome emails when you are ready.'
    }
  }
  return { ok: `Saved.${note}` }
}

// One step: add a parent, connect them to a child, and (optionally) email them.
// If the email already has a parent account, the child is simply connected to it.
export async function addParent(_p: ActionState, fd: FormData): Promise<ActionState> {
  await requireRole(['admin'])
  const email = str(fd, 'email').toLowerCase()
  const fullName = str(fd, 'fullName')
  const studentId = str(fd, 'studentId')
  const send = fd.get('send') === 'on'

  if (!fullName || !EMAIL.test(email)) return { error: 'Please type a name and a correct email address.' }
  if (!UUID.test(studentId)) return { error: 'Please choose which child this parent is for.' }

  const service = createAdminClient()
  const { data: child } = await service.from('students').select('id, full_name').eq('id', studentId).single<{ id: string; full_name: string }>()
  if (!child) return { error: 'We cannot find that child.' }
  const childName = titleCase(child.full_name)

  const existing = (await listAuthUsers()).find((u) => u.email === email)
  let parentId: string
  let created = false
  if (existing) {
    const { data: profile } = await service.from('profiles').select('role').eq('id', existing.id).single<{ role: string }>()
    if (profile && profile.role !== 'parent') return { error: 'That email address belongs to a staff account, so it cannot be used for a parent.' }
    if (!profile) await service.from('profiles').insert({ id: existing.id, role: 'parent', full_name: fullName })
    parentId = existing.id
  } else {
    const made = await createAccount(email, fullName, 'parent')
    if ('error' in made) return { error: 'We could not add this parent. Please check the email address and try again.' }
    parentId = made.id
    created = true
  }

  const { error } = await service.from('parent_students').upsert({ parent_id: parentId, student_id: child.id })
  if (error) return { error: 'The parent was added, but we could not connect them to the child. Please try "Connect a parent to a child".' }
  revalidateTag(AUTH_USERS_TAG)

  if (!created) return { ok: `That email address already had an account, so ${childName} was connected to it. No new email was needed.` }
  let note = ' No email was sent yet. Use "Send again" under Welcome emails when you are ready.'
  if (send) {
    const mail = await buildAccountMail(email, fullName, 'invite')
    const { sent } = mail ? await sendMails([mail]) : { sent: 0 }
    note = sent ? ` A welcome email was sent to ${email}.` : ' The welcome email could not be sent. Use "Send again" under Welcome emails.'
  }
  return { ok: `${fullName} was added and connected to ${childName}.${note}` }
}

// Fixes a spelling mistake in a child's name or admission number.
export async function updateStudent(_p: ActionState, fd: FormData): Promise<ActionState> {
  await requireRole(['admin'])
  const id = str(fd, 'studentId')
  const fullName = str(fd, 'fullName')
  const admission = str(fd, 'admissionNo')
  if (!UUID.test(id)) return { error: 'Please choose a child.' }
  if (!fullName && !admission) return { error: 'Please type the correct name or the correct admission number.' }

  const service = createAdminClient()
  const { data: old } = await service.from('students').select('full_name').eq('id', id).single<{ full_name: string }>()
  if (!old) return { error: 'We cannot find that child.' }

  const patch: Record<string, string> = {}
  if (fullName) patch.full_name = fullName
  if (admission) patch.admission_no = admission
  const { error } = await service.from('students').update(patch).eq('id', id)
  if (error) {
    return { error: error.code === '23505' ? 'That admission number is already used by another child.' : 'We could not save the correction. Please try again.' }
  }

  // Parent accounts that were named after the old spelling follow the correction.
  if (fullName) {
    const { data: links } = await service.from('parent_students').select('parent_id').eq('student_id', id)
    for (const l of links ?? []) {
      const { data: p } = await service.from('profiles').select('id, full_name').eq('id', l.parent_id).single<{ id: string; full_name: string }>()
      if (p && p.full_name.trim().toLowerCase() === `parent of ${old.full_name}`.toLowerCase()) {
        await service.from('profiles').update({ full_name: `Parent of ${fullName}` }).eq('id', p.id)
      }
    }
  }
  return { ok: `Saved. ${titleCase(fullName || old.full_name)} has been corrected.` }
}
