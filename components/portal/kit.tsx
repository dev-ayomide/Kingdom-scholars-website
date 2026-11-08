import Link from 'next/link'
import type { ReactNode } from 'react'

/* ------------------------------------------------------------------ icons */
type IconProps = { className?: string }
const base = {
  viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true,
}
const mk = (d: ReactNode, size = 'w-6 h-6') => {
  const Icon = ({ className = size }: IconProps) => (<svg {...base} className={className}>{d}</svg>)
  return Icon
}
export const CheckIcon = mk(<path d="M5 12.5l4.5 4.5L19 7.5" />)
export const AlertIcon = mk(<><path d="M12 8v5M12 16.5v.01" /><path d="M10.3 3.9L2.6 17.3A2 2 0 004.3 20h15.4a2 2 0 001.7-2.7L13.7 3.9a2 2 0 00-3.4 0z" /></>)
export const InfoIcon = mk(<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.01" /></>)
export const ChevronIcon = mk(<path d="M9 6l6 6-6 6" />, 'w-5 h-5')
export const BackIcon = mk(<path d="M19 12H5M11 6l-6 6 6 6" />, 'w-5 h-5')
export const DownloadIcon = mk(<path d="M12 4v11M7 11l5 5 5-5M5 20h14" />)
export const UploadIcon = mk(<path d="M12 16V5M7 9l5-5 5 5M5 20h14" />)
export const CircleIcon = mk(<circle cx="12" cy="12" r="8" />, 'w-5 h-5')
export const SearchIcon = mk(<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>, 'w-5 h-5')
export const HomeIcon = mk(<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />)
export const FileIcon = mk(<path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6" />)
export const BookIcon = mk(<path d="M4 5a2 2 0 012-2h12v16H6a2 2 0 00-2 2V5zM4 19a2 2 0 012-2h12" />)
export const UsersIcon = mk(<path d="M16 20v-1.5a3.5 3.5 0 00-3.5-3.5h-5A3.5 3.5 0 004 18.5V20M10 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM20 20v-1.5a3.5 3.5 0 00-2.5-3.35M15.5 4.2a3.5 3.5 0 010 6.6" />)
export const StaffIcon = mk(<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM9 12l2 2 4-4" />)
export const MailIcon = mk(<path d="M3 7l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" />)
export const HelpIcon = mk(<><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1-1.5 2M12 17v.01" /></>)

export const NAV_ICONS = { home: HomeIcon, report: FileIcon, book: BookIcon, users: UsersIcon, staff: StaffIcon, help: HelpIcon } as const
export type NavIconName = keyof typeof NAV_ICONS

/* ---------------------------------------------------------------- layout */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-5xl mx-auto px-5 sm:px-8 ${className}`}>{children}</div>
}

interface PageHeaderProps {
  title: string
  accent?: string // kept for older call sites; simply continues the title
  intro?: ReactNode
  back?: { href: string; label: string }
  kicker?: string // ignored: no decorative labels
}
export function PageHeader({ title, accent, intro, back }: PageHeaderProps) {
  return (
    <header className="bg-white border-b border-[#D5DAE1]">
      <Container className="py-7 md:py-8">
        {back && (
          <Link href={back.href} className="ks-link inline-flex items-center gap-1.5 mb-3 no-underline hover:underline">
            <BackIcon /> {back.label}
          </Link>
        )}
        <h1>{accent ? `${title} ${accent}` : title}</h1>
        {intro && <div className="mt-2 max-w-3xl text-[1.125rem] ks-muted">{intro}</div>}
      </Container>
    </header>
  )
}

/* ----------------------------------------------------------------- notice */
type Tone = 'ok' | 'bad' | 'warn' | 'info'
const TONE: Record<Tone, { cls: string; lead: string; icon: ReactNode }> = {
  ok: { cls: 'ks-notice-ok', lead: 'Done.', icon: <CheckIcon className="w-6 h-6 shrink-0 mt-0.5" /> },
  bad: { cls: 'ks-notice-bad', lead: 'Problem.', icon: <AlertIcon className="w-6 h-6 shrink-0 mt-0.5" /> },
  warn: { cls: 'ks-notice-warn', lead: 'Please note.', icon: <AlertIcon className="w-6 h-6 shrink-0 mt-0.5" /> },
  info: { cls: 'ks-notice-info', lead: '', icon: <InfoIcon className="w-6 h-6 shrink-0 mt-0.5" /> },
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
    <section className="grid grid-cols-[2.5rem_1fr] gap-x-4 sm:gap-x-5" aria-label={`Step ${n}: ${title}`}>
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-lg ${
            done ? 'bg-[#2B7A4B] text-white' : 'bg-navy text-white'
          }`}
        >
          {done ? <CheckIcon className="w-5 h-5" /> : n}
        </div>
        {!last && <div className="w-px flex-1 bg-[#C5CCD6] mt-2" aria-hidden />}
      </div>
      <div className={last ? 'pb-1' : 'pb-9'}>
        <h3 className="text-[1.25rem] pt-1.5">{title}</h3>
        {hint && <p className="ks-hint mt-1 max-w-2xl">{hint}</p>}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- page sections */
// A titled white panel. Pages are stacks of these.
export function Section({
  id, title, hint, children,
}: { id?: string; title: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-h` : undefined} className="ks-panel scroll-mt-6">
      <div className="px-5 sm:px-7 pt-6 pb-4 border-b border-[#E3E7EC]">
        <h2 id={id ? `${id}-h` : undefined}>{title}</h2>
        {hint && <p className="mt-1 ks-muted max-w-3xl">{hint}</p>}
      </div>
      <div className="px-5 sm:px-7 py-6">{children}</div>
    </section>
  )
}

export function Stat({ label, value, note }: { label: string; value: ReactNode; note?: string }) {
  return (
    <div className="ks-panel px-5 py-4">
      <p className="ks-muted text-[1rem] font-semibold">{label}</p>
      <p className="text-[2rem] font-bold leading-tight mt-0.5">{value}</p>
      {note && <p className="ks-hint">{note}</p>}
    </div>
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
      {hint && <p className="ks-hint mt-1.5">{hint}</p>}
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
      {hint && <p className="ks-hint mt-1.5">{hint}</p>}
    </div>
  )
}

/* --------------------------------------------------------------- status */
export function SignedInMark({ signedIn }: { signedIn: boolean }) {
  return signedIn ? (
    <span className="inline-flex items-center gap-1.5 text-[#14502F] font-semibold"><CheckIcon className="w-5 h-5" /> Signed in</span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-[#6B4A00] font-semibold"><CircleIcon /> Not signed in yet</span>
  )
}
