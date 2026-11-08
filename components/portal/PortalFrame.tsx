import Link from 'next/link'
import Image from 'next/image'
import NavLinks, { type NavItem } from './NavLinks'
import NavProgress from './NavProgress'
import SideNav from './SideNav'
import { Container } from './kit'
import { logout } from '@/app/(portal)/login/actions'
import { SCHOOL_PHONE, SCHOOL_PHONE_HREF, titleCase } from '@/lib/format'
import type { UserRole } from '@/lib/types'

const NAV: Record<UserRole, NavItem[]> = {
  parent: [
    { label: 'Report sheets', href: '/portal' },
    { label: 'Help', href: '/help' },
  ],
  teacher: [
    { label: 'Report sheets', href: '/teacher', icon: 'report' },
    { label: 'Help', href: '/help', icon: 'help' },
  ],
  admin: [
    { label: 'Home', href: '/admin', icon: 'home' },
    { label: 'Report sheets', href: '/teacher', icon: 'report' },
    { label: 'Children', href: '/admin/students', icon: 'book' },
    { label: 'Parents', href: '/admin/parents', icon: 'users' },
    { label: 'Staff', href: '/admin/staff', icon: 'staff' },
    { label: 'Help', href: '/help', icon: 'help' },
  ],
}
const HOME: Record<UserRole, string> = { parent: '/portal', teacher: '/teacher', admin: '/admin' }
const ROLE_WORD: Record<UserRole, string> = { parent: 'Parent', teacher: 'Teacher', admin: 'Administrator' }

export function HelpFooter() {
  return (
    <footer className="border-t border-[#D5DAE1] bg-white mt-10">
      <Container className="py-5 text-[1.0625rem]">
        <p>
          <strong>Need help?</strong> Call the school office on{' '}
          <a href={SCHOOL_PHONE_HREF} className="ks-link">{SCHOOL_PHONE}</a>, Monday to Friday, 7:30am to 4:00pm.
        </p>
      </Container>
    </footer>
  )
}

function Brand({ sub }: { sub: string }) {
  return (
    <span className="flex items-center gap-3 min-w-0">
      <span className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-white/30">
        <Image src="/images/logo.jpg" alt="" fill className="object-cover" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block font-display font-bold text-[1.25rem] truncate">Kingdom Scholars</span>
        <span className="block text-[0.9375rem] text-white/75 truncate">{sub}</span>
      </span>
    </span>
  )
}

export default function PortalFrame({
  role, name, children,
}: { role: UserRole; name: string; children: React.ReactNode }) {
  // Parents have one page, so they get a simple top bar. Staff get a side menu.
  if (role === 'parent') {
    return (
      <>
        <NavProgress />
        <div className="relative bg-navy text-white">
          <Container className="!max-w-6xl flex items-center justify-between gap-4 min-h-[4.5rem] py-3">
            <Link href={HOME[role]} className="min-w-0 flex-1" aria-label="Kingdom Scholars, back to your home page"><Brand sub={`Parent portal · ${titleCase(name)}`} /></Link>
            <NavLinks items={NAV[role]} />
          </Container>
        </div>
        <main>{children}</main>
        <HelpFooter />
      </>
    )
  }

  return (
    <div className="lg:flex min-h-screen">
      <NavProgress />
      <aside className="hidden lg:flex lg:flex-col w-72 shrink-0 bg-navy text-white sticky top-0 h-screen">
        <Link href={HOME[role]} className="block px-5 py-5 border-b border-white/15" aria-label="Kingdom Scholars, back to the home page">
          <Brand sub="Staff office" />
        </Link>
        <SideNav items={NAV[role]} />
        <div className="px-5 py-5 border-t border-white/15 space-y-3">
          <p className="leading-snug">
            <span className="block font-semibold truncate">{titleCase(name)}</span>
            <span className="block text-[0.9375rem] text-white/75">{ROLE_WORD[role]}</span>
          </p>
          <Link href="/auth/set-password" className="block text-[1rem] text-white/85 underline underline-offset-4 hover:text-white">Change password</Link>
          <form action={logout}>
            <button type="submit" className="w-full min-h-[2.75rem] px-4 text-[1.0625rem] font-semibold text-white border-2 border-white/60 rounded-md hover:bg-white hover:text-navy transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="lg:hidden relative bg-navy text-white">
          <div className="flex items-center justify-between gap-4 min-h-[4.5rem] px-5 py-3">
            <Link href={HOME[role]} className="min-w-0 flex-1" aria-label="Kingdom Scholars, back to the home page"><Brand sub={`${ROLE_WORD[role]} · ${titleCase(name)}`} /></Link>
            <NavLinks items={NAV[role]} inline={false} />
          </div>
        </div>
        <main className="flex-1">{children}</main>
        <HelpFooter />
      </div>
    </div>
  )
}

// Frame for pages where nobody is signed in yet (login, password reset).
export function PlainFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-navy text-white">
        <Container className="!max-w-6xl flex items-center gap-3 min-h-[4.5rem] py-3">
          <Link href="/" aria-label="Kingdom Scholars Private School website"><Brand sub="Private School · Abeokuta" /></Link>
        </Container>
      </div>
      <main>{children}</main>
      <HelpFooter />
    </>
  )
}
