import type { Metadata } from 'next'
import NewsCard from '@/components/ui/NewsCard'
import PageHero from '@/components/ui/PageHero'
import { newsPosts } from '@/lib/data/news'

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'Latest news and updates from Kingdom Scholars Private School, Abeokuta.',
}

export default function NewsPage() {
  return (
    <>
      <PageHero
        label="From KSPS"
        title="News &amp; Updates"
        subtitle="Stay up to date with what's happening at Kingdom Scholars Private School."
      />
      <section className="bg-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsPosts.map((post, i) => (
              <NewsCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
