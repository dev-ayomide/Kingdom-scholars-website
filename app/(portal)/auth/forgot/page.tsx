import type { Metadata } from 'next'
import Link from 'next/link'
import ActionForm, { inputClass, labelClass } from '@/components/portal/ActionForm'
import { PlainFrame } from '@/components/portal/PortalFrame'
import { requestReset } from '../actions'

export const metadata: Metadata = {
  title: 'Forgot password',
  robots: { index: false, follow: false },
}

export default function ForgotPage() {
  return (
    <PlainFrame>
      <section className="py-10 md:py-16 px-5">
        <div className="max-w-md mx-auto">
          <h1 className="mb-2">I forgot my password</h1>
          <p className="ks-muted mb-6">
            Type the email address the school has for you. We will email you a button to choose a new password.
          </p>
          <div className="ks-panel p-6 sm:p-7">
            <ActionForm action={requestReset} submitLabel="Send me the email">
              <div>
                <label htmlFor="email" className={labelClass}>Your email address</label>
                <input id="email" name="email" type="email" required className={inputClass} />
              </div>
            </ActionForm>
          </div>
          <p className="mt-5"><Link href="/login" className="ks-link">Back to sign in</Link></p>
        </div>
      </section>
    </PlainFrame>
  )
}
