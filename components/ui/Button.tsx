import Link from 'next/link'

interface ButtonProps {
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  fullWidth?: boolean
  children: React.ReactNode
  className?: string
}

export default function Button({
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  fullWidth = false,
  children,
  className = '',
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-wine text-white hover:bg-wine/90 active:scale-[0.98]',
    outline:
      'border-2 border-current text-white hover:bg-white/10 active:scale-[0.98]',
    ghost: 'text-navy hover:bg-navy/5 active:scale-[0.98]',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const classes = [
    base,
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  )
}
