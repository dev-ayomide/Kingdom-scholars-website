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
        kicker="Parent portal"
        title="Your children's"
        accent="report sheets"
        intro="Press the red button next to a term to download its report sheet. It opens as a PDF that you can read, print or save."
      />

      <Container className="py-12 md:py-16 space-y-10">
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
              <article key={child.id} className="ks-panel overflow-hidden shadow-[0_8px_30px_rgba(27,42,74,0.06)]" aria-labelledby={`c-${child.id}`}>
                <div className="px-6 sm:px-8 pt-7 pb-6 border-b border-navy/15 bg-[#F5F0E8]/60">
                  <h2 id={`c-${child.id}`} className="text-[2.1rem] font-bold leading-tight">{titleCase(child.full_name)}</h2>
                  <p className="text-[1.15rem] text-navy/75 mt-1">
                    {child.classes ? titleCase(child.classes.name) : ''}
                    {child.classes ? ' · ' : ''}Admission number {child.admission_no}
                  </p>
                </div>

                {reports.length === 0 ? (
                  <div className="p-6 sm:p-8">
                    <Notice tone="info" lead="No report sheet yet.">
                      When the school uploads one, we will send you an email.
                    </Notice>
                  </div>
                ) : (
                  <ul className="divide-y divide-navy/12">
                    {reports.map((r, i) => (
                      <li key={r.id} className="flex flex-wrap items-center justify-between gap-4 px-6 sm:px-8 py-5">
                        <div>
                          <p className="text-[1.5rem] font-bold leading-snug">
                            {termName(r.term)}
                            {i === 0 && (
                              <span className="ml-3 align-middle inline-block text-[1rem] font-bold uppercase tracking-wider bg-navy text-white px-2.5 py-1 rounded">
                                Newest
                              </span>
                            )}
                          </p>
                          <p className="text-[1.15rem] text-navy/75">School year {sessionLabel(r.session)}</p>
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
