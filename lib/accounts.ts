import { createAdminClient } from '@/lib/supabase/admin'
import { accountMail, siteUrl, type Mail } from '@/lib/email'

// Server-only helpers that use the service-role key. Callers must have
// already checked that the current user is an admin.

export interface AuthUserLite {
  id: string
  email: string
  lastSignIn: string | null
}

export async function listAuthUsers(): Promise<AuthUserLite[]> {
  const service = createAdminClient()
  const out: AuthUserLite[] = []
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage: 1000 })
    if (error || !data) break
    out.push(
      ...data.users.map((u) => ({
        id: u.id,
        email: (u.email ?? '').toLowerCase(),
        lastSignIn: u.last_sign_in_at ?? null,
      }))
    )
    if (data.users.length < 1000) break
  }
  return out
}

// Creates the login (no password yet) and its profile.
export async function createAccount(
  email: string,
  fullName: string,
  role: 'parent' | 'teacher' | 'admin'
): Promise<{ id: string } | { error: string }> {
  const service = createAdminClient()
  const { data, error } = await service.auth.admin.createUser({ email, email_confirm: true })
  if (error || !data.user) return { error: error?.message ?? 'Could not create the login.' }

  const { error: profileError } = await service
    .from('profiles')
    .insert({ id: data.user.id, role, full_name: fullName })
  if (profileError) {
    await service.auth.admin.deleteUser(data.user.id)
    return { error: 'Could not create the profile.' }
  }
  return { id: data.user.id }
}

// One-time "set your password" link. Points at our own /auth/accept page
// (not Supabase's) so email link-scanners can't use up the token.
export async function setupLink(email: string): Promise<string | null> {
  const { data, error } = await createAdminClient().auth.admin.generateLink({
    type: 'recovery',
    email,
  })
  const hash = data?.properties?.hashed_token
  if (error || !hash) return null
  return `${siteUrl()}/auth/accept?token_hash=${encodeURIComponent(hash)}&type=recovery`
}

export async function buildAccountMail(
  email: string,
  fullName: string,
  kind: 'invite' | 'reset'
): Promise<Mail | null> {
  const link = await setupLink(email)
  return link ? accountMail(email, fullName, link, kind) : null
}
