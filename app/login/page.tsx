import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Parent & Staff Login',
  robots: { index: false, follow: false },
}

const ERRORS: Record<string, string> = {
  link: 'That link has expired or was already used. Choose "Forgot password" to get a new one.',
  'no-profile': 'Your account is not set up yet. Please contact the school office.',
}

export default function LoginPage({ searchParams }: { searchParams: { next?: string; error?: string } }) {
  return (
    <section className="bg-cream pt-nav min-h-screen">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-7 h-[1.5px] bg-wine shrink-0" aria-hidden />
          <span className="text-wine text-[11px] tracking-[0.25em] uppercase font-medium">Portal</span>
        </div>
        <h1 className="font-display font-bold text-navy text-4xl tracking-tight mb-3">
          Sign <em style={{ fontStyle: 'italic' }}>in</em>
        </h1>
        <p className="text-navy/55 text-sm leading-relaxed mb-8">
          Parents can download their children&apos;s report sheets here. Your login is created by the
          school office. If you don&apos;t have one, please contact us.
        </p>
        {searchParams.error && ERRORS[searchParams.error] && (
          <p role="alert" className="text-sm text-red-600 mb-4">{ERRORS[searchParams.error]}</p>
        )}
        <div className="bg-white rounded-2xl border border-navy/[0.09] p-8 shadow-[0_2px_24px_rgba(27,42,74,0.06)]">
          <LoginForm next={searchParams.next ?? ''} />
        </div>
        <p className="mt-5 text-sm">
          <Link href="/auth/forgot" className="text-wine font-semibold hover:underline underline-offset-4">
            Forgot password?
          </Link>
        </p>
      </div>
    </section>
  )
}
