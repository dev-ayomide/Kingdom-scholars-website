import Link from 'next/link'
import type { ReactNode } from 'react'

/* ------------------------------------------------------------------ icons */
type IconProps = { className?: string }
const base = {
  viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.4,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true,
}
export const CheckIcon = ({ className = 'w-6 h-6' }: IconProps) => (<svg {...base} className={className}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>)
export const AlertIcon = ({ className = 'w-6 h-6' }: IconProps) => (<svg {...base} className={className}><path d="M12 8v5M12 16.5v.01" /><path d="M10.3 3.9L2.6 17.3A2 2 0 004.3 20h15.4a2 2 0 001.7-2.7L13.7 3.9a2 2 0 00-3.4 0z" /></svg>)
export const InfoIcon = ({ className = 'w-6 h-6' }: IconProps) => (<svg {...base} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.01" /></svg>)
export const ArrowIcon = ({ className = 'w-7 h-7' }: IconProps) => (<svg {...base} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>)
export const BackIcon = ({ className = 'w-5 h-5' }: IconProps) => (<svg {...base} className={className}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>)
export const DownloadIcon = ({ className = 'w-6 h-6' }: IconProps) => (<svg {...base} className={className}><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg>)
export const UploadIcon = ({ className = 'w-6 h-6' }: IconProps) => (<svg {...base} className={className}><path d="M12 16V5M7 9l5-5 5 5M5 20h14" /></svg>)
export const CircleIcon = ({ className = 'w-6 h-6' }: IconProps) => (<svg {...base} className={className}><circle cx="12" cy="12" r="8" /></svg>)

/* ---------------------------------------------------------------- layout */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-4xl mx-auto px-5 sm:px-8 ${className}`}>{children}</div>
}

interface PageHeaderProps {
  kicker?: string
  title: string
  accent?: string // set in italic wine, like the school's main website
  intro?: ReactNode
  back?: { href: string; label: string }
}
export function PageHeader({ kicker, title, accent, intro, back }: PageHeaderProps) {
  return (
    <header className="ks-ruled border-b border-navy/15 bg-[#F5F0E8]/60">
      <Container className="pt-10 pb-12 md:pt-14 md:pb-14">
        {back && (
          <Link href={back.href} className="ks-link inline-flex items-center gap-2 mb-6 no-underline hover:underline">
            <BackIcon /> {back.label}
          </Link>
        )}
        {kicker && <p className="ks-kicker mb-3">{kicker}</p>}
        <h1 className="font-bold leading-[1.05]" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 3.75rem)' }}>
          {title}
          {accent && <em className="text-wine italic"> {accent}</em>}
        </h1>
        {intro && <div className="mt-5 max-w-2xl text-[1.3rem] leading-relaxed text-navy/85">{intro}</div>}
      </Container>
    </header>
  )
}

/* ----------------------------------------------------------------- notice */
type Tone = 'ok' | 'bad' | 'warn' | 'info'
const TONE: Record<Tone, { cls: string; lead: string; icon: ReactNode }> = {
  ok: { cls: 'ks-notice-ok', lead: 'Done.', icon: <CheckIcon className="w-7 h-7 shrink-0 mt-0.5" /> },
  bad: { cls: 'ks-notice-bad', lead: 'Problem.', icon: <AlertIcon className="w-7 h-7 shrink-0 mt-0.5" /> },
  warn: { cls: 'ks-notice-warn', lead: 'Please note.', icon: <AlertIcon className="w-7 h-7 shrink-0 mt-0.5" /> },
  info: { cls: 'ks-notice-info', lead: '', icon: <InfoIcon className="w-7 h-7 shrink-0 mt-0.5" /> },
}
export function Notice({ tone, children, lead }: { tone: Tone; children: ReactNode; lead?: string }) {
  const t = TONE[tone]
  const text = lead ?? t.lead
  return (
    <div className={`ks-notice ${t.cls}`} role={tone === 'bad' ? 'alert' : 'status'}>
      {t.icon}
      <div>
        {text && <strong>{text} </strong>}
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ steps */
export function Step({
  n, title, hint, done = false, last = false, children,
}: { n: number; title: string; hint?: ReactNode; done?: boolean; last?: boolean; children?: ReactNode }) {
  return (
    <section className="grid grid-cols-[3.5rem_1fr] gap-x-5 sm:gap-x-7" aria-label={`Step ${n}: ${title}`}>
      <div className="flex flex-col items-center">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 font-display font-bold text-3xl ${
            done ? 'bg-[#2B7A4B] text-white' : 'bg-wine text-white'
          }`}
        >
          {done ? <CheckIcon className="w-8 h-8" /> : n}
        </div>
        {!last && <div className="w-0.5 flex-1 bg-navy/20 mt-2" aria-hidden />}
      </div>
      <div className={last ? 'pb-2' : 'pb-12'}>
        <h2 className="text-[1.9rem] font-bold leading-tight pt-2">{title}</h2>
        {hint && <p className="ks-hint mt-2 max-w-xl">{hint}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- status */
export function SignedInMark({ signedIn }: { signedIn: boolean }) {
  return signedIn ? (
    <span className="inline-flex items-center gap-2 text-[#14502F] font-bold"><CheckIcon className="w-5 h-5" /> Signed in</span>
  ) : (
    <span className="inline-flex items-center gap-2 text-[#6B4A00] font-bold"><CircleIcon className="w-5 h-5" /> Not signed in yet</span>
  )
}

/* ----------------------------------------------------------- page sections */
export function Section({
  id, title, hint, children,
}: { id?: string; title: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-h` : undefined} className="scroll-mt-6 border-t-2 border-navy pt-8">
      <h2 id={id ? `${id}-h` : undefined} className="text-[2.1rem] font-bold leading-tight">{title}</h2>
      {hint && <p className="mt-3 text-[1.2rem] max-w-2xl text-navy/85">{hint}</p>}
      <div className="mt-8">{children}</div>
    </section>
  )
}

/* ------------------------------------------------------------------ fields */
export function TextField({
  id, name, label, type = 'text', hint, required = true, autoComplete, placeholder,
}: {
  id: string; name: string; label: string; type?: string; hint?: string
  required?: boolean; autoComplete?: string; placeholder?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="ks-label">{label}</label>
      <input id={id} name={name} type={type} required={required} autoComplete={autoComplete ?? 'off'} placeholder={placeholder} className="ks-input" />
      {hint && <p className="ks-hint mt-2">{hint}</p>}
    </div>
  )
}

export function SelectField({
  id, name, label, options, hint, placeholder = 'Choose…',
}: {
  id: string; name: string; label: string; hint?: string; placeholder?: string
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label htmlFor={id} className="ks-label">{label}</label>
      <select id={id} name={name} required defaultValue="" className="ks-input">
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
      {hint && <p className="ks-hint mt-2">{hint}</p>}
    </div>
  )
}
