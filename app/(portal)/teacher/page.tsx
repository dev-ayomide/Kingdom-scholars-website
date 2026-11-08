import type { Metadata } from 'next'
import { requireRole } from '@/lib/auth'
import { currentSession, sessionLabel, sessionOptions, termName, titleCase } from '@/lib/format'
import PortalFrame from '@/components/portal/PortalFrame'
import SingleUpload from '@/components/portal/SingleUpload'
import BatchUploader from '@/components/portal/BatchUploader'
import ConfirmSubmit from '@/components/portal/ConfirmSubmit'
import { CheckIcon, Container, PageHeader } from '@/components/portal/kit'
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
  const { supabase, profile } = await requireRole(['teacher', 'admin'])

  // RLS: a teacher only gets their assigned classes' students; an admin gets all.
  const [{ data: classData }, { data: studentData }] = await Promise.all([
    profile.role === 'admin'
      ? supabase.from('classes').select('id, name').order('name')
      : supabase.from('teacher_classes').select('classes(id, name)').eq('teacher_id', profile.id),
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
  const sessions = sessionOptions()

  return (
    <PortalFrame role={profile.role} name={profile.full_name}>
      <PageHeader
        kicker="Report sheets"
        title="Upload"
        accent="report sheets"
        intro="Follow the three steps below. Nothing is sent until you press the final button, and you can check every file first."
      />

      <Container className="py-12 md:py-16 space-y-20">
        {classes.length === 0 ? (
          <div className="ks-panel p-8">
            <h2 className="text-2xl font-bold mb-2">No class yet</h2>
            <p>You have not been given a class yet. Please call the school office and ask for a class to be set up for you.</p>
          </div>
        ) : (
          <BatchUploader sessions={sessions} defaultSession={session} />
        )}

        {classes.length > 0 && (
          <section aria-labelledby="who-heading">
            <div className="border-t-2 border-navy pt-8 mb-8">
              <p className="ks-kicker mb-2">Overview</p>
              <h2 id="who-heading" className="text-[2.1rem] font-bold leading-tight">
                Who has a report sheet? <span className="text-navy/60 font-normal text-[1.4rem]">({sessionLabel(session)})</span>
              </h2>
              <p className="mt-3 text-[1.2rem] max-w-2xl">
                Open a class to see each child. You can also add or replace one child&apos;s report sheet from here.
              </p>
            </div>

            <div className="space-y-4">
              {classes.map((cls) => {
                const inClass = students.filter((s) => s.class_id === cls.id)
                const has = (s: StudentRow, t: number) => s.reports.some((r) => r.session === session && r.term === t)
                return (
                  <details key={cls.id} className="ks-panel group" open={classes.length === 1}>
                    <summary className="cursor-pointer list-none flex flex-wrap items-center justify-between gap-x-6 gap-y-1 p-5 sm:p-6">
                      <span className="font-display font-bold text-[1.75rem]">{titleCase(cls.name)}</span>
                      <span className="text-[1.15rem] text-navy/80">
                        {inClass.length} {inClass.length === 1 ? 'child' : 'children'}
                        <span className="ml-3 ks-link group-open:hidden">Open</span>
                        <span className="ml-3 ks-link hidden group-open:inline">Close</span>
                      </span>
                    </summary>

                    <div className="border-t border-navy/15">
                      {inClass.length > 0 && (
                        <p className="px-5 sm:px-6 py-3 bg-[#F5F0E8]/70 text-[1.1rem] border-b border-navy/10">
                          Report sheets uploaded this year:{' '}
                          {[1, 2, 3].map((t) => `${termName(t)} ${inClass.filter((s) => has(s, t)).length} of ${inClass.length}`).join(' · ')}
                        </p>
                      )}
                      {inClass.length === 0 && <p className="p-6 text-navy/70">There are no children in this class yet.</p>}
                      {inClass.map((s) => (
                        <details key={s.id} className="border-b border-navy/10 last:border-0 group/c">
                          <summary className="cursor-pointer list-none px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 hover:bg-wine/[0.04]">
                            <span className="text-[1.3rem] font-bold">{titleCase(s.full_name)}</span>
                            <span className="flex items-center gap-4 text-[1.1rem]">
                              {[1, 2, 3].map((t) => (
                                <span key={t} className={`inline-flex items-center gap-1.5 ${has(s, t) ? 'text-[#14502F] font-bold' : 'text-navy/55'}`}>
                                  {has(s, t) ? <CheckIcon className="w-5 h-5" /> : <span aria-hidden className="w-5 text-center">–</span>}
                                  {['1st', '2nd', '3rd'][t - 1]}
                                  <span className="sr-only">{has(s, t) ? 'term report uploaded' : 'term report not uploaded'}</span>
                                </span>
                              ))}
                              <span className="ks-link text-[1.05rem]">Add / change</span>
                            </span>
                          </summary>

                          <div className="px-5 sm:px-6 pb-8 pt-2 space-y-8 bg-[#FBF8F2]">
                            <p className="ks-hint">Admission number: {s.admission_no}</p>
                            {s.reports.length > 0 && (
                              <div>
                                <h3 className="font-sans font-bold text-[1.2rem] mb-2">Report sheets already uploaded</h3>
                                <ul className="ks-panel divide-y divide-navy/10">
                                  {[...s.reports]
                                    .sort((a, b) => b.session.localeCompare(a.session) || b.term - a.term)
                                    .map((r) => (
                                      <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                                        <span className="text-[1.2rem]">{termName(r.term)}, {sessionLabel(r.session)}</span>
                                        <span className="flex items-center gap-3">
                                          <a href={`/api/reports/${r.id}/download`} className="ks-btn ks-btn-quiet ks-btn-small">View</a>
                                          <form action={deleteReport}>
                                            <input type="hidden" name="reportId" value={r.id} />
                                            <ConfirmSubmit
                                              label="Remove"
                                              message={`Remove ${termName(r.term)} (${sessionLabel(r.session)}) for ${titleCase(s.full_name)}? The parents will no longer be able to download it.`}
                                            />
                                          </form>
                                        </span>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            )}
                            <div>
                              <h3 className="font-sans font-bold text-[1.2rem] mb-4">Add or replace a report sheet</h3>
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
          </section>
        )}
      </Container>
    </PortalFrame>
  )
}
