import type { Metadata } from 'next'
import GalleryGrid from '@/components/ui/GalleryGrid'

// Note: This page uses a server component wrapper with generateMetadata,
// and GalleryGrid handles all the client-side interactivity.

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'A glimpse into life at Kingdom Scholars Private School — events, classrooms, and activities.',
}

export default function GalleryPage() {
  return (
    <>
      {/* Hero — compact navy, distinct from other pages */}
      <section className="bg-navy pt-nav relative overflow-hidden hero-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-7 h-[1.5px] bg-wine shrink-0" aria-hidden />
            <span className="text-wine text-[11px] tracking-[0.25em] uppercase font-medium">
              Our School Life
            </span>
          </div>
          <h1
            className="font-display font-bold text-white leading-[0.97] tracking-tight mb-4 max-w-lg"
            style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)' }}
          >
            {'Our '}
            <em style={{ fontStyle: 'italic' }}>Gallery</em>
          </h1>
          <p className="text-cream/50 text-lg max-w-xs mt-3">
            A glimpse into life at Kingdom Scholars.
          </p>
        </div>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryGrid />
        </div>
      </section>
    </>
  )
}
