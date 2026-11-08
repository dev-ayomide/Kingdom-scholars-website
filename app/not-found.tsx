import Link from 'next/link'
import SiteChrome from '@/components/layout/SiteChrome'

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="bg-cream pt-nav min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
          <h1 className="font-display font-bold text-navy text-5xl tracking-tight mb-4">Page not found</h1>
          <p className="text-navy/70 text-lg mb-8">That page doesn&apos;t exist, or it has moved.</p>
          <Link href="/" className="text-wine font-semibold underline underline-offset-4">Go to the home page</Link>
        </div>
      </section>
    </SiteChrome>
  )
}
