'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { testimonials, Testimonial } from '@/lib/data/testimonials'
import SectionHeading from './SectionHeading'
import { useState } from 'react'

const ease = [0.25, 0.1, 0.25, 1]

export default function Testimonials() {
  const [activeTab, setActiveTab] = useState<'all' | 'student' | 'parent'>('all')

  const filteredTestimonials = activeTab === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.category === activeTab)

  return (
    <section className="bg-white py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Featured Video & Heading Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20"
        >
          <div className="max-w-xl">
            <SectionHeading
              label="Testimonials"
              title="Voices of Excellence"
              subtitle="Watch and read about the transformational journey our learners and parents experience at Kingdom Scholars Private School."
              size="lg"
            />
            <p className="text-navy/60 leading-relaxed mt-4">
              Our students are our greatest ambassadors. In this featured video, listen to them share firsthand how KSPS has nurtured their confidence, emotional intelligence, and academic growth.
            </p>
          </div>

          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-navy/10 bg-navy/5">
            <video 
              src="/videos/testimonial-video.mp4" 
              controls 
              className="w-full h-full object-cover"
              preload="metadata"
            />
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-navy/5 mb-16" />

        {/* Tabs and Grid */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <h3 className="font-display font-bold text-2xl text-navy">More Stories</h3>
          {/* Filter Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="flex p-1 bg-cream rounded-full w-fit border border-navy/5"
          >
            {(['all', 'student', 'parent'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-navy text-white shadow-md'
                    : 'text-navy/60 hover:text-navy'
                }`}
              >
                {tab === 'all' ? 'All' : tab + 's'}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div 
          layout
          className="columns-1 md:columns-2 gap-6 space-y-6"
        >
          {filteredTestimonials.map((testimonial, i) => (
            <div key={testimonial.id} className="break-inside-avoid">
              <TestimonialCard testimonial={testimonial} index={i} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease }}
      className="group relative bg-white p-6 md:p-8 rounded-2xl border border-navy/5 hover:border-wine/20 hover:shadow-card-hover transition-all duration-500 flex flex-col h-full"
    >
      {/* Quote Icon */}
      {testimonial.content && (
        <div className="absolute top-6 right-6 text-wine/5 group-hover:text-wine/10 transition-colors duration-500">
          <svg width="28" height="20" viewBox="0 0 40 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.1111 0L0 11.1111V30H17.7778V11.1111H8.88889L11.1111 0ZM33.3333 0L22.2222 11.1111V30H40V11.1111H31.1111L33.3333 0Z" />
          </svg>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full flex-1">
        {testimonial.content && (
          <div className="flex-1">
            <p className="text-navy/70 text-base md:text-[15px] leading-relaxed mb-6 pr-6">
              "{testimonial.content}"
            </p>
          </div>
        )}

        <div className="flex items-center gap-4 pt-5 mt-auto border-t border-navy/5">
          {testimonial.image && (
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-navy/10 shrink-0">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          {!testimonial.image && (
            <div className="w-12 h-12 rounded-full bg-cream border border-navy/10 flex items-center justify-center shrink-0">
              <span className="text-navy/40 font-bold text-lg">{testimonial.name.charAt(0)}</span>
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

      {/* Decorative accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-wine transition-all duration-500 group-hover:w-full rounded-b-2xl" />
    </motion.div>
  )
}
