import type { Metadata } from 'next'
import Link from 'next/link'
import { acceptLink } from '../actions'

export const metadata: Metadata = {
  title: 'Set up your account',
  robots: { index: false, follow: false },
}

export default function AcceptPage({
  searchParams,
}: {
  searchParams: { token_hash?: string; type?: string }
}) {
  const token = searchParams.token_hash

  return (
    <section className="bg-cream pt-nav min-h-screen">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 md:py-24">
        <h1 className="font-display font-bold text-navy text-4xl tracking-tight mb-3">
          Welcome to the <em style={{ fontStyle: 'italic' }}>portal</em>
        </h1>
        {token ? (
          <>
            <p className="text-navy/55 text-sm leading-relaxed mb-8">
              Press the button to continue and choose your password.
            </p>
            <form action={acceptLink}>
              <input type="hidden" name="token_hash" value={token} />
              <button
                type="submit"
                className="inline-flex items-center justify-center font-semibold tracking-wide rounded px-6 py-3 text-sm bg-wine text-white hover:bg-wine/90 transition-all duration-200"
              >
                Continue
              </button>
            </form>
          </>
        ) : (
          <p className="text-navy/55 text-sm leading-relaxed">
            This link looks incomplete. Please open it again from your email, or{' '}
            <Link href="/auth/forgot" className="text-wine font-semibold hover:underline underline-offset-4">
              request a new one
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  )
}
