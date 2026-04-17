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

const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'
const DURATION = '450ms'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
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
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        paddingTop: scrolled ? '12px' : '0',
        paddingLeft: scrolled ? '16px' : '0',
        paddingRight: scrolled ? '16px' : '0',
        transition: `padding ${DURATION} ${EASING}`,
      }}
    >
      {/* Main bar — transparent at top, morphs into floating pill on scroll */}
      <div
        className="flex items-center justify-between overflow-visible"
        style={{
          maxWidth: scrolled ? '960px' : '100%',
          margin: scrolled ? '0 auto' : '0',
          height: scrolled ? '48px' : '62px',
          borderRadius: scrolled ? '9999px' : '0px',
          paddingLeft: scrolled ? '20px' : '24px',
          paddingRight: scrolled ? '20px' : '24px',
          backgroundColor: scrolled
            ? 'rgba(27, 42, 74, 0.95)'
            : 'transparent',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: scrolled
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid transparent',
          boxShadow: scrolled
            ? '0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
            : 'none',
          transition: [
            `max-width ${DURATION} ${EASING}`,
            `height ${DURATION} ${EASING}`,
            `border-radius ${DURATION} ${EASING}`,
            `background-color ${DURATION} ${EASING}`,
            `border-color ${DURATION} ${EASING}`,
            `box-shadow ${DURATION} ${EASING}`,
            `padding ${DURATION} ${EASING}`,
          ].join(', '),
        }}
      >
        {/* Logo — TODO: Replace text with real school logo image */}
        <Link
          href="/"
          className="flex items-center gap-3 group shrink-0"
          aria-label="Kingdom Scholars Private School — Home"
        >
          <div className="flex flex-col leading-none">
            <span className="font-display italic font-bold text-white text-[1.05rem] tracking-tight group-hover:text-cream/90 transition-colors duration-200">
              Kingdom Scholars
            </span>
            <span className="text-white/30 text-[9px] tracking-[0.24em] uppercase font-medium mt-[3px]">
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
                className={`relative px-3.5 py-2 text-[13px] font-medium rounded-lg transition-colors duration-150 ${
                  active
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/90 hover:bg-white/[0.06]'
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="active-underline"
                    className="absolute bottom-1 left-3.5 right-3.5 h-[1.5px] bg-wine rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            )
          })}

          <Link
            href="/admissions"
            className="ml-3 border border-white/30 text-white px-5 py-[7px] text-[13px] font-semibold rounded-full hover:bg-white hover:text-navy hover:border-white transition-all duration-200 active:scale-[0.97]"
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
            className="block w-5 h-[1.5px] bg-white rounded-full origin-center"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="block w-5 h-[1.5px] bg-white rounded-full"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="block w-5 h-[1.5px] bg-white rounded-full origin-center"
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden px-4 mt-1.5"
          >
            <div className="bg-navy/95 backdrop-blur-md rounded-2xl border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
              <nav className="px-3 py-3 flex flex-col gap-0.5">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? 'text-white bg-white/[0.08]'
                          : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      {link.label}
                      {isActive(link.href) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-wine shrink-0" />
                      )}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-2 pb-1 px-0.5">
                  <Link
                    href="/admissions"
                    className="block border border-white/30 text-white text-center py-3 rounded-full text-sm font-semibold hover:bg-white hover:text-navy transition-all duration-200"
                  >
                    Apply Now
                  </Link>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
