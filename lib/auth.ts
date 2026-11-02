import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile, UserRole } from '@/lib/types'

export const HOME_FOR_ROLE: Record<UserRole, string> = {
  parent: '/portal',
  teacher: '/teacher',
  admin: '/admin',
}

// Server-side guard for pages and actions. Always call this - the middleware
// only checks that someone is signed in, not what they are allowed to do.
export async function requireRole(roles: UserRole[]) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, full_name')
    .eq('id', user.id)
    .single<Profile>()

  if (!profile) redirect('/login?error=no-profile')
  if (!roles.includes(profile.role)) redirect(HOME_FOR_ROLE[profile.role])

  return { supabase, user, profile }
}
