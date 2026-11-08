'use client'

// A submit button that asks "are you sure?" first, in plain words.
export default function ConfirmSubmit({
  label, message, className = 'ks-btn ks-btn-quiet ks-btn-small',
}: { label: string; message: string; className?: string }) {
  return (
    <button type="submit" className={className} onClick={(e) => { if (!window.confirm(message)) e.preventDefault() }}>
      {label}
    </button>
  )
}
