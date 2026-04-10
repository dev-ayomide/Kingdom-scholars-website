'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { NewsPost } from '@/lib/types'

const ease = [0.16, 1, 0.3, 1]

interface NewsCardProps {
  post: NewsPost
  index: number
}

export default function NewsCard({ post, index }: NewsCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-navy/[0.07] hover:-translate-y-1.5 hover:shadow-card-hover transition-all duration-300 flex flex-col"
    >
      {/* Top accent stripe */}
      <div className="h-[3px] bg-gradient-to-r from-navy via-wine to-navy opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Date strip */}
      <div className="px-6 pt-5 pb-0">
        <time className="text-[10px] font-semibold tracking-[0.22em] uppercase text-navy/40">
          {post.date}
        </time>
      </div>

      <div className="p-6 pt-3 flex flex-col flex-1">
        <h3 className="font-display font-bold text-navy text-lg leading-snug mb-3 tracking-tight group-hover:text-wine transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-navy/55 text-sm leading-relaxed flex-1 mb-6 line-clamp-3">
          {post.excerpt}
        </p>
        <Link
          href={`/news/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-wine font-semibold text-xs tracking-wide uppercase group/link"
        >
          <span className="group-hover/link:underline underline-offset-4 transition-all">
            Read More
          </span>
          <span
            aria-hidden
            className="translate-x-0 group-hover/link:translate-x-1 transition-transform duration-200"
          >
            →
          </span>
        </Link>
      </div>
    </motion.article>
  )
}
