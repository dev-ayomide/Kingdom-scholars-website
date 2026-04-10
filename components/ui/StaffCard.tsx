'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { StaffMember } from '@/lib/types'

const ease = [0.16, 1, 0.3, 1]

interface StaffCardProps {
  member: StaffMember
  index: number
}

export default function StaffCard({ member, index }: StaffCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.09, ease }}
      className="group relative bg-white rounded-2xl p-7 border border-navy/[0.07] flex flex-col items-center text-center hover:-translate-y-1.5 hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-wine/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

      {/* Watermark index — subtle background number */}
      <span
        className="absolute top-3 right-4 font-display font-black text-7xl text-navy/[0.04] select-none pointer-events-none leading-none"
        aria-hidden
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="relative z-10 flex flex-col items-center">
        {/* Avatar */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden mb-5 ring-2 ring-cream group-hover:ring-wine/30 transition-all duration-300">
          <Image
            src={member.image}
            alt={`${member.name}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="80px"
            // TODO: Replace with real staff photo when available
          />
        </div>

        {/* Name */}
        <h3 className="font-display font-bold text-navy text-base leading-tight mb-2 tracking-tight">
          {member.name}
        </h3>

        {/* Role badge */}
        <span className="inline-block bg-wine/10 text-wine text-[10px] font-semibold tracking-[0.15em] uppercase px-3 py-1 rounded-full mb-4">
          {member.role}
        </span>

        {/* Bio */}
        <p className="text-navy/55 text-sm leading-relaxed">{member.bio}</p>
      </div>
    </motion.div>
  )
}
