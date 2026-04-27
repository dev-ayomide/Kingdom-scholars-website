'use client'

import { motion } from 'framer-motion'
import SectionHeading from '@/components/ui/SectionHeading'
import StaffCard from '@/components/ui/StaffCard'
import { staff } from '@/lib/data/staff'

const ease = [0.25, 0.1, 0.25, 1]

const classes = [
  'Crèche', 'Kindergarten', 'Nursery 1', 'Nursery 2',
  'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
]

export default function AboutPage() {
  return (
    <>
      {/* ═══ ABOUT HERO — navy, editorial ═══ */}
      <section className="bg-navy pt-nav relative overflow-hidden hero-grid">
        {/* Decorative italic watermark */}
        <div
          className="absolute -right-8 top-0 bottom-0 flex items-center pointer-events-none select-none"
          aria-hidden
        >
          <span
            className="font-display italic font-bold text-white opacity-[0.04] leading-none whitespace-nowrap"
            style={{ fontSize: 'clamp(6rem, 18vw, 18rem)', writingMode: 'horizontal-tb' }}
          >
            
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-7 h-[1.5px] bg-cream/60 shrink-0" aria-hidden />
              <span className="text-cream/60 text-[11px] tracking-[0.25em] uppercase font-medium">
                Who We Are
              </span>
            </div>
            <h1
              className="font-display font-bold text-white leading-[0.97] tracking-tight mb-5"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
            >
              About Kingdom{' '}
              <em style={{ fontStyle: 'italic' }}>Scholars Private School</em>
            </h1>
            <p className="text-cream/50 text-lg max-w-md leading-relaxed">
              Faith, Excellence, and Purpose since 2015.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ OUR STORY ═══ */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="grid md:grid-cols-[1fr_2fr] gap-16 items-start"
          >
            <div className="md:pt-2">
              <SectionHeading label="Our Story" title="How We Began" size="lg" />
            </div>
            <div className="space-y-4 text-navy/60 leading-relaxed text-base border-l-2 border-wine/20 pl-8 md:mt-2">
              <p>
                Kingdom Scholars Private School started as a crèche center on
                the 3rd of August, 2015 with one child and inside one room. It
                gradually became a pre-school until it finally assumed a Nursery
                and Primary School status in 2018.
              </p>
              <p>
                KSPS is a government approved nursery and primary school
                positioned to educate learners in all classes from Crèche to
                Primary 6, located within a serene estate in Abeokuta city,
                Ogun State with quality learning facilities and qualified staff.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ VISION & MISSION ═══ */}
      <section className="bg-cream py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="mb-14"
          >
            <SectionHeading label="Our Foundation" title="Vision &amp; Mission" size="lg" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="bg-navy rounded-2xl p-10 md:p-12 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Italic word behind content */}
              <div className="absolute bottom-2 right-4 pointer-events-none select-none" aria-hidden>
                <span className="font-display italic font-bold text-white opacity-[0.04] text-[5rem] leading-none">
                  Vision
                </span>
              </div>
              <div className="relative z-10">
                <span className="text-white/30 text-[10px] tracking-[0.25em] uppercase font-medium block mb-6">Our Vision</span>
                <p className="font-display font-semibold text-white text-2xl md:text-3xl leading-snug tracking-tight">
                  To educate world leaders for global impact.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="bg-wine rounded-2xl p-10 md:p-12 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="absolute bottom-2 right-4 pointer-events-none select-none" aria-hidden>
                <span className="font-display italic font-bold text-white opacity-[0.05] text-[5rem] leading-none">
                  Mission
                </span>
              </div>
              <div className="relative z-10">
                <span className="text-white/40 text-[10px] tracking-[0.25em] uppercase font-medium block mb-6">Our Mission</span>
                <p className="font-display font-semibold text-white text-base md:text-lg leading-relaxed">
                  To use the Nigerian and British government-approved curricula
                  with Biblical principles in educating future leaders with
                  global vision and impact, basing our approach on the
                  individual gifts and strengths of each child.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CLASSES OFFERED ═══ */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="mb-12"
          >
            <SectionHeading
              label="Enrolment"
              title="Classes We Offer"
              subtitle="From our youngest learners in Crèche to our Primary 6 graduates, every child has a place at KSPS."
              size="lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1, ease }}
            className="flex flex-wrap gap-2.5"
          >
            {classes.map((cls, i) => (
              <motion.span
                key={cls}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, ease }}
                className="bg-wine text-white text-sm font-semibold px-5 py-2 rounded-full"
              >
                {cls}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ TEAM ═══ */}
      <section className="bg-cream py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="mb-14"
          >
            <SectionHeading
              label="Leadership"
              title="Meet Our Team"
              subtitle="Dedicated educators committed to nurturing every learner."
              size="lg"
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {staff.map((member, i) => (
              <StaffCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ACHIEVEMENTS ═══ */}
      <section className="bg-navy py-24 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
          <span
            className="font-display italic font-bold text-white opacity-[0.025] whitespace-nowrap"
            style={{ fontSize: 'clamp(4rem, 14vw, 14rem)' }}
          >
            Achievement
          </span>
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="text-cream/60 text-[11px] tracking-[0.25em] uppercase font-medium block mb-5">
              Excellence in Action
            </span>
            <h2
              className="font-display font-bold text-white leading-tight tracking-tight mb-7"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
            >
              Our Learners&apos;{' '}
              <em style={{ fontStyle: 'italic' }}>Achievements</em>
            </h2>
            <div className="w-10 h-[2px] bg-cream/60 mx-auto mb-8" aria-hidden />
            <p className="text-cream/60 text-base md:text-lg leading-relaxed">
              Our learners have successfully gained admissions into top secondary
              schools including{' '}
              <span className="font-semibold text-white/90">
                Navy Secondary School, Abeokuta Grammar School, Police College,
              </span>{' '}
              and{' '}
              <span className="font-semibold text-white/90">Baptist Boys High School.</span>
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
