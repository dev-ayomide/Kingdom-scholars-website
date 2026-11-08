import type { Metadata } from 'next'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { sessionLabel, termName, titleCase } from '@/lib/format'
import PortalFrame from '@/components/portal/PortalFrame'
import { Container, DownloadIcon, Notice, PageHeader } from '@/components/portal/kit'
import type { Report } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Report sheets',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

interface ChildRow {
  id: string
  full_name: string
  admission_no: string
  classes: { name: string } | null
  reports: Report[]
}

export default async function ParentPage() {
  // Row-level security limits this to the parent's own children. Fetched at the
  // same time as the role check, so the page needs only one wait.
  const [{ profile }, { data }] = await Promise.all([
    requireRole(['parent']),
    createClient()
      .from('students')
      .select('id, full_name, admission_no, classes(name), reports(id, term, session, created_at)')
      .order('full_name'),
  ])
  const children = (data ?? []) as unknown as ChildRow[]

  return (
    <PortalFrame role={profile.role} name={profile.full_name}>
      <PageHeader
        title="Your children's report sheets"
        intro="Press the Download button next to a term to get its report sheet. It opens as a PDF that you can read, print or save."
      />

      <Container className="py-8 space-y-6">
        {children.length === 0 ? (
          <Notice tone="info" lead="No children are connected to your account yet.">
            Please call the school office and they will connect them for you.
          </Notice>
        ) : (
          children.map((child) => {
            const reports = [...child.reports].sort((a, b) =>
              a.session === b.session ? b.term - a.term : b.session.localeCompare(a.session)
            )
            return (
              <article key={child.id} className="ks-panel overflow-hidden" aria-labelledby={`c-${child.id}`}>
                <div className="px-5 sm:px-7 py-5 border-b border-[#E3E7EC] bg-[#F7F8FA]">
                  <h2 id={`c-${child.id}`}>{titleCase(child.full_name)}</h2>
                  <p className="ks-muted">
                    {child.classes ? titleCase(child.classes.name) : ''}
                    {child.classes ? ' · ' : ''}Admission number {child.admission_no}
                  </p>
                </div>

                {reports.length === 0 ? (
                  <div className="p-5 sm:p-7">
                    <Notice tone="info" lead="No report sheet yet.">
                      When the school uploads one, we will send you an email.
                    </Notice>
                  </div>
                ) : (
                  <ul className="divide-y divide-[#E3E7EC]">
                    {reports.map((r, i) => (
                      <li key={r.id} className="flex flex-wrap items-center justify-between gap-4 px-5 sm:px-7 py-4">
                        <div>
                          <p className="font-bold text-[1.1875rem] leading-snug">
                            {termName(r.term)}
                            {i === 0 && (
                              <span className="ml-3 align-middle inline-block text-[0.9375rem] font-semibold bg-navy text-white px-2 py-0.5 rounded">
                                Newest
                              </span>
                            )}
                          </p>
                          <p className="ks-muted">School year {sessionLabel(r.session)}</p>
                        </div>
                        <a href={`/api/reports/${r.id}/download`} className="ks-btn ks-btn-primary w-full sm:w-auto">
                          <DownloadIcon /> Download PDF
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            )
          })
        )}
      </Container>
    </PortalFrame>
  )
}
