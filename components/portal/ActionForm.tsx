'use client'

import { useFormState, useFormStatus } from 'react-dom'
import type { ActionState } from '@/lib/types'

export const inputClass =
  'w-full border border-navy/15 rounded-lg px-4 py-3 text-navy text-sm placeholder:text-navy/30 focus:outline-none focus:border-wine/40 focus:ring-2 focus:ring-wine/10 transition-all duration-200 bg-white font-sans'

export const labelClass =
  'block text-navy/50 font-semibold text-[11px] tracking-[0.18em] uppercase mb-2'

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center font-semibold tracking-wide rounded px-6 py-3 text-sm bg-wine text-white hover:bg-wine/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'Please wait…' : label}
    </button>
  )
}

interface ActionFormProps {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>
  submitLabel: string
  children: React.ReactNode
  className?: string
}

// Wraps a server action with pending state and an inline success/error message.
export default function ActionForm({ action, submitLabel, children, className = '' }: ActionFormProps) {
  const [state, formAction] = useFormState(action, {} as ActionState)
  return (
    <form action={formAction} className={`space-y-4 ${className}`}>
      {children}
      <div className="flex items-center gap-4">
        <Submit label={submitLabel} />
        {state.error && (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        )}
        {state.ok && (
          <p role="status" className="text-sm text-green-700">
            {state.ok}
          </p>
        )}
      </div>
    </form>
  )
}
