interface SectionHeadingProps {
  label?: string
  title: string
  subtitle?: string
  center?: boolean
  light?: boolean
  size?: 'default' | 'lg'
}

export default function SectionHeading({
  label,
  title,
  subtitle,
  center = false,
  light = false,
  size = 'default',
}: SectionHeadingProps) {
  return (
    <div className={center ? 'text-center' : ''}>
      {label && (
        <div className={`flex items-center gap-3 mb-4 ${center ? 'justify-center' : ''}`}>
          {!center && (
            <div
              className={`w-6 h-[1.5px] shrink-0 ${light ? 'bg-wine' : 'bg-wine'}`}
              aria-hidden
            />
          )}
          <span
            className={`text-[11px] font-medium tracking-[0.25em] uppercase ${
              light ? 'text-wine' : 'text-wine'
            }`}
          >
            {label}
          </span>
        </div>
      )}
      <h2
        className={`font-display font-bold leading-[1.05] tracking-tight mb-4 ${
          size === 'lg'
            ? 'text-4xl md:text-5xl'
            : 'text-3xl md:text-[2.5rem]'
        } ${light ? 'text-white' : 'text-navy'}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base leading-relaxed max-w-xl ${center ? 'mx-auto' : ''} ${
            light ? 'text-cream/65' : 'text-navy/55'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
