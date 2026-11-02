import type { Metadata } from 'next'
import { requireRole } from '@/lib/auth'
import ActionForm, { inputClass, labelClass } from '@/components/portal/ActionForm'
import { setPassword } from '../actions'

export const metadata: Metadata = {
  title: 'Set password',
  robots: { index: false, follow: false },
}

export default async function SetPasswordPage({ searchParams }: { searchParams: { welcome?: string } }) {
  const { profile } = await requireRole(['parent', 'teacher', 'admin'])

  return (
    <section className="bg-cream pt-nav min-h-screen">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 md:py-24">
        <h1 className="font-display font-bold text-navy text-4xl tracking-tight mb-3">
          {searchParams.welcome ? 'Choose your password' : 'Change password'}
        </h1>
        <p className="text-navy/55 text-sm leading-relaxed mb-8">
          Hello {profile.full_name}. Use at least 8 characters.
        </p>
        <div className="bg-white rounded-2xl border border-navy/[0.09] p-8 shadow-[0_2px_24px_rgba(27,42,74,0.06)]">
          <ActionForm action={setPassword} submitLabel="Save password">
            <div>
              <label htmlFor="password" className={labelClass}>New password</label>
              <input id="password" name="password" type="password" minLength={8} autoComplete="new-password" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="confirm" className={labelClass}>Repeat password</label>
              <input id="confirm" name="confirm" type="password" minLength={8} autoComplete="new-password" required className={inputClass} />
            </div>
          </ActionForm>
        </div>
      </div>
    </section>
  )
}
