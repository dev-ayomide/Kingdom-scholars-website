'use client'

import { useState } from 'react'
import ActionForm, { inputClass, labelClass } from '@/components/portal/ActionForm'
import { login } from './actions'

export default function LoginForm({ next }: { next: string }) {
  const [show, setShow] = useState(false)
  return (
    <ActionForm action={login} submitLabel="Sign in">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className={labelClass}>Your email address</label>
        <input id="email" name="email" type="email" autoComplete="username" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>Your password</label>
        <input id="password" name="password" type={show ? 'text' : 'password'} autoComplete="current-password" required className={inputClass} />
        <label className="mt-3 flex items-center gap-3 text-[1.1875rem] cursor-pointer">
          <input type="checkbox" className="ks-check" checked={show} onChange={(e) => setShow(e.target.checked)} />
          Show my password
        </label>
      </div>
    </ActionForm>
  )
}
