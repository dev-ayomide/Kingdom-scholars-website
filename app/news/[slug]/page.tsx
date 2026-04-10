import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { newsPosts } from '@/lib/data/news'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return newsPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = newsPosts.find((p) => p.slug === params.slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default function NewsPostPage({ params }: Props) {
  const post = newsPosts.find((p) => p.slug === params.slug)
  if (!post) notFound()

  // Format paragraphs from content string
  const paragraphs = post.content
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <>
      {/* Article hero */}
      <section className="bg-navy -mt-[80px] pt-[80px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-cream/60 hover:text-cream text-sm mb-8 transition-colors"
          >
            <span aria-hidden>←</span> Back to News
          </Link>
          <time className="text-wine text-xs font-bold tracking-[0.2em] uppercase block mb-4">
            {post.date}
          </time>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Article body */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-navy max-w-none">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="text-navy/75 text-base md:text-lg leading-relaxed mb-5"
              >
                {para}
              </p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-cream">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-wine font-semibold hover:underline underline-offset-4"
            >
              <span aria-hidden>←</span> Back to all news
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
