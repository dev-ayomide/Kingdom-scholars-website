import Link from 'next/link'
import Image from 'next/image'
import NavLinks, { type NavItem } from './NavLinks'
import { Container } from './kit'
import { SCHOOL_PHONE, SCHOOL_PHONE_HREF, titleCase } from '@/lib/format'
import type { UserRole } from '@/lib/types'

const NAV: Record<UserRole, NavItem[]> = {
  parent: [
    { label: 'Report sheets', href: '/portal' },
    { label: 'Help', href: '/help' },
  ],
  teacher: [
    { label: 'Report sheets', href: '/teacher' },
    { label: 'Help', href: '/help' },
  ],
  admin: [
    { label: 'Home', href: '/admin' },
    { label: 'Report sheets', href: '/teacher' },
    { label: 'Children', href: '/admin/students' },
    { label: 'Parents', href: '/admin/parents' },
    { label: 'Staff', href: '/admin/staff' },
    { label: 'Help', href: '/help' },
  ],
}
const HOME: Record<UserRole, string> = { parent: '/portal', teacher: '/teacher', admin: '/admin' }
const AREA: Record<UserRole, string> = { parent: 'Parent portal', teacher: 'Staff office', admin: 'Staff office' }

export function HelpFooter() {
  return (
    <footer className="border-t border-navy/15 mt-8 bg-[#F5F0E8]/70">
      <Container className="py-8 text-[1.1875rem]">
        <p>
          <strong>Need help?</strong> Call the school office on{' '}
          <a href={SCHOOL_PHONE_HREF} className="ks-link">{SCHOOL_PHONE}</a>, Monday to Friday, 7:30am to 4:00pm.
        </p>
      </Container>
    </footer>
  )
}

export default function PortalFrame({
  role, name, children,
}: { role: UserRole; name: string; children: React.ReactNode }) {
  return (
    <>
      <div className="relative bg-navy text-white">
        <Container className="!max-w-6xl flex items-center justify-between gap-4 min-h-[5rem] py-3">
          <Link href={HOME[role]} className="flex items-center gap-3 min-w-0" aria-label="Kingdom Scholars, back to your home page">
            <span className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-white/30">
              <Image src="/images/logo.jpg" alt="" fill className="object-cover" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block font-display font-bold text-[1.35rem] truncate">Kingdom Scholars</span>
              <span className="block text-[1rem] text-white/75 truncate">{AREA[role]} · {titleCase(name)}</span>
            </span>
          </Link>
          <NavLinks items={NAV[role]} />
        </Container>
      </div>
      <main>{children}</main>
      <HelpFooter />
    </>
  )
}

// Frame for pages where nobody is signed in yet (login, password reset).
export function PlainFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-navy text-white">
        <Container className="!max-w-6xl flex items-center gap-3 min-h-[5rem] py-3">
          <Link href="/" className="flex items-center gap-3" aria-label="Kingdom Scholars Private School website">
            <span className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-white/30">
              <Image src="/images/logo.jpg" alt="" fill className="object-cover" />
            </span>
            <span className="leading-tight">
              <span className="block font-display font-bold text-[1.35rem]">Kingdom Scholars</span>
              <span className="block text-[1rem] text-white/75">Private School · Abeokuta</span>
            </span>
          </Link>
        </Container>
      </div>
      <main>{children}</main>
      <HelpFooter />
    </>
  )
}
