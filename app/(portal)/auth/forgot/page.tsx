import type { Metadata } from 'next'
import Link from 'next/link'
import ActionForm, { inputClass, labelClass } from '@/components/portal/ActionForm'
import { PlainFrame } from '@/components/portal/PortalFrame'
import { Container } from '@/components/portal/kit'
import { requestReset } from '../actions'

export const metadata: Metadata = {
  title: 'Forgot password',
  robots: { index: false, follow: false },
}

export default function ForgotPage() {
  return (
    <PlainFrame>
      <section className="ks-ruled min-h-[70vh]">
        <Container className="py-12 md:py-20 max-w-2xl">
          <p className="ks-kicker mb-3">Password help</p>
          <h1 className="font-bold leading-[1.05]" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 3.75rem)' }}>
            I forgot my <em className="text-wine italic">password</em>
          </h1>
          <p className="mt-5 text-[1.3rem] leading-relaxed text-navy/85">
            Type the email address the school has for you. We will email you a button to choose a new password.
          </p>
          <div className="ks-panel p-6 sm:p-8 mt-8 shadow-[0_8px_30px_rgba(27,42,74,0.08)]">
            <ActionForm action={requestReset} submitLabel="Send me the email">
              <div>
                <label htmlFor="email" className={labelClass}>Your email address</label>
                <input id="email" name="email" type="email" required className={inputClass} />
              </div>
            </ActionForm>
          </div>
          <p className="mt-6"><Link href="/login" className="ks-link">Back to sign in</Link></p>
        </Container>
      </section>
    </PlainFrame>
  )
}
