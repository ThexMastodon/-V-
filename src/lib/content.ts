import 'server-only'

import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Locale } from '@/i18n/routing'

/**
 * Única puerta de las páginas hacia Payload. Las secciones reciben datos ya resueltos
 * y no saben de dónde vienen.
 */
export const getPayloadClient = cache(() => getPayload({ config }))

export type ProjectCollection = 'products' | 'work' | 'labs'

const LIST_LIMIT = 12

export const getHome = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'home', locale, depth: 0 })
})

export const getSite = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site', locale, depth: 0 })
})

export const getServices = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'services', locale, limit: 20, sort: 'order', depth: 0 })
  return docs
})

export const getProjects = cache(async <C extends ProjectCollection>(collection: C, locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection,
    locale,
    limit: LIST_LIMIT,
    sort: 'order',
    depth: 1,
    where: { _status: { equals: 'published' } },
  })
  return docs
})

/** Con draft mode activo (vista previa desde el panel) también devuelve borradores. */
export const getProjectBySlug = cache(async <C extends ProjectCollection>(collection: C, slug: string, locale: Locale) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection,
    locale,
    draft,
    limit: 1,
    depth: 2,
    overrideAccess: draft,
    where: draft ? { slug: { equals: slug } } : { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return docs[0] ?? null
})

export const getProjectSlugs = async (collection: ProjectCollection) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection,
    limit: 1000,
    depth: 0,
    select: { slug: true },
    where: { _status: { equals: 'published' } },
  })
  return docs.map((doc) => doc.slug).filter((slug): slug is string => Boolean(slug))
}
