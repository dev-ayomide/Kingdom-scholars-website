'use client'

import { useState } from 'react'
import ActionForm, { inputClass, labelClass } from '@/components/portal/ActionForm'
import { setPassword } from '../actions'

export default function SetPasswordForm() {
  const [show, setShow] = useState(false)
  const type = show ? 'text' : 'password'
  return (
    <ActionForm action={setPassword} submitLabel="Save my password">
      <div>
        <label htmlFor="password" className={labelClass}>New password</label>
        <input id="password" name="password" type={type} minLength={8} autoComplete="new-password" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="confirm" className={labelClass}>Type the same password again</label>
        <input id="confirm" name="confirm" type={type} minLength={8} autoComplete="new-password" required className={inputClass} />
        <label className="mt-3 flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="ks-check" checked={show} onChange={(e) => setShow(e.target.checked)} />
          Show my password
        </label>
      </div>
    </ActionForm>
  )
}
