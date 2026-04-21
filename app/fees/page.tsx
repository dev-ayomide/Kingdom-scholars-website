'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { PaymentInquiryFormData } from '@/lib/types'

const ease = [0.25, 0.1, 0.25, 1]

const classOptions = [
  'Crèche', 'Kindergarten', 'Nursery 1', 'Nursery 2',
  'Primary 1', 'Primary 2', 'Primary 3',
  'Primary 4', 'Primary 5', 'Primary 6',
]

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const inputClass =
  'w-full border border-navy/15 rounded-lg px-4 py-3.5 text-navy text-sm placeholder:text-navy/30 focus:outline-none focus:border-wine/40 focus:ring-2 focus:ring-wine/10 transition-all duration-200 bg-white font-sans'

const labelClass = 'block text-navy/50 font-semibold text-[11px] tracking-[0.18em] uppercase mb-2'

export default function FeesPage() {
  const [form, setForm] = useState<PaymentInquiryFormData>({
    parentName: '', email: '', phone: '',
    classInterestedIn: '', message: '',
  })
  const [status, setStatus] = useState<FormStatus>('idle')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/payment-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setForm({ parentName: '', email: '', phone: '', classInterestedIn: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
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
                  Financial Information
                </span>
              </div>

              <h1
                className="font-display font-bold text-navy leading-[0.97] tracking-tight mb-4"
                style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)' }}
              >
                Fees & <em style={{ fontStyle: 'italic' }}>Payments</em>
              </h1>
            </div>

            <div className="md:pb-2">
              <p className="text-navy/55 text-lg leading-relaxed max-w-md">
                Request details about our tuition fees, payment schedules, and other financial 
                requirements for the upcoming academic session.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease }}
          >
            <div className="bg-white rounded-2xl border border-navy/[0.09] p-8 md:p-10 shadow-[0_2px_24px_rgba(27,42,74,0.06)]">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ease }}
                  className="text-center py-10"
                >
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2} className="w-7 h-7" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="font-display font-bold text-navy text-2xl tracking-tight mb-2">
                    Inquiry Sent!
                  </h2>
                  <p className="text-navy/50 text-sm leading-relaxed max-w-xs mx-auto">
                    Thank you! We&apos;ve received your request for fee information and will respond to your email shortly.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-7 text-wine text-sm font-semibold hover:underline underline-offset-4"
                  >
                    Send another inquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <label htmlFor="parentName" className={labelClass}>
                      Parent / Guardian Full Name <span className="text-wine">*</span>
                    </label>
                    <input id="parentName" name="parentName" type="text" required autoComplete="name"
                      value={form.parentName} onChange={handleChange}
                      placeholder="e.g. Mrs. Amaka Okafor" className={inputClass} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email <span className="text-wine">*</span>
                      </label>
                      <input id="email" name="email" type="email" required autoComplete="email"
                        value={form.email} onChange={handleChange}
                        placeholder="you@example.com" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        Phone <span className="text-wine">*</span>
                      </label>
                      <input id="phone" name="phone" type="tel" required autoComplete="tel"
                        value={form.phone} onChange={handleChange}
                        placeholder="+234 800 000 0000" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="classInterestedIn" className={labelClass}>
                      Class of Interest <span className="text-wine">*</span>
                    </label>
                    <select id="classInterestedIn" name="classInterestedIn" required
                      value={form.classInterestedIn} onChange={handleChange} className={inputClass}>
                      <option value="">Select a class…</option>
                      {classOptions.map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClass}>
                      Your Inquiry <span className="text-wine">*</span>
                    </label>
                    <textarea id="message" name="message" rows={4} required value={form.message}
                      onChange={handleChange}
                      placeholder="Please specify what you would like to know about our fees…"
                      className={`${inputClass} resize-none`} />
                  </div>

                  {status === 'error' && (
                    <div className="bg-red-50 border border-red-200/70 rounded-lg px-4 py-3 text-red-600 text-sm">
                      Something went wrong. Please try again or contact us directly.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-wine text-white font-semibold py-4 rounded-lg hover:bg-wine/90 shadow-wine-glow transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      'Request Fee Details'
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
