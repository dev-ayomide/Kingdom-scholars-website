interface PageHeroProps {
  label?: string
  title: string
  subtitle?: string
}

export default function PageHero({ label, title, subtitle }: PageHeroProps) {
  return (
    <section className="bg-navy relative overflow-hidden bg-hero-grid min-h-[52vh] flex items-end">
      {/* Ambient glow */}
      <div
        className="glow-orb w-[400px] h-[300px] -top-16 -right-16 opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(114,47,55,0.5), transparent)' }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16 w-full">
        {label && (
          <span className="text-wine text-[10px] font-semibold tracking-[0.25em] uppercase block mb-4">
            {label}
          </span>
        )}
        <h1 className="font-display font-bold text-white text-5xl md:text-6xl lg:text-7xl leading-[1.06] tracking-tight mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-cream/55 text-lg md:text-xl max-w-xl mt-3">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
