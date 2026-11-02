import { createAdminClient } from '@/lib/supabase/admin'
import { listAuthUsers } from '@/lib/accounts'
import { reportsReadyMail, sendMails } from '@/lib/email'

// Emails each linked parent once, listing every child with a new report.
// Contains no grades or files - it only tells them to sign in.
export async function notifyReportsReady(
  studentIds: string[],
  session: string,
  term: number
): Promise<{ emailed: number; failed: number }> {
  if (studentIds.length === 0) return { emailed: 0, failed: 0 }
  const service = createAdminClient()

  const [{ data: students }, { data: links }] = await Promise.all([
    service.from('students').select('id, full_name').in('id', studentIds),
    service.from('parent_students').select('parent_id, student_id').in('student_id', studentIds),
  ])
  if (!links || links.length === 0) return { emailed: 0, failed: 0 }

  const parentIds = [...new Set(links.map((l) => l.parent_id as string))]
  const [{ data: parents }, users] = await Promise.all([
    service.from('profiles').select('id, full_name').in('id', parentIds),
    listAuthUsers(),
  ])

  const childName = new Map((students ?? []).map((s) => [s.id as string, s.full_name as string]))
  const parentName = new Map((parents ?? []).map((p) => [p.id as string, p.full_name as string]))
  const emailOf = new Map(users.map((u) => [u.id, u.email]))
  const label = `${session} · Term ${term}`

  const byParent = new Map<string, { child: string; label: string }[]>()
  for (const l of links) {
    const child = childName.get(l.student_id as string)
    if (!child) continue
    const list = byParent.get(l.parent_id as string) ?? []
    list.push({ child, label })
    byParent.set(l.parent_id as string, list)
  }

  const mails = [...byParent.entries()].flatMap(([pid, items]) => {
    const to = emailOf.get(pid)
    return to ? [reportsReadyMail(to, parentName.get(pid) ?? 'Parent', items)] : []
  })

  const { sent, failed } = await sendMails(mails)
  return { emailed: sent, failed: failed.length }
}
