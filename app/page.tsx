'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import NewsCard from '@/components/ui/NewsCard'
import SectionHeading from '@/components/ui/SectionHeading'
import { newsPosts } from '@/lib/data/news'

const ease = [0.25, 0.1, 0.25, 1]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
}

const stats = [
  { value: 'Est. 2015', label: 'Founded' },
  { value: '1 : 15', label: 'Staff-to-Learner Ratio' },
  { value: 'Crèche – P6', label: 'Classes Offered' },
  { value: 'Abeokuta', label: 'Ogun State' },
]

const features = [
  {
    num: '01',
    title: 'Low Student Ratio',
    body: 'Our 1:15 staff-to-learner ratio ensures every child receives personal attention and meaningful support.',
  },
  {
    num: '02',
    title: 'Dual Curriculum',
    body: 'Nigerian and British government-approved curricula interwoven with Biblical principles for global readiness.',
  },
  {
    num: '03',
    title: 'Experienced Staff',
    body: 'Our qualified educators bring decades of combined teaching and leadership experience to every classroom.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO — typographic-first, full height
      ═══════════════════════════════════════════ */}
      <section className="relative bg-navy flex flex-col overflow-hidden hero-grid pt-nav">
        {/* Very subtle diagonal rule */}
        <div
          className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.07] to-transparent"
          aria-hidden
        />

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 w-full">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            {/* Label */}
            <motion.div variants={item} className="flex items-center gap-3 mb-6">
              <div className="w-7 h-[1.5px] bg-wine shrink-0" aria-hidden />
              <span className="text-wine text-[11px] tracking-[0.25em] uppercase font-medium">
                Government-Approved · Est. 2015
              </span>
            </motion.div>

            {/* Heading — Playfair Display, italic on key word */}
            <motion.h1
              variants={item}
              className="font-display font-bold text-white leading-[1.0] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}
            >
              Raising World{' '}
              <em className="italic text-cream/75 not-italic" style={{ fontStyle: 'italic' }}>
                Leaders
              </em>
              <br />
              from the Start.
            </motion.h1>

            {/* Wine rule */}
            <motion.div
              variants={item}
              className="w-14 h-[2px] bg-wine mb-6"
              aria-hidden
            />

            {/* Subtext */}
            <motion.p
              variants={item}
              className="text-cream/55 text-base md:text-lg leading-relaxed mb-8 max-w-lg"
            >
              A government-approved Nursery &amp; Primary School in Abeokuta,
              nurturing future leaders with excellence, faith, and purpose.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap gap-3">
              <Link
                href="/admissions"
                className="bg-wine text-white px-7 py-3 font-semibold text-sm rounded hover:bg-wine/90 shadow-wine-glow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Apply for Admission
              </Link>
              <Link
                href="/about"
                className="border border-white/20 text-white/80 px-7 py-3 font-semibold text-sm rounded hover:border-white/40 hover:text-white hover:bg-white/5 transition-all duration-200 active:scale-[0.98]"
              >
                Our Story
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats strip — pinned to the bottom of the hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="border-t border-white/[0.09]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.09]">
              {stats.map((s) => (
                <div key={s.value} className="px-6 py-5 first:pl-0 last:pr-0">
                  <div className="font-display font-bold text-white text-xl md:text-2xl tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-cream/35 text-[10px] tracking-[0.18em] uppercase mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY CHOOSE KSPS
      ═══════════════════════════════════════════ */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="mb-16"
          >
            <SectionHeading
              label="Why KSPS"
              title="Why Families Choose Kingdom Scholars"
              subtitle="Every decision we make serves one purpose: to give each child the environment they need to flourish."
              size="lg"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-navy/[0.07] border border-navy/[0.07] rounded-2xl overflow-hidden">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1, ease }}
                className="bg-white p-8 md:p-10 group hover:bg-cream transition-colors duration-300"
              >
                <span className="font-display italic text-wine/30 text-5xl font-bold leading-none block mb-6 group-hover:text-wine/50 transition-colors duration-300">
                  {f.num}
                </span>
                <h3 className="font-display font-bold text-navy text-xl mb-3 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-navy/55 text-sm leading-relaxed">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ABOUT SNIPPET — split layout
      ═══════════════════════════════════════════ */}
      <section className="bg-cream py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
            >
              <SectionHeading label="Our Story" title="Rooted in Purpose" size="lg" />
              <p className="text-navy/60 leading-relaxed mt-5 mb-8">
                Kingdom Scholars Private School began in 2015 as a single-room
                crèche with one child. Today, we are a government-approved
                institution educating learners from Crèche through Primary 6,
                rooted in excellence, faith, and a commitment to raising leaders
                of global impact.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-navy text-white px-7 py-3.5 font-semibold text-sm rounded hover:bg-navy/90 shadow-navy-glow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Read Our Full Story
                <span className="text-cream/50" aria-hidden>→</span>
              </Link>
            </motion.div>

            {/* Decorative panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="relative"
            >
              {/* TODO: Replace this block with a real school photo:
                  <Image src="/images/school.jpg" alt="School" fill className="object-cover" /> */}
              <div className="aspect-[4/3] bg-navy rounded-2xl overflow-hidden relative">
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(145deg, #1B2A4A 0%, #243761 55%, #722F37 100%)' }}
                />
                <div className="absolute inset-0 hero-grid opacity-30" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 gap-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={0.75} className="w-12 h-12 opacity-15" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase">School photo coming soon</p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-4 bg-wine text-white rounded-xl px-5 py-3.5 shadow-wine-glow">
                <div className="font-display font-bold text-2xl tracking-tight">10+</div>
                <div className="text-white/65 text-[10px] uppercase tracking-[0.15em] mt-0.5">Years of Excellence</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ACHIEVEMENTS
      ═══════════════════════════════════════════ */}
      <section className="bg-navy py-24 md:py-28 relative overflow-hidden">
        {/* Decorative large italic text behind content */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden
        >
          <span
            className="font-display italic font-bold text-white opacity-[0.025] whitespace-nowrap"
            style={{ fontSize: 'clamp(5rem, 18vw, 16rem)' }}
          >
            Excellence
          </span>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="text-wine text-[11px] tracking-[0.25em] uppercase font-medium block mb-5">
              Our Pride
            </span>
            <h2
              className="font-display font-bold text-white leading-tight tracking-tight mb-7"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}
            >
              Our Learners{' '}
              <em style={{ fontStyle: 'italic' }}>Excel</em>
            </h2>
            <div className="w-10 h-[2px] bg-wine mx-auto mb-8" aria-hidden />
            <p className="text-cream/60 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              KSPS learners have gained admission into top secondary schools
              including{' '}
              <span className="text-white font-medium">
                Navy Secondary School, Abeokuta Grammar School, Police College,
              </span>{' '}
              and{' '}
              <span className="text-white font-medium">Baptist Boys Grammar School.</span>
            </p>
            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 bg-wine text-white px-8 py-4 font-semibold text-sm rounded hover:bg-wine/90 shadow-wine-glow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Give Your Child This Future
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LATEST NEWS
      ═══════════════════════════════════════════ */}
      <section className="bg-cream py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-14"
          >
            <SectionHeading label="From KSPS" title="Latest News &amp; Updates" size="lg" />
            <Link
              href="/news"
              className="shrink-0 text-wine text-sm font-semibold hover:underline underline-offset-4 inline-flex items-center gap-1.5 pb-1"
            >
              View All <span aria-hidden>→</span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {newsPosts.map((post, i) => (
              <NewsCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
