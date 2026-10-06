'use client'

import { useRef } from 'react'

import { MOTION_OK, MOTION_REDUCED, gsap, useGSAP } from '@/components/motion/gsap'
import { useLenisScrollTrigger } from '@/components/motion/useLenisScrollTrigger'

/** La sección queda fija y el manifiesto se ilumina línea por línea. */
export function Philosophy({ title, lines }: { title: string; lines: string[] }) {
  const root = useRef<HTMLElement>(null)
  useLenisScrollTrigger()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Las líneas son legibles desde el inicio (opacidad 0.25); la animación solo las resalta.
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-line]',
          { opacity: 0.25, y: 12 },
          {
            opacity: 1,
            y: 0,
            stagger: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: () => `+=${window.innerHeight * 1.5}`,
              pin: true,
              scrub: 0.5,
            },
          },
        )
      })

      mm.add(MOTION_REDUCED, () => {
        gsap.from('[data-line]', {
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="philosophy" className="section-dark flex min-h-svh items-center py-24">
      <div className="container-aeva">
        <h2 className="font-display text-sm font-medium tracking-[0.2em] text-clean/60 uppercase">{title}</h2>
        <ul className="mt-10 space-y-4">
          {lines.map((line) => (
            <li
              key={line}
              data-line
              className="font-display text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-semibold tracking-tight text-balance"
            >
              {line}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
