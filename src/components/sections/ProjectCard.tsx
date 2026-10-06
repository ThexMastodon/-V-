'use client'

import { motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'

import { Link } from '@/i18n/navigation'

export type ProjectCardData = {
  id: number
  href: string
  title: string
  summary: string
  badge?: string
  cover: { url: string; alt: string } | null
}

/**
 * Tarjeta con aparición sutil al entrar en pantalla y elevación al hover.
 * La aparición solo desplaza (nunca oculta): el contenido es legible sin JS.
 */
export function ProjectCard({ card, tone }: { card: ProjectCardData; tone: 'light' | 'dark' }) {
  const reduce = useReducedMotion()
  const surface = tone === 'dark' ? 'bg-trust/40 border-clean/10' : 'bg-white border-deep/10'

  return (
    <motion.div
      initial={reduce ? false : { y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link href={card.href} className={`group flex h-full flex-col overflow-hidden rounded-2xl border ${surface}`}>
        <div className="bg-trust relative aspect-[4/3] overflow-hidden">
          {card.cover && (
            <Image
              src={card.cover.url}
              alt={card.cover.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          {card.badge && (
            <span className="text-action w-fit text-xs font-semibold tracking-[0.15em] uppercase">{card.badge}</span>
          )}
          <h3 className="font-display text-xl font-semibold tracking-tight">{card.title}</h3>
          <p className="line-clamp-3 opacity-70">{card.summary}</p>
        </div>
      </Link>
    </motion.div>
  )
}
