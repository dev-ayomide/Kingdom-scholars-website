'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

type Category = 'all' | 'events' | 'activities' | 'professional-day' | 'staff'

interface GalleryImage {
  id: number
  src: string
  alt: string
  category: Exclude<Category, 'all'>
}

const images: GalleryImage[] = [
  { id: 1,  src: '/images/gallery/graduation-ceremony.jpg',    alt: 'KSPS Graduation Ceremony — learners in gowns',        category: 'events'           },
  { id: 2,  src: '/images/gallery/childrens-day.jpg',          alt: "Children's Day celebration with students and staff",          category: 'events'           },
  { id: 3,  src: '/images/gallery/prize-giving-day.jpg',       alt: 'Prize Giving Day — teachers presenting awards to learners',   category: 'events'           },
  { id: 4,  src: '/images/gallery/students-performing.jpg',    alt: 'Students performing at the KSPS Prize Giving ceremony',       category: 'events'           },
  { id: 5,  src: '/images/gallery/graduation-gowning.jpg',     alt: 'Parents proudly gowning graduates on stage',                 category: 'events'           },
  { id: 6,  src: '/images/gallery/sports-day-yellow.jpg',      alt: 'Sports Day — Yellow team marching with flag',                 category: 'activities'       },
  { id: 7,  src: '/images/gallery/sports-day-blue.jpg',        alt: 'Sports Day — Blue team marching in formation',                category: 'activities'       },
  { id: 8,  src: '/images/gallery/sports-day-green.jpg',       alt: 'Sports Day — Green team ready to compete',                   category: 'activities'       },
  { id: 14, src: '/images/gallery/sports-day-purple.jpeg',    alt: 'Sports Day — Purple team marching with pride',               category: 'activities'       },
  { id: 9,  src: '/images/gallery/fun-day-slide.jpg',          alt: 'Fun Day — learners enjoying the inflatable slide',            category: 'activities'       },
  { id: 10, src: '/images/gallery/school-outing.jpg',          alt: 'School outing — learners on a guided field trip',             category: 'activities'       },
  { id: 11, src: '/images/gallery/professional-day-banner.jpg',alt: 'Professional Day — learners in white coats at KSPS banner',  category: 'professional-day' },
  { id: 12, src: '/images/gallery/professional-day-doctors.jpg',alt: 'Professional Day — students dressed as doctor and nurse',   category: 'professional-day' },
  { id: 13, src: '/images/gallery/professional-day-group.jpg', alt: 'Professional Day — students dressed in various professions', category: 'professional-day' },
  { id: 15, src: '/images/gallery/at-olumo-rock.jpg',          alt: 'Visit to Olumo Rock',                                         category: 'events'           },
  { id: 16, src: '/images/gallery/cultural-day.jpg',           alt: 'Cultural Day celebration in school',                          category: 'events'           },
  { id: 17, src: '/images/gallery/cultural-day-olumo.jpg',     alt: 'Cultural Day outing at Olumo Rock',                           category: 'events'           },
  { id: 18, src: '/images/gallery/cultural-day-1.jpg',         alt: 'Students during Cultural Day',                                category: 'events'           },
  { id: 19, src: '/images/gallery/cultural-day-2.jpg',         alt: 'Cultural Day activities',                                     category: 'events'           },
  { id: 20, src: '/images/gallery/cultural-day-3.jpg',         alt: 'Celebrating our heritage on Cultural Day',                    category: 'events'           },
  { id: 21, src: '/images/gallery/cultural-day-4.jpg',         alt: 'Cultural Day celebration',                                    category: 'events'           },
  { id: 22, src: '/images/gallery/cultural-day-5.jpg',         alt: 'Cultural Day event',                                          category: 'events'           },
  { id: 23, src: '/images/team/staff-of-ksps.jpg',             alt: 'Staff of Kingdom Scholars Private School',                    category: 'staff'            },
  { id: 24, src: '/images/team/staff-training-1.jpg',          alt: 'Staff training session',                                      category: 'staff'            },
  { id: 25, src: '/images/team/staff-training-2.jpg',          alt: 'Teachers during staff training',                              category: 'staff'            },
]

const tabs: { label: string; value: Category }[] = [
  { label: 'All',             value: 'all'             },
  { label: 'Events',          value: 'events'          },
  { label: 'Activities',      value: 'activities'      },
  { label: 'Professional Day',value: 'professional-day'},
  { label: 'Staff',           value: 'staff'           },
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
                  height={1000}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Hover overlay with caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-xs font-medium leading-snug line-clamp-2">{img.alt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
