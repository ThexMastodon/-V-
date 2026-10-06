'use client'

import { ReactLenis } from 'lenis/react'
import { useEffect, useState, type ReactNode } from 'react'

/** Scroll suave en todo el sitio, salvo si el usuario pidió reducir el movimiento. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnabled(!query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  if (!enabled) return <>{children}</>

  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: true }}>
      {children}
    </ReactLenis>
  )
}
