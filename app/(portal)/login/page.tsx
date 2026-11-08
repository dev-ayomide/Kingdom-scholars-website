import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from './LoginForm'
import { PlainFrame } from '@/components/portal/PortalFrame'
import { Notice } from '@/components/portal/kit'

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
}

const ERRORS: Record<string, string> = {
  link: 'That link has expired or has already been used. Choose "I forgot my password" below and we will send you a new one.',
  'no-profile': 'Your account is not set up yet. Please call the school office.',
}

export default function LoginPage({ searchParams }: { searchParams: { next?: string; error?: string } }) {
  return (
    <PlainFrame>
      <section className="py-10 md:py-16 px-5">
        <div className="max-w-md mx-auto">
          <h1 className="mb-2">Welcome back</h1>
          <p className="ks-muted mb-6">
            Sign in to see and download your child&apos;s report sheet. Your email address and password were set up through the school office.
          </p>
          <div className="ks-panel p-6 sm:p-7">
            {searchParams.error && ERRORS[searchParams.error] && (
              <div className="mb-5"><Notice tone="bad">{ERRORS[searchParams.error]}</Notice></div>
            )}
            <LoginForm next={searchParams.next ?? ''} />
            <p className="mt-5 pt-5 border-t border-[#E3E7EC]">
              <Link href="/auth/forgot" className="ks-link">I forgot my password</Link>
            </p>
          </div>
          <p className="ks-hint mt-5">
            First time here? Use the button in the welcome email from the school to choose a password.
          </p>
        </div>
      </section>
    </PlainFrame>
  )
}
