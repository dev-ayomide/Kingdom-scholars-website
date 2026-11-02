import Link from 'next/link'
import { logout } from '@/app/login/actions'

interface PortalShellProps {
  label: string
  title: string
  userName: string
  children: React.ReactNode
}

export default function PortalShell({ label, title, userName, children }: PortalShellProps) {
  return (
    <>
      <section className="bg-cream pt-nav border-b border-navy/[0.07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-7 h-[1.5px] bg-wine shrink-0" aria-hidden />
              <span className="text-wine text-[11px] tracking-[0.25em] uppercase font-medium">{label}</span>
            </div>
            <h1
              className="font-display font-bold text-navy leading-[0.97] tracking-tight"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}
            >
              {title}
            </h1>
          </div>
          <form action={logout} className="flex items-center gap-4">
            <span className="text-navy/55 text-sm">{userName}</span>
            <Link
              href="/auth/set-password"
              className="text-navy/55 text-sm hover:text-wine transition-colors"
            >
              Change password
            </Link>
            <button
              type="submit"
              className="border border-navy/20 text-navy px-5 py-2 text-sm font-semibold rounded-full hover:bg-navy hover:text-white transition-all duration-200"
            >
              Log out
            </button>
          </form>
        </div>
      </section>
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">{children}</div>
      </section>
    </>
  )
}
