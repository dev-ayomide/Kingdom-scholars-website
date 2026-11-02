import type { Metadata } from 'next'
import { requireRole } from '@/lib/auth'
import PortalShell from '@/components/portal/PortalShell'
import SingleUpload from '@/components/portal/SingleUpload'
import BatchUploader from '@/components/portal/BatchUploader'
import { deleteReport } from '@/lib/actions/reports'
import type { Report, SchoolClass } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Teacher Portal',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

interface StudentRow {
  id: string
  full_name: string
  admission_no: string
  class_id: string
  reports: Report[]
}

function currentSession() {
  const now = new Date()
  const start = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1
  return `${start}-${start + 1}`
}

export default async function TeacherPage() {
  const { supabase, profile } = await requireRole(['teacher', 'admin'])

  // RLS: a teacher only gets their assigned classes' students; an admin gets all.
  const [{ data: classData }, { data: studentData }] = await Promise.all([
    profile.role === 'admin'
      ? supabase.from('classes').select('id, name').order('name')
      : supabase
          .from('teacher_classes')
          .select('classes(id, name)')
          .eq('teacher_id', profile.id),
    supabase
      .from('students')
      .select('id, full_name, admission_no, class_id, reports(id, term, session, created_at)')
      .order('full_name'),
  ])

  const classes: SchoolClass[] =
    profile.role === 'admin'
      ? ((classData ?? []) as SchoolClass[])
      : ((classData ?? []) as unknown as { classes: SchoolClass }[])
          .map((r) => r.classes)
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name))
  const students = (studentData ?? []) as unknown as StudentRow[]
  const session = currentSession()

  return (
    <PortalShell label="Teacher Portal" title="Upload Report Sheets" userName={profile.full_name}>
      {classes.length > 0 && (
        <div className="rounded-2xl border border-navy/[0.09] p-6 md:p-8">
          <h2 className="font-display font-bold text-navy text-xl tracking-tight mb-4">
            Upload many at once
          </h2>
          <BatchUploader defaultSession={session} />
        </div>
      )}
      {classes.length === 0 && (
        <p className="text-navy/55 text-sm">
          You haven&apos;t been assigned to a class yet. Please contact the school admin.
        </p>
      )}
      {classes.map((cls) => {
        const inClass = students.filter((s) => s.class_id === cls.id)
        return (
          <div key={cls.id}>
            <h2 className="font-display font-bold text-navy text-2xl tracking-tight mb-4">{cls.name}</h2>
            {inClass.length === 0 && <p className="text-navy/50 text-sm">No students in this class.</p>}
            <div className="space-y-4">
              {inClass.map((s) => (
                <details key={s.id} className="rounded-2xl border border-navy/[0.09] p-5 group">
                  <summary className="cursor-pointer flex items-center justify-between list-none">
                    <span className="text-navy font-semibold">{s.full_name}</span>
                    <span className="text-navy/40 text-xs">
                      {s.admission_no} · {s.reports.length} report{s.reports.length === 1 ? '' : 's'}
                    </span>
                  </summary>
                  <div className="mt-5 space-y-6">
                    {s.reports.length > 0 && (
                      <ul className="divide-y divide-navy/[0.07]">
                        {s.reports
                          .sort((a, b) => b.session.localeCompare(a.session) || b.term - a.term)
                          .map((r) => (
                            <li key={r.id} className="flex items-center justify-between py-2 text-sm">
                              <span className="text-navy">
                                {r.session} · Term {r.term}
                              </span>
                              <span className="flex items-center gap-4">
                                <a
                                  href={`/api/reports/${r.id}/download`}
                                  className="text-wine font-semibold hover:underline underline-offset-4"
                                >
                                  View
                                </a>
                                <form action={deleteReport}>
                                  <input type="hidden" name="reportId" value={r.id} />
                                  <button type="submit" className="text-navy/40 hover:text-red-600">
                                    Delete
                                  </button>
                                </form>
                              </span>
                            </li>
                          ))}
                      </ul>
                    )}
                    <SingleUpload studentId={s.id} defaultSession={session} />
                  </div>
                </details>
              ))}
            </div>
          </div>
        )
      })}
    </PortalShell>
  )
}
