'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HOME_FOR_ROLE, requireRole } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { accountMail, sendMails, siteUrl } from '@/lib/email'
import type { ActionState } from '@/lib/types'

// Step 2 of an invite / reset link. Done as a button press (a POST) rather
// than on page load, so email security scanners that open links can't use up
// the one-time token.
export async function acceptLink(formData: FormData) {
  const token_hash = String(formData.get('token_hash') ?? '')
  const supabase = createClient()
  const { error } = await supabase.auth.verifyOtp({ type: 'recovery', token_hash })
  if (error) redirect('/login?error=link')
  redirect('/auth/set-password?welcome=1')
}

// Always answers the same way, so it can't be used to find out which emails
// have accounts.
export async function requestReset(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const reply: ActionState = {
    ok: 'If that email has an account, a reset link is on its way. Check your inbox and spam folder.',
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply

  try {
    const service = createAdminClient()
    const { data } = await service.auth.admin.generateLink({ type: 'recovery', email })
    const id = data?.user?.id
    const hash = data?.properties?.hashed_token
    if (!id || !hash) return reply
    const { data: profile } = await service
      .from('profiles')
      .select('full_name')
      .eq('id', id)
      .single<{ full_name: string }>()
    if (!profile) return reply
    const link = `${siteUrl()}/auth/accept?token_hash=${encodeURIComponent(hash)}&type=recovery`
    await sendMails([accountMail(email, profile.full_name, link, 'reset')])
  } catch (err) {
    console.error('requestReset error:', err)
  }
  return reply
}

export async function setPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase, profile } = await requireRole(['parent', 'teacher', 'admin'])
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')

  if (password.length < 8) return { error: 'Use at least 8 characters.' }
  if (password !== confirm) return { error: 'The two passwords do not match.' }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: 'Could not save the password. Please try again.' }
  redirect(HOME_FOR_ROLE[profile.role])
}
