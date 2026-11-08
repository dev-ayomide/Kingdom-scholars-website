import type { Metadata } from 'next'
import { requireRole } from '@/lib/auth'
import { titleCase } from '@/lib/format'
import ActionForm, { inputClass, labelClass } from '@/components/portal/ActionForm'
import PortalFrame from '@/components/portal/PortalFrame'
import { Container } from '@/components/portal/kit'
import { setPassword } from '../actions'

export const metadata: Metadata = {
  title: 'Choose a password',
  robots: { index: false, follow: false },
}

export default async function SetPasswordPage({ searchParams }: { searchParams: { welcome?: string } }) {
  const { profile } = await requireRole(['parent', 'teacher', 'admin'])
  return (
    <PortalFrame role={profile.role} name={profile.full_name}>
      <section className="ks-ruled min-h-[60vh]">
        <Container className="py-12 md:py-16 max-w-2xl">
          <p className="ks-kicker mb-3">{searchParams.welcome ? 'Welcome' : 'Your account'}</p>
          <h1 className="font-bold leading-[1.05]" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 3.5rem)' }}>
            {searchParams.welcome ? 'Choose your ' : 'Change your '}
            <em className="text-wine italic">password</em>
          </h1>
          <p className="mt-5 text-[1.3rem] leading-relaxed text-navy/85">
            Hello {titleCase(profile.full_name)}. Use at least 8 letters or numbers. Write it down somewhere safe.
          </p>
          <div className="ks-panel p-6 sm:p-8 mt-8 shadow-[0_8px_30px_rgba(27,42,74,0.08)]">
            <ActionForm action={setPassword} submitLabel="Save my password">
              <div>
                <label htmlFor="password" className={labelClass}>New password</label>
                <input id="password" name="password" type="password" minLength={8} autoComplete="new-password" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="confirm" className={labelClass}>Type the same password again</label>
                <input id="confirm" name="confirm" type="password" minLength={8} autoComplete="new-password" required className={inputClass} />
              </div>
            </ActionForm>
          </div>
        </Container>
      </section>
    </PortalFrame>
  )
}
