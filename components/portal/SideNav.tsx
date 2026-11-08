'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ICONS } from './kit'
import type { NavItem } from './NavLinks'

// The staff side menu: icon + plain word for every place you can go.
export default function SideNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(href + '/'))
  return (
    <nav aria-label="Main" className="px-3 py-4 flex-1 overflow-y-auto">
      <ul className="space-y-1">
        {items.map((it) => {
          const Icon = it.icon ? NAV_ICONS[it.icon] : null
          const active = isActive(it.href)
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 min-h-[3rem] px-4 rounded-md text-[1.0625rem] font-semibold border-l-4 transition-colors ${
                  active ? 'bg-white/12 text-white border-[#E9C6A0]' : 'text-white/80 border-transparent hover:bg-white/8 hover:text-white'
                }`}
              >
                {Icon && <Icon className="w-5 h-5 shrink-0" />}
                {it.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
