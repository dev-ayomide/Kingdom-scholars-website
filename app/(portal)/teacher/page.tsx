import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { currentSession, sessionLabel, sessionOptions, termName, titleCase } from '@/lib/format'
import PortalFrame from '@/components/portal/PortalFrame'
import SingleUpload from '@/components/portal/SingleUpload'
import BatchUploader from '@/components/portal/BatchUploader'
import ConfirmSubmit from '@/components/portal/ConfirmSubmit'
import { CheckIcon, Container, PageHeader, Section } from '@/components/portal/kit'
import { deleteReport } from '@/lib/actions/reports'
import type { Report, SchoolClass } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Report sheets',
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

export default async function ReportSheetsPage() {
  // Everything is fetched at the same time (the token check is local and instant).
  // Row-level security decides what each person actually gets back.
  const supabase = createClient()
  const { data: auth } = await supabase.auth.getClaims()
  const userId = auth?.claims?.sub
  if (!userId) redirect('/login')

  const [{ profile }, allClasses, myClasses, { data: studentData }] = await Promise.all([
    requireRole(['teacher', 'admin']),
    supabase.from('classes').select('id, name').order('name'),
    supabase.from('teacher_classes').select('classes(id, name)').eq('teacher_id', userId),
    supabase
      .from('students')
      .select('id, full_name, admission_no, class_id, reports(id, term, session, created_at)')
      .order('full_name'),
  ])

  const classes: SchoolClass[] =
    profile.role === 'admin'
      ? ((allClasses.data ?? []) as SchoolClass[])
      : ((myClasses.data ?? []) as unknown as { classes: SchoolClass }[])
          .map((r) => r.classes)
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name))
  const students = (studentData ?? []) as unknown as StudentRow[]
  const session = currentSession()
  const sessions = sessionOptions()

  return (
    <PortalFrame role={profile.role} name={profile.full_name}>
      <PageHeader
        title="Report sheets"
        intro="Upload the PDF report sheets for a term. Follow the three steps. Nothing is sent until you press the last button, and you can check every file first."
      />

      <Container className="py-8 space-y-8">
        {classes.length === 0 ? (
          <div className="ks-panel p-7">
            <h2 className="mb-1">No class yet</h2>
            <p>You have not been given a class yet. Please call the school office and ask for a class to be set up for you.</p>
          </div>
        ) : (
          <Section id="upload" title="Upload report sheets">
            <BatchUploader sessions={sessions} defaultSession={session} />
          </Section>
        )}

        {classes.length > 0 && (
          <Section
            id="overview"
            title={`Who has a report sheet? (${sessionLabel(session)})`}
            hint="Open a class to see each child. You can also add or replace one child's report sheet from here."
          >
            <div className="space-y-3">
              {classes.map((cls) => {
                const inClass = students.filter((s) => s.class_id === cls.id)
                const has = (s: StudentRow, t: number) => s.reports.some((r) => r.session === session && r.term === t)
                return (
                  <details key={cls.id} className="ks-panel group" open={classes.length === 1}>
                    <summary className="cursor-pointer list-none flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-4">
                      <span className="font-bold text-[1.1875rem]">{titleCase(cls.name)}</span>
                      <span className="ks-muted">
                        {inClass.length} {inClass.length === 1 ? 'child' : 'children'}
                        <span className="ml-3 ks-link group-open:hidden">Open</span>
                        <span className="ml-3 ks-link hidden group-open:inline">Close</span>
                      </span>
                    </summary>

                    <div className="border-t border-[#E3E7EC]">
                      {inClass.length > 0 && (
                        <p className="px-5 py-2.5 bg-[#F3F5F8] ks-muted border-b border-[#E3E7EC]">
                          Report sheets uploaded this year:{' '}
                          {[1, 2, 3].map((t) => `${termName(t)} ${inClass.filter((s) => has(s, t)).length} of ${inClass.length}`).join(' · ')}
                        </p>
                      )}
                      {inClass.length === 0 && <p className="p-5 ks-muted">There are no children in this class yet.</p>}
                      {inClass.map((s) => (
                        <details key={s.id} className="border-b border-[#E3E7EC] last:border-0 group/c">
                          <summary className="cursor-pointer list-none px-5 py-3.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 hover:bg-[#F7F8FA]">
                            <span className="font-semibold text-[1.0625rem]">{titleCase(s.full_name)}</span>
                            <span className="flex items-center gap-4">
                              {[1, 2, 3].map((t) => (
                                <span key={t} className={`inline-flex items-center gap-1 ${has(s, t) ? 'text-[#14502F] font-semibold' : 'text-[#6B7587]'}`}>
                                  {has(s, t) ? <CheckIcon className="w-5 h-5" /> : <span aria-hidden className="w-5 text-center">–</span>}
                                  {['1st', '2nd', '3rd'][t - 1]}
                                  <span className="sr-only">{has(s, t) ? 'term report uploaded' : 'term report not uploaded'}</span>
                                </span>
                              ))}
                              <span className="ks-link">Add / change</span>
                            </span>
                          </summary>

                          <div className="px-5 pb-7 pt-3 space-y-6 bg-[#F7F8FA]">
                            <p className="ks-hint">Admission number: {s.admission_no}</p>
                            {s.reports.length > 0 && (
                              <div>
                                <h3 className="mb-2">Report sheets already uploaded</h3>
                                <div className="ks-panel overflow-x-auto">
                                  <table className="ks-table">
                                    <tbody>
                                      {[...s.reports]
                                        .sort((a, b) => b.session.localeCompare(a.session) || b.term - a.term)
                                        .map((r) => (
                                          <tr key={r.id}>
                                            <td>{termName(r.term)}, {sessionLabel(r.session)}</td>
                                            <td className="text-right whitespace-nowrap">
                                              <span className="inline-flex items-center gap-3">
                                                <a href={`/api/reports/${r.id}/download`} className="ks-btn ks-btn-quiet ks-btn-small">View</a>
                                                <form action={deleteReport}>
                                                  <input type="hidden" name="reportId" value={r.id} />
                                                  <ConfirmSubmit
                                                    label="Remove"
                                                    message={`Remove ${termName(r.term)} (${sessionLabel(r.session)}) for ${titleCase(s.full_name)}? The parents will no longer be able to download it.`}
                                                  />
                                                </form>
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                            <div>
                              <h3 className="mb-3">Add or replace a report sheet</h3>
                              <SingleUpload studentId={s.id} sessions={sessions} defaultSession={session} />
                            </div>
                          </div>
                        </details>
                      ))}
                    </div>
                  </details>
                )
              })}
            </div>
          </Section>
        )}
      </Container>
    </PortalFrame>
  )
}
