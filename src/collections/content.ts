import type { CollectionConfig, Field } from 'payload'

import { authenticated, editors, publishedOrAuthenticated } from '@/access'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'

/** Reglas y campos que comparten Products, Work y Labs. */
export const contentAccess: CollectionConfig['access'] = {
  read: publishedOrAuthenticated,
  readVersions: authenticated,
  create: editors,
  update: editors,
  delete: editors,
}

export const versioned: CollectionConfig['versions'] = {
  drafts: { autosave: { interval: 1500 }, schedulePublish: true },
  maxPerDoc: 50,
}

export const revalidationHooks = (basePath: string): CollectionConfig['hooks'] => ({
  afterChange: [revalidateCollection(basePath)],
  afterDelete: [revalidateCollectionDelete(basePath)],
})

export const orderField: Field = {
  name: 'order',
  type: 'number',
  label: 'Orden',
  defaultValue: 0,
  admin: { position: 'sidebar', description: 'Menor aparece primero.' },
}

export const coverField: Field = {
  name: 'cover',
  type: 'upload',
  relationTo: 'media',
  label: 'Portada',
}

export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: { description: 'Opcional. Si se deja vacío se usan el título, el resumen y la portada.' },
  fields: [
    { name: 'title', type: 'text', localized: true, label: 'Título' },
    { name: 'description', type: 'textarea', localized: true, label: 'Descripción' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Imagen para compartir' },
  ],
}
