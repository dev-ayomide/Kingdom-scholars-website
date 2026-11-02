import type { Metadata } from 'next'
import { requireRole } from '@/lib/auth'
import PortalShell from '@/components/portal/PortalShell'
import type { Report } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Parent Portal',
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

export default async function PortalPage() {
  const { supabase, profile } = await requireRole(['parent'])

  // RLS limits this to the parent's own children.
  const { data } = await supabase
    .from('students')
    .select('id, full_name, admission_no, classes(name), reports(id, term, session, created_at)')
    .order('full_name')
  const children = (data ?? []) as unknown as ChildRow[]

  return (
    <PortalShell label="Parent Portal" title="Report Sheets" userName={profile.full_name}>
      {children.length === 0 ? (
        <p className="text-navy/55 text-sm">
          No children are linked to your account yet. Please contact the school office.
        </p>
      ) : (
        children.map((child) => {
          const reports = [...child.reports].sort((a, b) =>
            a.session === b.session ? b.term - a.term : b.session.localeCompare(a.session)
          )
          return (
            <div key={child.id} className="rounded-2xl border border-navy/[0.09] p-6 md:p-8">
              <h2 className="font-display font-bold text-navy text-2xl tracking-tight">{child.full_name}</h2>
              <p className="text-navy/45 text-xs tracking-wide mt-1 mb-6">
                {child.classes?.name} · Admission no. {child.admission_no}
              </p>
              {reports.length === 0 ? (
                <p className="text-navy/50 text-sm">No report sheets have been uploaded yet.</p>
              ) : (
                <ul className="divide-y divide-navy/[0.07]">
                  {reports.map((r) => (
                    <li key={r.id} className="flex items-center justify-between py-3">
                      <span className="text-navy text-sm font-medium">
                        {r.session} · Term {r.term}
                      </span>
                      <a
                        href={`/api/reports/${r.id}/download`}
                        className="text-wine text-sm font-semibold hover:underline underline-offset-4"
                      >
                        Download PDF
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })
      )}
    </PortalShell>
  )
}
