'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

// TODO: Replace with actual Cloudinary image URLs when real gallery photos are available.
// Format: { src: 'https://res.cloudinary.com/...', alt: '...', category: 'events' | 'classrooms' | 'activities' }

type Category = 'all' | 'events' | 'classrooms' | 'activities'

interface GalleryImage {
  id: number
  src: string
  alt: string
  category: Exclude<Category, 'all'>
}

const images: GalleryImage[] = [
  { id: 1,  src: 'https://picsum.photos/seed/ksps1/800/600',  alt: 'School event',        category: 'events'      },
  { id: 2,  src: 'https://picsum.photos/seed/ksps2/600/800',  alt: 'Classroom activity',  category: 'classrooms'  },
  { id: 3,  src: 'https://picsum.photos/seed/ksps3/800/600',  alt: 'Learner activities',  category: 'activities'  },
  { id: 4,  src: 'https://picsum.photos/seed/ksps4/800/600',  alt: 'School event',        category: 'events'      },
  { id: 5,  src: 'https://picsum.photos/seed/ksps5/600/800',  alt: 'Classroom session',   category: 'classrooms'  },
  { id: 6,  src: 'https://picsum.photos/seed/ksps6/800/600',  alt: 'Outdoor activities',  category: 'activities'  },
  { id: 7,  src: 'https://picsum.photos/seed/ksps7/800/600',  alt: 'Prize giving',        category: 'events'      },
  { id: 8,  src: 'https://picsum.photos/seed/ksps8/800/600',  alt: 'Learning time',       category: 'classrooms'  },
  { id: 9,  src: 'https://picsum.photos/seed/ksps9/600/800',  alt: 'Sports day',          category: 'activities'  },
  { id: 10, src: 'https://picsum.photos/seed/ksps10/800/600', alt: 'Graduation',          category: 'events'      },
  { id: 11, src: 'https://picsum.photos/seed/ksps11/800/600', alt: 'Nursery class',       category: 'classrooms'  },
  { id: 12, src: 'https://picsum.photos/seed/ksps12/800/600', alt: 'Group activities',    category: 'activities'  },
]

const tabs: { label: string; value: Category }[] = [
  { label: 'All',         value: 'all'        },
  { label: 'Events',      value: 'events'     },
  { label: 'Classrooms',  value: 'classrooms' },
  { label: 'Activities',  value: 'activities' },
]

export default function GalleryGrid() {
  const [active, setActive] = useState<Category>('all')

  const filtered =
    active === 'all' ? images : images.filter((img) => img.category === active)

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActive(tab.value)}
            className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              active === tab.value
                ? 'bg-navy text-white shadow-navy-glow'
                : 'bg-white text-navy/70 border border-navy/10 hover:border-wine/30 hover:text-wine'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((img) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="break-inside-avoid overflow-hidden rounded-2xl shadow-sm group cursor-pointer border border-navy/[0.06]"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
