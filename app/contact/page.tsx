'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ContactFormData } from '@/lib/types'

const ease = [0.25, 0.1, 0.25, 1]
type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const inputClass =
  'w-full border border-navy/15 rounded-lg px-4 py-3.5 text-navy text-sm placeholder:text-navy/30 focus:outline-none focus:border-wine/40 focus:ring-2 focus:ring-wine/10 transition-all duration-200 bg-white font-sans'

const labelClass = 'block text-navy/50 font-semibold text-[11px] tracking-[0.18em] uppercase mb-2'

const contactDetails = [
  {
    label: 'Address',
    value: 'Plot 11, Block 12, Soetan Street, Asero Estate, Abeokuta, Ogun State, Nigeria.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Phone',
    value: '0816 488 9463, 0805 543 3787',
    href: 'tel:+2348164889463',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    value: 'kingdomscholars2@gmail.com',
    href: 'mailto:kingdomscholars2@gmail.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Hours',
    value: 'Monday – Friday, 7:30am – 4:00pm',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<FormStatus>('idle')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {/* ═══ HERO — cream/warm, same language as Admissions ═══ */}
      <section className="bg-cream pt-nav border-b border-navy/[0.07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="grid md:grid-cols-2 gap-10 items-end"
          >
            <div>
              <div className="flex items-center gap-3 mb-7">
                <div className="w-7 h-[1.5px] bg-wine shrink-0" aria-hidden />
                <span className="text-wine text-[11px] tracking-[0.25em] uppercase font-medium">
                  Get in Touch
                </span>
              </div>
              <h1
                className="font-display font-bold text-navy leading-[0.97] tracking-tight"
                style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)' }}
              >
                Contact{' '}
                <em style={{ fontStyle: 'italic' }}>Us</em>
              </h1>
            </div>
            <div className="md:pb-2">
              <p className="text-navy/55 text-lg leading-relaxed max-w-md">
                We&apos;d love to hear from you — whether you&apos;re a prospective parent,
                a current family, or simply curious about KSPS.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CONTACT BODY ═══ */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">

            {/* LEFT — info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <h2 className="font-display font-bold text-navy text-2xl tracking-tight mb-8">
                School Information
              </h2>

              <div className="space-y-6 mb-10">
                {contactDetails.map((item) => (
                  <div key={item.label} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center shrink-0 text-navy/50 group-hover:bg-wine group-hover:text-white transition-all duration-200">
                      {item.icon}
                    </div>
                    <div className="pt-0.5">
                      <div className="text-navy/35 text-[10px] font-semibold tracking-[0.2em] uppercase mb-0.5">
                        {item.label}
                      </div>
                      {'href' in item && item.href ? (
                        <a href={item.href} className="text-navy/75 text-sm hover:text-wine transition-colors duration-150 font-medium">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-navy/75 text-sm leading-relaxed font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map embed */}
              <div className="rounded-2xl overflow-hidden border border-navy/[0.08]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d63340.048823707475!2d3.299020077854855!3d7.154525258447401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sPlot%2011%2C%20Block%2012%2C%20Soetan%20Street%2C%20Asero%20Estate%2C%20Abeokuta%2C%20Ogun%20State%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1776800374211!5m2!1sen!2sng"
                  width="100%"
                  height="340"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kingdom Scholars Private School Location"
                />
              </div>
            </motion.div>

            {/* RIGHT — form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
            >
              <h2 className="font-display font-bold text-navy text-2xl tracking-tight mb-8">
                Send a Message
              </h2>

              <div className="bg-white rounded-2xl border border-navy/[0.09] p-8 shadow-[0_2px_24px_rgba(27,42,74,0.06)]">
                {status === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ease }}
                    className="text-center py-10"
                  >
                    <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2} className="w-7 h-7" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-display font-bold text-navy text-xl tracking-tight mb-2">Message Sent!</h3>
                    <p className="text-navy/50 text-sm">We&apos;ll get back to you shortly.</p>
                    <button onClick={() => setStatus('idle')} className="mt-6 text-wine text-sm font-semibold hover:underline underline-offset-4">
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div>
                      <label htmlFor="name" className={labelClass}>Your Name <span className="text-wine">*</span></label>
                      <input id="name" name="name" type="text" required autoComplete="name"
                        value={form.name} onChange={handleChange}
                        placeholder="e.g. Mr. Tunde Adeyemi" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className={labelClass}>Email Address <span className="text-wine">*</span></label>
                      <input id="contact-email" name="email" type="email" required autoComplete="email"
                        value={form.email} onChange={handleChange}
                        placeholder="you@example.com" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="message" className={labelClass}>Message <span className="text-wine">*</span></label>
                      <textarea id="message" name="message" rows={5} required
                        value={form.message} onChange={handleChange}
                        placeholder="How can we help you?" className={`${inputClass} resize-none`} />
                    </div>

                    {status === 'error' && (
                      <div className="bg-red-50 border border-red-200/70 rounded-lg px-4 py-3 text-red-600 text-sm">
                        Something went wrong. Please try again or contact us directly.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full bg-wine text-white font-semibold py-4 rounded-lg hover:bg-wine/90 shadow-wine-glow transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                    >
                      {status === 'loading' ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending…
                        </>
                      ) : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
