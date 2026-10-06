'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

/**
 * GSAP solo se importa desde componentes de sección que lo usan (Hero, Why, Philosophy),
 * así que no entra en el bundle del resto del sitio.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin)

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const MOTION_REDUCED = '(prefers-reduced-motion: reduce)'

export { gsap, ScrollTrigger, SplitText, useGSAP }
