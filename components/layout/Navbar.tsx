'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function isActive(href: string) {
    return href === '/' ? pathname === '/' : pathname.startsWith(href)
  }

  return (
    <>
      {/* Wine accent stripe */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-wine z-[60]" aria-hidden />

      <header
        className={`fixed top-[3px] left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_2px_16px_rgba(27,42,74,0.08)]' : 'shadow-none'
        } border-b border-navy/[0.07]`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[66px]">

            {/* Logo — TODO: Replace text logo with real school logo image */}
            <Link
              href="/"
              className="flex items-center gap-3 group shrink-0"
              aria-label="Kingdom Scholars Private School — Home"
            >
              {/* Wine left border + text stack */}
              <div className="w-[3px] h-8 bg-wine rounded-full shrink-0" aria-hidden />
              <div className="flex flex-col leading-none">
                <span className="font-display italic font-bold text-navy text-[1.05rem] tracking-tight group-hover:text-wine transition-colors duration-200">
                  Kingdom Scholars
                </span>
                <span className="text-navy/35 text-[9px] tracking-[0.24em] uppercase font-medium mt-[3px]">
                  Private School · Abeokuta
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-2 text-[13px] font-medium rounded transition-colors duration-150 ${
                      active
                        ? 'text-wine'
                        : 'text-navy/60 hover:text-navy hover:bg-navy/[0.04]'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="active-underline"
                        className="absolute bottom-0.5 left-3.5 right-3.5 h-[1.5px] bg-wine rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </Link>
                )
              })}

              <Link
                href="/admissions"
                className="ml-3 bg-wine text-white px-5 py-2 text-[13px] font-semibold rounded hover:bg-wine/90 shadow-wine-glow transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              >
                Apply Now
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-[5px] p-2 -mr-1 rounded"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block w-5 h-[1.5px] bg-navy rounded-full origin-center"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="block w-5 h-[1.5px] bg-navy rounded-full"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block w-5 h-[1.5px] bg-navy rounded-full origin-center"
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden overflow-hidden border-t border-navy/[0.07] bg-white"
            >
              <nav className="px-4 py-3 flex flex-col gap-0.5">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? 'text-wine bg-wine/[0.06]'
                          : 'text-navy/65 hover:text-navy hover:bg-navy/[0.04]'
                      }`}
                    >
                      {link.label}
                      {isActive(link.href) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-wine shrink-0" />
                      )}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-2 pb-1">
                  <Link
                    href="/admissions"
                    className="block bg-wine text-white text-center py-3 rounded-lg text-sm font-semibold hover:bg-wine/90 transition-colors shadow-wine-glow"
                  >
                    Apply Now
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
