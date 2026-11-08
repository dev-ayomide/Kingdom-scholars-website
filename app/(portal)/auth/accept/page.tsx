import type { Metadata } from 'next'
import Link from 'next/link'
import { PlainFrame } from '@/components/portal/PortalFrame'
import { Container } from '@/components/portal/kit'
import { acceptLink } from '../actions'

export const metadata: Metadata = {
  title: 'Set up your account',
  robots: { index: false, follow: false },
}

export default function AcceptPage({ searchParams }: { searchParams: { token_hash?: string; type?: string } }) {
  const token = searchParams.token_hash
  return (
    <PlainFrame>
      <section className="ks-ruled min-h-[70vh]">
        <Container className="py-12 md:py-20 max-w-2xl">
          <p className="ks-kicker mb-3">Welcome</p>
          <h1 className="font-bold leading-[1.05]" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 3.75rem)' }}>
            Welcome to the <em className="text-wine italic">portal</em>
          </h1>
          {token ? (
            <>
              <p className="mt-5 text-[1.3rem] leading-relaxed text-navy/85">
                You are almost there. Press the button, then choose a password that you will remember.
              </p>
              <form action={acceptLink} className="mt-8">
                <input type="hidden" name="token_hash" value={token} />
                <button type="submit" className="ks-btn ks-btn-primary">Continue</button>
              </form>
            </>
          ) : (
            <p className="mt-5 text-[1.3rem] leading-relaxed text-navy/85">
              This link looks incomplete. Please open it again from your email, or{' '}
              <Link href="/auth/forgot" className="ks-link">ask for a new one</Link>.
            </p>
          )}
        </Container>
      </section>
    </PlainFrame>
  )
}
