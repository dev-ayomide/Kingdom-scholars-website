import type { Metadata } from 'next'
import ActionForm, { inputClass, labelClass } from '@/components/portal/ActionForm'
import { requestReset } from '../actions'

export const metadata: Metadata = {
  title: 'Forgot password',
  robots: { index: false, follow: false },
}

export default function ForgotPage() {
  return (
    <section className="bg-cream pt-nav min-h-screen">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 md:py-24">
        <h1 className="font-display font-bold text-navy text-4xl tracking-tight mb-3">
          Forgot <em style={{ fontStyle: 'italic' }}>password</em>
        </h1>
        <p className="text-navy/55 text-sm leading-relaxed mb-8">
          Enter the email the school has on file and we&apos;ll send you a link to choose a new password.
        </p>
        <div className="bg-white rounded-2xl border border-navy/[0.09] p-8 shadow-[0_2px_24px_rgba(27,42,74,0.06)]">
          <ActionForm action={requestReset} submitLabel="Send link">
            <div>
              <label htmlFor="email" className={labelClass}>Email</label>
              <input id="email" name="email" type="email" required className={inputClass} />
            </div>
          </ActionForm>
        </div>
      </div>
    </section>
  )
}
