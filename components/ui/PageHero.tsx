interface PageHeroProps {
  label?: string
  title: string
  subtitle?: string
}

export default function PageHero({ label, title, subtitle }: PageHeroProps) {
  return (
    <section className="bg-navy pt-nav relative overflow-hidden hero-grid">
      {/* Ambient glow */}
      <div
        className="glow-orb absolute pointer-events-none w-[400px] h-[300px] -top-16 -right-16 opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(114,47,55,0.5), transparent)' }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 w-full">
        {label && (
          <span className="text-wine text-[10px] font-semibold tracking-[0.25em] uppercase block mb-4">
            {label}
          </span>
        )}
        <h1 
          className="font-display font-bold text-white leading-[0.97] tracking-tight mb-5"
          style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-cream/50 text-lg md:text-xl max-w-xl leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
