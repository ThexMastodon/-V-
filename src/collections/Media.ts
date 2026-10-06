import type { CollectionConfig } from 'payload'

import { anyone, editors } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Archivo', plural: 'Medios' },
  admin: { group: 'Contenido' },
  access: {
    read: anyone,
    create: editors,
    update: editors,
    delete: editors,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto alternativo',
      required: true,
      localized: true,
      admin: { description: 'Describe la imagen para lectores de pantalla y buscadores.' },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    imageSizes: [
      { name: 'card', width: 800 },
      { name: 'wide', width: 1600 },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    focalPoint: true,
  },
}
