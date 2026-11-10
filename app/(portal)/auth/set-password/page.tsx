import type { Metadata } from 'next'
import { requireRole } from '@/lib/auth'
import { titleCase } from '@/lib/format'
import PortalFrame from '@/components/portal/PortalFrame'
import { PageHeader, Container } from '@/components/portal/kit'
import SetPasswordForm from './SetPasswordForm'

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
          <SetPasswordForm />
        </div>
      </Container>
    </PortalFrame>
  )
}
