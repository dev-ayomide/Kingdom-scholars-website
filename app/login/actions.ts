'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HOME_FOR_ROLE } from '@/lib/auth'
import type { ActionState, UserRole } from '@/lib/types'

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '')

  if (!email || !password) return { error: 'Enter your email and password.' }

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  // Generic message on purpose - don't reveal whether the email exists.
  if (error || !data.user) return { error: 'Incorrect email or password.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single<{ role: UserRole }>()

  if (!profile) {
    await supabase.auth.signOut()
    return { error: 'Your account is not set up yet. Please contact the school.' }
  }

  // Only follow same-site relative redirects.
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : ''
  redirect(safeNext || HOME_FOR_ROLE[profile.role])
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
