'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/(portal)/login/actions'
import type { NavIconName } from './kit'

export interface NavItem { label: string; href: string; icon?: NavIconName }

// Top navigation. With inline=true (parents) the links sit in the bar on wide
// screens; on narrow screens, and always when inline=false (staff, who have a
// side menu), everything is behind one big Menu button.
export default function NavLinks({ items, inline = true }: { items: NavItem[]; inline?: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])

  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(href + '/'))
  const hide = inline ? 'lg:hidden' : ''

  return (
    <>
      {inline && (
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              aria-current={isActive(it.href) ? 'page' : undefined}
              className={`px-4 py-3 text-[1.0625rem] font-semibold rounded-md border-b-[3px] transition-colors ${
                isActive(it.href) ? 'text-white border-[#E9C6A0]' : 'text-white/80 border-transparent hover:text-white hover:bg-white/10'
              }`}
            >
              {it.label}
            </Link>
          ))}
          <Link href="/auth/set-password" className="px-4 py-3 text-[1.0625rem] font-semibold text-white/80 hover:text-white">Change password</Link>
          <form action={logout} className="ml-2">
            <button type="submit" className="min-h-[2.75rem] px-5 text-[1.0625rem] font-semibold text-white border-2 border-white/60 rounded-md hover:bg-white hover:text-navy transition-colors">
              Sign out
            </button>
          </form>
        </nav>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="portal-menu"
        className={`${hide} min-h-[2.75rem] px-5 text-[1.0625rem] font-semibold text-white border-2 border-white/60 rounded-md`}
      >
        {open ? 'Close' : 'Menu'}
      </button>
      {open && (
        <div id="portal-menu" className={`${hide} absolute left-0 right-0 top-full bg-navy border-t border-white/15 shadow-xl z-40`}>
          <nav className="px-5 py-2 flex flex-col" aria-label="Main">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                aria-current={isActive(it.href) ? 'page' : undefined}
                className={`py-4 text-[1.25rem] font-semibold border-b border-white/10 ${isActive(it.href) ? 'text-[#E9C6A0]' : 'text-white'}`}
              >
                {it.label}
              </Link>
            ))}
            <Link href="/auth/set-password" className="py-4 text-[1.25rem] font-semibold text-white border-b border-white/10">Change password</Link>
            <form action={logout} className="py-4">
              <button type="submit" className="w-full min-h-[3.25rem] text-[1.125rem] font-semibold text-white border-2 border-white/60 rounded-md">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      )}
    </>
  )
}
