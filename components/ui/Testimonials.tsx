'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import SectionHeading from './SectionHeading'

const ease = [0.25, 0.1, 0.25, 1]

/**
 * Homepage testimonial section — portrait video spotlight only.
 * Full written testimonials live at /testimonials.
 */
export default function Testimonials() {
  return (
    <section className="bg-white py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── Text column ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease }}
            className="max-w-xl"
          >
            <SectionHeading
              label="Testimonials"
              title="Voices of Excellence"
              subtitle="Listen to what our learners and their families have to say about life at Kingdom Scholars Private School."
              size="lg"
            />

            <p className="text-navy/60 leading-relaxed mt-5 mb-8">
              In this featured video, Anjola and Ebun Dosunmu share firsthand
              how KSPS has nurtured their confidence, emotional intelligence,
              and academic growth, straight from the heart.
            </p>

            {/* Speaker tag */}
            <div className="inline-flex items-center gap-3 p-3 pr-5 rounded-2xl bg-cream border border-navy/5 mb-10">
              <div className="shrink-0 w-9 h-9 rounded-full bg-wine/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-wine" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-navy font-semibold text-sm leading-tight">Anjola &amp; Ebun Dosunmu</p>
                <p className="text-navy/50 text-xs mt-0.5">KSPS Learners</p>
              </div>
            </div>

            {/* CTA to full testimonials page */}
            <div>
              <Link
                href="/testimonials"
                className="inline-flex items-center gap-2 bg-navy text-white px-7 py-3.5 font-semibold text-sm rounded-full hover:bg-navy/90 shadow-navy-glow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Read All Testimonials
                <span className="text-cream/50" aria-hidden>→</span>
              </Link>
            </div>
          </motion.div>

          {/* ── Portrait video column ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1, ease }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[320px] mx-auto lg:mx-0">
              {/* Ambient glow */}
              <div
                className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'rgba(114,47,55,0.10)' }}
                aria-hidden
              />
              <div
                className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'rgba(27,42,74,0.08)' }}
                aria-hidden
              />

              {/* 9:16 portrait frame */}
              <div className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-navy/10 bg-navy">
                <video
                  src="/videos/testimonial-video.mp4"
                  controls
                  className="absolute inset-0 w-full h-full object-contain bg-navy"
                  preload="metadata"
                  playsInline
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
