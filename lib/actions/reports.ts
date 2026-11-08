'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth'
import { notifyReportsReady } from '@/lib/notify'
import { normaliseKey, reportPath, SESSION_RE } from '@/lib/pdf'
import type { FileMatch } from '@/lib/types'

// PDFs are uploaded straight from the browser to storage (see
// components/portal/*Uploader.tsx). These actions match file names to
// students and record the result. Authorisation is enforced by row-level
// security: a teacher only ever sees, and can only write for, their own
// classes' students.

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Matches file names (e.g. "KSPS-023.pdf") to the admission numbers of
// students this user is allowed to upload for.
export async function matchReportFiles(names: string[]): Promise<FileMatch[]> {
  const { supabase } = await requireRole(['teacher', 'admin'])

  const { data } = await supabase
    .from('students')
    .select('id, full_name, admission_no, classes(name)')
    .limit(5000)
  const students = (data ?? []) as unknown as {
    id: string
    full_name: string
    admission_no: string
    classes: { name: string } | null
  }[]

  const byKey = new Map<string, typeof students>()
  for (const s of students) {
    const k = normaliseKey(s.admission_no)
    byKey.set(k, [...(byKey.get(k) ?? []), s])
  }

  const seen = new Set<string>()
  return names.map((name): FileMatch => {
    const found = byKey.get(normaliseKey(name.replace(/\.pdf$/i, ''))) ?? []
    if (found.length === 0) return { name, status: 'unknown' }
    if (found.length > 1) return { name, status: 'ambiguous' }
    const s = found[0]
    if (seen.has(s.id)) return { name, status: 'duplicate', studentName: s.full_name }
    seen.add(s.id)
    return {
      name,
      status: 'ok',
      studentId: s.id,
      studentName: s.full_name,
      className: s.classes?.name,
    }
  })
}

// Called after the browser has uploaded the files. Confirms each file is
// really in storage, then writes the report rows.
export async function recordReports(input: {
  studentIds: string[]
  session: string
  term: number
}): Promise<{ recorded: string[]; failed: { studentId: string; reason: string }[] }> {
  const { supabase, user } = await requireRole(['teacher', 'admin'])
  const { studentIds, session, term } = input

  if (!SESSION_RE.test(session) || ![1, 2, 3].includes(term)) {
    return { recorded: [], failed: studentIds.map((studentId) => ({ studentId, reason: 'Invalid session or term' })) }
  }

  const recorded: string[] = []
  const failed: { studentId: string; reason: string }[] = []

  for (const studentId of studentIds) {
    if (!UUID.test(studentId)) {
      failed.push({ studentId, reason: 'Invalid student' })
      continue
    }
    const path = reportPath(studentId, session, term)
    const fileName = path.split('/')[1]
    const { data: files } = await supabase.storage
      .from('report-sheets')
      .list(studentId, { search: fileName, limit: 5 })
    if (!files?.some((f) => f.name === fileName)) {
      failed.push({ studentId, reason: 'File not found in storage' })
      continue
    }
    const { error } = await supabase.from('reports').upsert(
      { student_id: studentId, term, session, file_path: path, uploaded_by: user.id },
      { onConflict: 'student_id,session,term' }
    )
    if (error) failed.push({ studentId, reason: 'Not allowed for this student' })
    else recorded.push(studentId)
  }

  revalidatePath('/teacher')
  revalidatePath('/portal')
  return { recorded, failed }
}

// Emails linked parents. Only students that actually have this report, and
// that the caller can see (RLS), are notified.
export async function sendReportNotifications(input: {
  studentIds: string[]
  session: string
  term: number
}): Promise<{ emailed: number; failed: number; blocked?: string }> {
  const { supabase } = await requireRole(['teacher', 'admin'])
  const ids = input.studentIds.filter((id) => UUID.test(id))
  if (ids.length === 0) return { emailed: 0, failed: 0 }

  const { data } = await supabase
    .from('reports')
    .select('student_id')
    .in('student_id', ids)
    .eq('session', input.session)
    .eq('term', input.term)
  const allowed = (data ?? []).map((r) => r.student_id as string)
  return notifyReportsReady(allowed, input.session, input.term)
}

export async function deleteReport(formData: FormData) {
  const { supabase } = await requireRole(['teacher', 'admin'])
  const id = String(formData.get('reportId') ?? '')
  if (!UUID.test(id)) return

  const { data: report } = await supabase
    .from('reports')
    .select('file_path')
    .eq('id', id)
    .single<{ file_path: string }>()
  if (!report) return

  // Row delete is RLS-checked; only remove the file if it succeeded.
  const { error } = await supabase.from('reports').delete().eq('id', id)
  if (!error) await supabase.storage.from('report-sheets').remove([report.file_path])

  revalidatePath('/teacher')
  revalidatePath('/portal')
}
