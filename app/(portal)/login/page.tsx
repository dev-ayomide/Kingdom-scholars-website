import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from './LoginForm'
import { PlainFrame } from '@/components/portal/PortalFrame'
import { Container, Notice } from '@/components/portal/kit'

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
      <section className="ks-ruled min-h-[70vh]">
        <Container className="py-12 md:py-20 grid md:grid-cols-[1fr_26rem] gap-10 md:gap-16 items-start">
          <div className="ks-rise">
            <p className="ks-kicker mb-3">Parents and staff</p>
            <h1 className="font-bold leading-[1.05]" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.25rem)' }}>
              Welcome <em className="text-wine italic">back</em>
            </h1>
            <p className="mt-5 text-[1.3rem] leading-relaxed text-navy/85 max-w-md">
              Sign in to see and download your child&apos;s report sheet. Your email address and password were
              set up through the school office.
            </p>
            <p className="mt-6 ks-hint max-w-md">
              This is the first time? Use the link in the welcome email from the school to choose a password.
            </p>
          </div>

          <div className="ks-panel p-6 sm:p-8 shadow-[0_8px_30px_rgba(27,42,74,0.08)] ks-rise" style={{ animationDelay: '0.1s' }}>
            {searchParams.error && ERRORS[searchParams.error] && (
              <div className="mb-6"><Notice tone="bad">{ERRORS[searchParams.error]}</Notice></div>
            )}
            <LoginForm next={searchParams.next ?? ''} />
            <p className="mt-6 pt-6 border-t border-navy/15">
              <Link href="/auth/forgot" className="ks-link">I forgot my password</Link>
            </p>
          </div>
        </Container>
      </section>
    </PlainFrame>
  )
}
