import { revalidatePath } from 'next/cache.js'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, RequestContext } from 'payload'

import { locales } from '@/i18n/routing'

type WithSlug = { slug?: string | null }

const safeRevalidate = (paths: string[], type?: 'layout' | 'page') => {
  for (const path of paths) {
    try {
      revalidatePath(path, type)
    } catch {
      // Fuera del runtime de Next (seeds, scripts, migraciones) no hay caché que invalidar.
    }
  }
}

const pathsFor = (basePath: string, slug?: string | null) =>
  locales.flatMap((locale) => [`/${locale}`, ...(slug ? [`/${locale}/${basePath}/${slug}`] : [])])

/**
 * Regenera la home y la página de detalle del documento en cada idioma.
 * Si cambió el slug, también la URL anterior.
 */
export const revalidateCollection =
  (basePath: string): CollectionAfterChangeHook<WithSlug & { id: number | string }> =>
  ({ doc, previousDoc, context }) => {
    if (context.disableRevalidate) return doc
    const paths = pathsFor(basePath, doc.slug)
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      paths.push(...pathsFor(basePath, previousDoc.slug))
    }
    safeRevalidate(paths)
    return doc
  }

export const revalidateCollectionDelete =
  (basePath: string): CollectionAfterDeleteHook<WithSlug & { id: number | string }> =>
  ({ doc, context }) => {
    if (!context.disableRevalidate) safeRevalidate(pathsFor(basePath, doc?.slug))
    return doc
  }

/** Para contenido que aparece en todas las páginas (globals, servicios). */
export const revalidateEverything = <T>({ doc, context }: { doc: T; context: RequestContext }): T => {
  if (!context.disableRevalidate) safeRevalidate(['/'], 'layout')
  return doc
}
