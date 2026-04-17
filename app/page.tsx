'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
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

const marqueeItems = [
  'Government Approved',
  'Dual Curriculum',
  'Est. 2015',
  'Crèche to Primary 6',
  'Abeokuta, Ogun State',
  '1 : 15 Staff Ratio',
  'Faith-Based',
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
          HERO — full-screen image background
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-navy">

        {/* Real school photo background */}
        <Image
          src="/images/hero/hero-main.jpg"
          alt=""
          fill
          className="object-cover object-top"
          priority
          quality={85}
        />

        {/* Directional overlay — dense on left for text, opens on right to show photo */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(27,42,74,0.93) 0%, rgba(27,42,74,0.85) 35%, rgba(27,42,74,0.62) 65%, rgba(27,42,74,0.48) 100%)',
            zIndex: 1,
          }}
        />
        {/* Bottom fade — keeps stats strip readable regardless of photo content */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(27,42,74,0.75) 0%, transparent 100%)', zIndex: 1 }}
        />

        {/* Masked grid — sits on top of photo */}
        <div aria-hidden className="absolute inset-0 hero-grid-masked pointer-events-none" style={{ zIndex: 2 }} />

        {/* Ambient orb — wine, top-center */}
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full blur-[120px] pointer-events-none"
          style={{ zIndex: 2, background: 'rgba(114, 47, 55, 0.12)' }}
        />

        {/* Ambient orb — cream, top-right */}
        <div
          aria-hidden
          className="absolute top-[-80px] right-[-120px] w-[480px] h-[380px] rounded-full blur-[140px] pointer-events-none"
          style={{ zIndex: 2, background: 'rgba(245, 240, 232, 0.05)' }}
        />

        {/* Main content — padding-top clears the navbar */}
        <div className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center">
          <div className="pt-[90px] pb-16 md:pt-[110px] md:pb-20 w-full">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="max-w-3xl"
            >
              {/* Badge pill */}
              <motion.div variants={item} className="flex items-center mb-8">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-sm px-4 py-1.5">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wine opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-wine" />
                  </span>
                  <span className="text-cream/70 text-[11px] tracking-[0.22em] uppercase font-medium">
                    Government-Approved · Est. 2015
                  </span>
                </div>
              </motion.div>

              {/* Heading with gradient on "Leaders" */}
              <motion.h1
                variants={item}
                className="font-display font-bold text-white leading-[1.0] tracking-tight mb-6"
                style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}
              >
                Raising World{' '}
                <em
                  className="not-italic bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #F5F0E8 0%, #E8C5CA 45%, #722F37 100%)' }}
                >
                  Leaders
                </em>
                <br />
                from the Start.
              </motion.h1>

              {/* Wine rule */}
              <motion.div variants={item} className="w-14 h-[2px] bg-wine mb-6" aria-hidden />

              {/* Subtext */}
              <motion.p
                variants={item}
                className="text-cream/55 text-base md:text-lg leading-relaxed mb-8 max-w-lg"
              >
                A government-approved Nursery &amp; Primary School in Abeokuta,
                nurturing future leaders with excellence, faith, and purpose.
              </motion.p>

              {/* CTAs — pill-shaped */}
              <motion.div variants={item} className="flex flex-wrap gap-3">
                <Link
                  href="/admissions"
                  className="inline-flex items-center bg-wine text-white px-7 py-3 font-semibold text-sm rounded-full hover:bg-wine/90 shadow-wine-glow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Apply for Admission
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center border border-white/20 text-white/85 px-7 py-3 font-semibold text-sm rounded-full backdrop-blur-sm bg-white/[0.04] hover:border-white/40 hover:text-white hover:bg-white/[0.08] transition-all duration-200 active:scale-[0.98]"
                >
                  Our Story
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Marquee strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative z-10 border-t border-white/[0.07] overflow-hidden py-3"
        >
          <div className="flex animate-marquee whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems].map((label, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 px-6 text-[10px] font-medium uppercase tracking-[0.22em] text-cream/25"
              >
                {label}
                <span aria-hidden className="w-[3px] h-[3px] rounded-full bg-wine/50 shrink-0" />
              </span>
            ))}
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="relative z-10 border-t border-white/[0.09]"
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
                className="inline-flex items-center gap-2 bg-navy text-white px-7 py-3.5 font-semibold text-sm rounded-full hover:bg-navy/90 shadow-navy-glow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Read Our Full Story
                <span className="text-cream/50" aria-hidden>→</span>
              </Link>
            </motion.div>

            {/* School photo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="relative"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden relative">
                <Image
                  src="/images/about-panel.jpg"
                  alt="KSPS learners on a school outing"
                  fill
                  className="object-cover object-[center_20%]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Subtle navy tint */}
                <div className="absolute inset-0 bg-navy/[0.08]" />
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
              className="inline-flex items-center gap-2 bg-wine text-white px-8 py-4 font-semibold text-sm rounded-full hover:bg-wine/90 shadow-wine-glow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
