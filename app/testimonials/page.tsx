'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { testimonials, Testimonial } from '@/lib/data/testimonials'
import SectionHeading from '@/components/ui/SectionHeading'
import PageHero from '@/components/ui/PageHero'
import { useState } from 'react'

const ease = [0.25, 0.1, 0.25, 1]

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        label="Voices of Excellence"
        title="What Our Community Says"
        subtitle="Hear directly from the learners, parents, and families whose lives have been shaped by Kingdom Scholars Private School."
      />

      {/* ═══════════════════════════════════════════
          VIDEO TESTIMONIAL
      ═══════════════════════════════════════════ */}
      <section className="bg-white py-24 md:py-32 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header — centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="text-wine text-[10px] font-semibold tracking-[0.25em] uppercase block mb-4">
              Featured Testimonial
            </span>
            <h2
              className="font-display font-bold text-navy leading-tight tracking-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Straight from the Hearts of Our Learners
            </h2>
            <p className="text-navy/55 leading-relaxed">
              Watch Anjola and Ebun Dokunmu share their experience at Kingdom
              Scholars Private School.
            </p>
          </motion.div>

          {/* Portrait video — centred, fixed width so it doesn't stretch */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1, ease }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-[360px]">
              {/* Ambient glows */}
              <div
                className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'rgba(114,47,55,0.10)' }}
                aria-hidden
              />
              <div
                className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'rgba(27,42,74,0.07)' }}
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

              {/* Speaker tag — pinned below the video */}
              <div className="mt-5 flex items-center gap-3 p-3 pr-5 rounded-2xl bg-cream border border-navy/5 shadow-sm">
                <div className="shrink-0 w-9 h-9 rounded-full bg-wine/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-wine" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-navy font-semibold text-sm leading-tight">Anjola &amp; Ebun Dokunmu</p>
                  <p className="text-navy/50 text-xs mt-0.5">KSPS Learners — Video Testimonial</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WRITTEN TESTIMONIALS
      ═══════════════════════════════════════════ */}
      <TestimonialsGrid />

      {/* ═══════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════ */}
      <section className="bg-navy py-20 md:py-28 relative overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden
        >
          <span
            className="font-display italic font-bold text-white opacity-[0.025] whitespace-nowrap"
            style={{ fontSize: 'clamp(4rem, 14vw, 13rem)' }}
          >
            Excellence
          </span>
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="text-cream/60 text-[11px] tracking-[0.25em] uppercase font-medium block mb-4">
              Ready to Join Us?
            </span>
            <h2
              className="font-display font-bold text-white leading-tight tracking-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              Give Your Child a Story Worth Telling
            </h2>
            <div className="w-10 h-[2px] bg-wine mx-auto mb-8" aria-hidden />
            <p className="text-cream/60 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Join the growing family of KSPS learners and parents who are proud
              to be part of something exceptional.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/admissions"
                className="inline-flex items-center justify-center gap-2 bg-wine text-white px-8 py-4 font-semibold text-sm rounded-full hover:bg-wine/90 shadow-wine-glow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Apply for Admission <span aria-hidden>→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-white/20 text-white/85 px-8 py-4 font-semibold text-sm rounded-full backdrop-blur-sm bg-white/[0.04] hover:border-white/40 hover:text-white hover:bg-white/[0.08] transition-all duration-200 active:scale-[0.98]"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

function TestimonialsGrid() {
  const [activeTab, setActiveTab] = useState<'all' | 'student' | 'parent'>('all')

  const filtered =
    activeTab === 'all'
      ? testimonials
      : testimonials.filter((t) => t.category === activeTab)

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <SectionHeading
              label="Community Stories"
              title="More Stories from Our Family"
              size="lg"
            />
          </motion.div>

          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease }}
            className="flex p-1 bg-white rounded-full w-fit border border-navy/8 shadow-sm shrink-0"
          >
            {(['all', 'student', 'parent'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-300 ${activeTab === tab
                    ? 'bg-navy text-white shadow-md'
                    : 'text-navy/60 hover:text-navy'
                  }`}
              >
                {tab === 'all' ? 'All' : tab + 's'}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Masonry grid */}
        <motion.div layout className="columns-1 md:columns-2 gap-6 space-y-6">
          {filtered.map((testimonial, i) => (
            <div key={testimonial.id} className="break-inside-avoid">
              <TestimonialCard testimonial={testimonial} index={i} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial
  index: number
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease }}
      className="group relative bg-white p-6 md:p-8 rounded-2xl border border-navy/5 hover:border-wine/20 hover:shadow-card-hover transition-all duration-500 flex flex-col h-full"
    >
      {/* Quote icon */}
      {testimonial.content && (
        <div className="absolute top-6 right-6 text-wine/5 group-hover:text-wine/10 transition-colors duration-500">
          <svg width="28" height="20" viewBox="0 0 40 30" fill="currentColor">
            <path d="M11.1111 0L0 11.1111V30H17.7778V11.1111H8.88889L11.1111 0ZM33.3333 0L22.2222 11.1111V30H40V11.1111H31.1111L33.3333 0Z" />
          </svg>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full flex-1">
        {testimonial.content && (
          <div className="flex-1">
            <p className="text-navy/70 text-base md:text-[15px] leading-relaxed mb-6 pr-6">
              &ldquo;{testimonial.content}&rdquo;
            </p>
          </div>
        )}

        <div className="flex items-center gap-4 pt-5 mt-auto border-t border-navy/5">
          {testimonial.image ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-navy/10 shrink-0">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-cream border border-navy/10 flex items-center justify-center shrink-0">
              <span className="text-navy/40 font-bold text-lg">
                {testimonial.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h4 className="font-display font-bold text-navy text-base leading-tight mb-0.5">
              {testimonial.name}
            </h4>
            <p className="text-wine text-[9px] font-bold uppercase tracking-[0.1em]">
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-wine transition-all duration-500 group-hover:w-full rounded-b-2xl" />
    </motion.div>
  )
}
