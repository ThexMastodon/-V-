'use client'

import { useRef } from 'react'

import { GLYPHS, GLYPH_ORDER, Glyph } from '@/components/brand/glyphs'
import { MOTION_OK, MOTION_REDUCED, gsap, useGSAP } from '@/components/motion/gsap'
import { useLenisScrollTrigger } from '@/components/motion/useLenisScrollTrigger'

export type Pillar = { verb: string; text: string }

/**
 * La animación principal del sitio: al hacer scroll la sección queda fija y
 * Æ crea, V acelera, Λ evoluciona, uno tras otro.
 */
export function WhyAeva({ title, pillars }: { title: string; pillars: Pillar[] }) {
  const root = useRef<HTMLElement>(null)
  useLenisScrollTrigger()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const steps = gsap.utils.toArray<HTMLElement>('[data-pillar]')

      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * steps.length}`,
            pin: true,
            scrub: 0.6,
          },
        })

        steps.forEach((step, i) => {
          const paths = step.querySelectorAll('[data-glyph-path]')
          const copy = step.querySelector('[data-pillar-copy]')
          // El texto nunca se oculta del todo: solo se atenúa hasta que le toca.
          tl.from(paths, { drawSVG: 0, stagger: 0.15, duration: 1 }, i)
            .from(copy, { y: 24, opacity: 0.35, duration: 0.6 }, i + 0.3)
        })
      })

      mm.add(MOTION_REDUCED, () => {
        steps.forEach((step) => {
          gsap.from(step, {
            opacity: 0,
            duration: 0.5,
            scrollTrigger: { trigger: step, start: 'top 85%' },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="why" className="section-dark relative isolate flex min-h-svh items-center py-24">
      <div aria-hidden className="glow-aeva pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto size-[38rem] -translate-y-1/2" />
      <div className="container-aeva">
        <h2 className="font-display text-sm font-medium tracking-[0.2em] text-clean/60 uppercase">{title}</h2>
        <ol className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8">
          {GLYPH_ORDER.map((name, i) => {
            const pillar = pillars[i]
            return (
              <li key={name} data-pillar className="flex flex-col gap-6">
                <Glyph name={name} strokeWidth={6} className="text-future size-28 sm:size-36" />
                <div data-pillar-copy>
                  <p className="font-display text-3xl font-semibold tracking-tight">
                    <span className="text-future">{GLYPHS[name].char}</span> {pillar?.verb}
                  </p>
                  {pillar?.text && <p className="mt-3 max-w-xs text-clean/70">{pillar.text}</p>}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
