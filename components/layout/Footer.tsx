import Link from 'next/link'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
]

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-navy relative overflow-hidden">
      {/* Watermark background text */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 font-display font-black text-[180px] md:text-[240px] text-white/[0.025] leading-none pointer-events-none select-none whitespace-nowrap"
        aria-hidden
      >
        KSPS
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Column 1 — Brand (wider) */}
          <div className="md:col-span-5">
            {/* TODO: Replace KSPS text logo with actual school logo image */}
            <div className="mb-5">
              <span className="font-display font-black text-2xl text-white tracking-tight block">
                KSPS
              </span>
              <span className="text-cream/60 text-[10px] font-semibold tracking-[0.22em] uppercase">
                Kingdom Scholars Private School
              </span>
            </div>
            <p className="text-cream/80 font-semibold text-sm mb-2">
              Educating World Leaders from the Cradle
            </p>
            <p className="text-cream/45 text-sm leading-relaxed mb-8 max-w-xs">
              A government-approved Nursery and Primary School in Abeokuta,
              Ogun State, committed to excellence, faith, and purpose.
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              <a
                href="https://www.facebook.com/share/1b6t9VHbtF/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow KSPS on Facebook"
                className="w-8 h-8 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center text-cream/50 hover:bg-wine hover:text-white hover:border-wine transition-all duration-200"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.instagram.com/kingdomscholarsps?igsh=cWxvNWJ0Z3EycThi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow KSPS on Instagram"
                className="w-8 h-8 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center text-cream/50 hover:bg-wine hover:text-white hover:border-wine transition-all duration-200"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-cream/35 text-[10px] font-semibold tracking-[0.22em] uppercase mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/65 text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div className="md:col-span-4">
            <h3 className="text-cream/35 text-[10px] font-semibold tracking-[0.22em] uppercase mb-5">
              Contact
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <span className="text-cream/35 text-[10px] uppercase tracking-wider block mb-0.5">Address</span>
                <span className="text-cream/65 leading-relaxed">
                  Plot 11, Block 12, Soetan Street,
                  <br />
                  Asero Estate, Abeokuta, Ogun State.
                </span>
              </li>
              <li>
                <span className="text-cream/35 text-[10px] uppercase tracking-wider block mb-0.5">Phone</span>
                <div className="flex flex-col gap-1">
                  <a href="tel:+2348164889463" className="text-cream/65 hover:text-white transition-colors">
                    0816 488 9463
                  </a>
                  <a href="tel:+2348055433787" className="text-cream/65 hover:text-white transition-colors">
                    0805 543 3787
                  </a>
                </div>
              </li>
              <li>
                <span className="text-cream/35 text-[10px] uppercase tracking-wider block mb-0.5">Email</span>
                <a href="mailto:kingdomscholars2@gmail.com" className="text-cream/65 hover:text-white transition-colors">
                  kingdomscholars2@gmail.com
                </a>
              </li>
              <li>
                <span className="text-cream/35 text-[10px] uppercase tracking-wider block mb-0.5">Hours</span>
                <span className="text-cream/65">Monday – Friday, 7:30am – 4:00pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.07] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream/30 text-xs">
            &copy; 2026 Kingdom Scholars Private School. All rights reserved.
          </p>
          <p className="text-cream/20 text-xs tracking-wider">
            Abeokuta · Ogun State · Nigeria
          </p>
        </div>
      </div>
    </footer>
  )
}
