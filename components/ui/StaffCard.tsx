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
      className="group relative bg-white rounded-2xl overflow-hidden border border-navy/[0.07] hover:-translate-y-1.5 hover:shadow-card-hover transition-all duration-300"
    >
      {/* Photo — square crop, pulled slightly toward top to favour faces */}
      <div className="relative aspect-square overflow-hidden bg-navy/5">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover object-[50%_15%] group-hover:scale-[1.04] transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Smooth gradient into card body */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
      </div>

      {/* Info */}
      <div className="px-6 pt-5 pb-6">
        <span className="inline-block bg-wine/10 text-wine text-[10px] font-semibold tracking-[0.15em] uppercase px-3 py-1 rounded-full mb-3">
          {member.role}
        </span>
        <h3 className="font-display font-bold text-navy text-lg leading-tight mb-3 tracking-tight">
          {member.name}
        </h3>
        <p className="text-navy/55 text-sm leading-relaxed">{member.bio}</p>
      </div>

      {/* Wine accent line slides in on hover */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-wine scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </motion.div>
  )
}
