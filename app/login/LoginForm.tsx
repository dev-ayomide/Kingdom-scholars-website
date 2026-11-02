'use client'

import ActionForm, { inputClass, labelClass } from '@/components/portal/ActionForm'
import { login } from './actions'

export default function LoginForm({ next }: { next: string }) {
  return (
    <ActionForm action={login} submitLabel="Sign in">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </div>
    </ActionForm>
  )
}
