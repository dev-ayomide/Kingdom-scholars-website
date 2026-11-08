import type { Metadata } from 'next'
import Link from 'next/link'
import { requireRole } from '@/lib/auth'
import { loadAdminCounts } from '@/lib/admin-data'
import { greeting, titleCase } from '@/lib/format'
import PortalFrame from '@/components/portal/PortalFrame'
import { BookIcon, ChevronIcon, Container, FileIcon, MailIcon, PageHeader, StaffIcon, Stat, UsersIcon } from '@/components/portal/kit'

export const metadata: Metadata = {
  title: 'Home',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminHome() {
  // The sign-in check and the numbers are fetched at the same time.
  const [{ profile }, c] = await Promise.all([requireRole(['admin']), loadAdminCounts()])
  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

  const tasks = [
    {
      href: '/teacher', Icon: FileIcon, title: 'Upload report sheets',
      text: 'Add the PDF report sheets for a term, one at a time or many together.',
    },
    {
      href: '/admin/parents#welcome', Icon: MailIcon, title: 'Send welcome emails',
      text: c.waiting === 0
        ? 'Everyone has signed in, so no emails are needed.'
        : `${plural(c.waiting, 'person has', 'people have')} not signed in yet. Email them a button to choose a password.`,
    },
    {
      href: '/admin/parents', Icon: UsersIcon, title: 'Parents',
      text: 'Add parents, and connect each parent to their children.',
    },
    {
      href: '/admin/students', Icon: BookIcon, title: 'Children and classes',
      text: 'Add classes and children, or move a child up to a new class.',
    },
    {
      href: '/admin/staff', Icon: StaffIcon, title: 'Teachers and staff',
      text: 'Give a teacher or the office a login, and choose each teacher’s class.',
    },
  ]

  return (
    <PortalFrame role={profile.role} name={profile.full_name}>
      <PageHeader title="Home" intro={`${greeting()}, ${titleCase(profile.full_name)}. Here is where things stand.`} />

      <Container className="py-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Children" value={c.students} note={`in ${plural(c.classes, 'class', 'classes')}`} />
          <Stat label="Parents" value={c.parents} note="with a login" />
          <Stat label="Report sheets" value={c.reports} note="uploaded so far" />
          <Stat label="Not signed in yet" value={c.waiting} note={c.waiting === 0 ? 'everyone has signed in' : 'need a welcome email'} />
        </div>

        <section aria-labelledby="todo-h" className="ks-panel">
          <div className="px-5 sm:px-7 pt-6 pb-4 border-b border-[#E3E7EC]">
            <h2 id="todo-h">What would you like to do?</h2>
          </div>
          <ul className="divide-y divide-[#E3E7EC]">
            {tasks.map(({ href, Icon, title, text }) => (
              <li key={href}>
                <Link href={href} className="flex items-center gap-4 px-5 sm:px-7 py-5 hover:bg-[#F7F8FA] transition-colors">
                  <span className="shrink-0 w-12 h-12 rounded-md bg-navy/8 text-navy flex items-center justify-center"><Icon className="w-6 h-6" /></span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-[1.1875rem]">{title}</span>
                    <span className="block ks-muted">{text}</span>
                  </span>
                  <ChevronIcon className="w-6 h-6 text-[#4A5568] shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </PortalFrame>
  )
}
