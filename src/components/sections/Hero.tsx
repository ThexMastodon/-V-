'use client'

import { useRef } from 'react'

import { Wordmark } from '@/components/brand/glyphs'
import { MOTION_OK, MOTION_REDUCED, SplitText, gsap, useGSAP } from '@/components/motion/gsap'

export type HeroContent = {
  eyebrow: string
  title: string
  lead: string
  cta: string
}

/** Entrada del logotipo y el titular, una sola vez al cargar. */
export function Hero({ content }: { content: HeroContent }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        const split = SplitText.create('[data-hero-title]', { type: 'lines', mask: 'lines' })
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        tl.from('[data-glyph-path]', { drawSVG: 0, duration: 1.1, stagger: 0.08 })
          .from(split.lines, { yPercent: 110, duration: 1, stagger: 0.08 }, 0.35)
          .from('[data-hero-fade]', { y: 16, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.6)
        return () => split.revert()
      })

      mm.add(MOTION_REDUCED, () => {
        gsap.from('[data-hero-fade], [data-glyph-path]', { opacity: 0, duration: 0.4 })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="section-dark relative isolate overflow-hidden pt-28 pb-24 sm:pt-36 sm:pb-32">
      <div aria-hidden className="glow-aeva pointer-events-none absolute -top-40 right-[-10%] -z-10 size-[42rem]" />
      <div className="container-aeva">
        <Wordmark className="text-future text-[clamp(4rem,14vw,10rem)]" strokeWidth={7} />
        <p data-hero-fade className="mt-10 text-sm font-medium tracking-[0.2em] text-clean/60 uppercase">
          {content.eyebrow}
        </p>
        <h1
          data-hero-title
          className="font-display mt-4 max-w-4xl text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] font-semibold tracking-tight text-balance"
        >
          {content.title}
        </h1>
        <p data-hero-fade className="mt-6 max-w-2xl text-lg text-clean/75 sm:text-xl">
          {content.lead}
        </p>
        <a
          data-hero-fade
          href="#contact"
          className="bg-action mt-10 inline-flex h-12 items-center rounded-full px-7 font-medium text-white transition-transform hover:-translate-y-0.5"
        >
          {content.cta}
        </a>
      </div>
    </section>
  )
}
