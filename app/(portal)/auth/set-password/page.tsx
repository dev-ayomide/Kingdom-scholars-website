import type { Metadata } from 'next'
import { requireRole } from '@/lib/auth'
import { titleCase } from '@/lib/format'
import ActionForm, { inputClass, labelClass } from '@/components/portal/ActionForm'
import PortalFrame from '@/components/portal/PortalFrame'
import { PageHeader, Container } from '@/components/portal/kit'
import { setPassword } from '../actions'

export const metadata: Metadata = {
  title: 'Choose a password',
  robots: { index: false, follow: false },
}

export default async function SetPasswordPage({ searchParams }: { searchParams: { welcome?: string } }) {
  const { profile } = await requireRole(['parent', 'teacher', 'admin'])
  return (
    <PortalFrame role={profile.role} name={profile.full_name}>
      <PageHeader
        title={searchParams.welcome ? 'Choose your password' : 'Change your password'}
        intro={`Hello ${titleCase(profile.full_name)}. Use at least 8 letters or numbers. Write it down somewhere safe.`}
      />
      <Container className="py-8">
        <div className="ks-panel p-6 sm:p-7 max-w-xl">
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
    </PortalFrame>
  )
}
