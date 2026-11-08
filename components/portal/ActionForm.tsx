'use client'

import { useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useFormState, useFormStatus } from 'react-dom'
import { Notice } from './kit'
import type { ActionState } from '@/lib/types'

export const inputClass = 'ks-input'
export const labelClass = 'ks-label'

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="ks-btn ks-btn-primary w-full sm:w-auto">
      {pending ? 'Please wait…' : label}
    </button>
  )
}

interface ActionFormProps {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>
  submitLabel: string
  children: React.ReactNode
  className?: string
  confirm?: string
}

// Wraps a server action with a pending state and a clear message underneath.
export default function ActionForm({ action, submitLabel, children, className = '', confirm }: ActionFormProps) {
  const [state, formAction] = useFormState(action, {} as ActionState)
  const router = useRouter()
  const [, startTransition] = useTransition()
  // Refresh from the browser (not the server) so the message stays on screen.
  useEffect(() => {
    if (state.ok) startTransition(() => router.refresh())
  }, [state, router])

  return (
    <form
      action={formAction}
      className={`space-y-6 ${className}`}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault()
      }}
    >
      {children}
      <div>
        <Submit label={submitLabel} />
      </div>
      <div aria-live="polite">
        {state.error && <Notice tone="bad">{state.error}</Notice>}
        {state.ok && <Notice tone="ok">{state.ok}</Notice>}
      </div>
    </form>
  )
}
