import type { Metadata } from 'next'
import Link from 'next/link'
import { PlainFrame } from '@/components/portal/PortalFrame'
import { acceptLink } from '../actions'

export const metadata: Metadata = {
  title: 'Set up your account',
  robots: { index: false, follow: false },
}

export default function AcceptPage({ searchParams }: { searchParams: { token_hash?: string; type?: string } }) {
  const token = searchParams.token_hash
  return (
    <PlainFrame>
      <section className="py-10 md:py-16 px-5">
        <div className="max-w-md mx-auto">
          <h1 className="mb-2">Welcome to the portal</h1>
          {token ? (
            <>
              <p className="ks-muted mb-6">You are almost there. Press the button, then choose a password that you will remember.</p>
              <form action={acceptLink}>
                <input type="hidden" name="token_hash" value={token} />
                <button type="submit" className="ks-btn ks-btn-primary w-full sm:w-auto">Continue</button>
              </form>
            </>
          ) : (
            <p className="ks-muted">
              This link looks incomplete. Please open it again from your email, or{' '}
              <Link href="/auth/forgot" className="ks-link">ask for a new one</Link>.
            </p>
          )}
        </div>
      </section>
    </PlainFrame>
  )
}
