'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/(portal)/login/actions'

export interface NavItem { label: string; href: string }

export default function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])

  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(href + '/'))

  return (
    <>
      {/* Wide screens: everything in one row */}
      <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            aria-current={isActive(it.href) ? 'page' : undefined}
            className={`px-4 py-3 text-[1.125rem] font-bold rounded-md border-b-[3px] transition-colors ${
              isActive(it.href) ? 'text-white border-[#E9C6A0]' : 'text-white/75 border-transparent hover:text-white hover:bg-white/10'
            }`}
          >
            {it.label}
          </Link>
        ))}
        <form action={logout} className="ml-3">
          <button type="submit" className="min-h-[3rem] px-5 text-[1.125rem] font-bold text-white border-2 border-white/60 rounded-md hover:bg-white hover:text-navy transition-colors">
            Sign out
          </button>
        </form>
      </nav>

      {/* Narrow screens: one big Menu button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="portal-menu"
        className="lg:hidden min-h-[3rem] px-5 text-[1.125rem] font-bold text-white border-2 border-white/60 rounded-md"
      >
        {open ? 'Close' : 'Menu'}
      </button>
      {open && (
        <div id="portal-menu" className="lg:hidden absolute left-0 right-0 top-full bg-navy border-t border-white/15 shadow-xl z-40">
          <nav className="max-w-4xl mx-auto px-5 py-3 flex flex-col" aria-label="Main">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                aria-current={isActive(it.href) ? 'page' : undefined}
                className={`py-4 text-[1.3rem] font-bold border-b border-white/10 ${isActive(it.href) ? 'text-[#E9C6A0]' : 'text-white'}`}
              >
                {it.label}
              </Link>
            ))}
            <form action={logout} className="py-4">
              <button type="submit" className="w-full min-h-[3.5rem] text-[1.25rem] font-bold text-white border-2 border-white/60 rounded-md">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      )}
    </>
  )
}
