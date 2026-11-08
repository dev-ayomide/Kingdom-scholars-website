import type { Metadata } from 'next'
import Link from 'next/link'
import { requireRole } from '@/lib/auth'
import { loadAdminCounts } from '@/lib/admin-data'
import { greeting, titleCase } from '@/lib/format'
import PortalFrame from '@/components/portal/PortalFrame'
import { ArrowIcon, Container, PageHeader } from '@/components/portal/kit'

export const metadata: Metadata = {
  title: 'Staff office',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminHome() {
  // The sign-in check and the numbers are fetched at the same time.
  const [{ profile }, c] = await Promise.all([requireRole(['admin']), loadAdminCounts()])
  const waiting = c.waiting
  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

  const tasks = [
    {
      href: '/teacher',
      title: 'Upload report sheets',
      text: 'Add the PDF report sheets for a term, one at a time or many together.',
      stat: plural(c.reports, 'report sheet', 'report sheets'),
      note: 'uploaded so far',
    },
    {
      href: '/admin/parents#welcome',
      title: 'Send welcome emails',
      text: 'Email parents and staff a button to choose their password and sign in.',
      stat: waiting === 0 ? 'Everyone' : String(waiting),
      note: waiting === 0 ? 'has signed in' : waiting === 1 ? 'person has not signed in yet' : 'people have not signed in yet',
    },
    {
      href: '/admin/parents',
      title: 'Parents',
      text: 'Add parents, and connect each parent to their children.',
      stat: plural(c.parents, 'parent', 'parents'),
      note: 'on the portal',
    },
    {
      href: '/admin/students',
      title: 'Children and classes',
      text: 'Add classes and children, or move a child up to a new class.',
      stat: plural(c.students, 'child', 'children'),
      note: `in ${plural(c.classes, 'class', 'classes')}`,
    },
    {
      href: '/admin/staff',
      title: 'Teachers and staff',
      text: 'Give a teacher or the office a login, and choose each teacher’s class.',
      stat: plural(c.staff, 'person', 'people'),
      note: 'with staff logins',
    },
  ]

  return (
    <PortalFrame role={profile.role} name={profile.full_name}>
      <PageHeader
        kicker="Staff office"
        title={`${greeting()},`}
        accent={titleCase(profile.full_name)}
        intro="What would you like to do today? Choose a line below. Each one opens its own page, with simple steps."
      />

      <Container className="py-12 md:py-16">
        <nav aria-label="What you can do">
          <ol className="border-t-[3px] border-double border-navy">
            {tasks.map((t, i) => (
              <li key={t.href} className="border-b border-navy/25 ks-rise" style={{ animationDelay: `${0.05 * i}s` }}>
                <Link
                  href={t.href}
                  className="ks-toc-row grid grid-cols-[3.25rem_1fr] sm:grid-cols-[4.5rem_1fr_auto] items-center gap-x-4 sm:gap-x-6 gap-y-3 py-7 px-2 sm:px-4 -mx-2 sm:-mx-4"
                >
                  <span className="font-display italic font-bold text-wine text-5xl sm:text-6xl leading-none">{i + 1}</span>
                  <span>
                    <span className="block font-display font-bold text-[1.8rem] sm:text-[2.1rem] leading-tight">{t.title}</span>
                    <span className="block mt-1 text-[1.2rem] text-navy/80 max-w-xl">{t.text}</span>
                  </span>
                  <span className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-end gap-6">
                    <span className="sm:text-right leading-tight">
                      <span className="block font-bold text-[1.35rem]">{t.stat}</span>
                      <span className="block text-[1.05rem] text-navy/70">{t.note}</span>
                    </span>
                    <ArrowIcon className="ks-toc-arrow w-9 h-9 text-wine shrink-0" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </Container>
    </PortalFrame>
  )
}
