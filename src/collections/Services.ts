import type { CollectionConfig } from 'payload'

import { anyone, editors } from '@/access'
import { revalidateEverything } from '@/hooks/revalidate'

import { orderField } from './content'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Servicio', plural: 'Services' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
    group: 'Contenido',
    description: 'Lo que hacemos — sección "What we do".',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  defaultSort: 'order',
  // Los servicios aparecen en la home y en cada proyecto de Work.
  hooks: { afterChange: [revalidateEverything], afterDelete: [revalidateEverything] },
  fields: [
    { name: 'title', type: 'text', label: 'Nombre', required: true, localized: true },
    { name: 'description', type: 'textarea', label: 'Descripción', required: true, localized: true },
    orderField,
  ],
}
