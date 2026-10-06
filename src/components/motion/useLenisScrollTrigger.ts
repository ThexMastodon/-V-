'use client'

import { useLenis } from 'lenis/react'

import { ScrollTrigger } from './gsap'

/** Mantiene ScrollTrigger sincronizado con el scroll suave de Lenis. */
export function useLenisScrollTrigger() {
  useLenis(() => ScrollTrigger.update())
}
