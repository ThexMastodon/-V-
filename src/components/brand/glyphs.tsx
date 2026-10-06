import type { SVGProps } from 'react'

/**
 * Los tres símbolos de ÆVΛ dibujados como trazos (no texto), para poder animarlos.
 * Cada uno vive en una caja de 100×100 y se pinta con currentColor.
 */
export const GLYPHS = {
  ae: {
    char: 'Æ',
    paths: ['M6 90 L48 10', 'M23 58 H48', 'M48 10 H94', 'M48 10 V90 H94', 'M48 50 H86'],
  },
  v: {
    char: 'V',
    paths: ['M10 10 L50 90 L90 10'],
  },
  lambda: {
    char: 'Λ',
    paths: ['M10 90 L50 10 L90 90'],
  },
} as const

export type GlyphName = keyof typeof GLYPHS
export const GLYPH_ORDER: GlyphName[] = ['ae', 'v', 'lambda']

type GlyphProps = SVGProps<SVGSVGElement> & { name: GlyphName; strokeWidth?: number }

export function Glyph({ name, strokeWidth = 8, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false" {...props}>
      {GLYPHS[name].paths.map((d) => (
        <path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="square"
          strokeLinejoin="miter"
          data-glyph-path
        />
      ))}
    </svg>
  )
}

/** Logotipo: Æ V Λ en línea, con nombre accesible. */
export function Wordmark({ className, strokeWidth = 9 }: { className?: string; strokeWidth?: number }) {
  return (
    <span role="img" aria-label="ÆVΛ" className={`inline-flex items-center gap-[0.12em] ${className ?? ''}`}>
      {GLYPH_ORDER.map((name) => (
        <Glyph key={name} name={name} strokeWidth={strokeWidth} className="h-[1em] w-[1em]" />
      ))}
    </span>
  )
}
