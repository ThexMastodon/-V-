import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'

import { contentAccess, coverField, orderField, revalidationHooks, seoField, versioned } from './content'

export const Labs: CollectionConfig = {
  slug: 'labs',
  labels: { singular: 'Experimento', plural: 'Labs' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'stage', '_status', 'updatedAt'],
    group: 'Contenido',
    description: "Experimentos y prototipos — sección \"What's next?\".",
  },
  access: contentAccess,
  versions: versioned,
  defaultSort: 'order',
  hooks: revalidationHooks('labs'),
  fields: [
    { name: 'title', type: 'text', label: 'Título', required: true, localized: true },
    { name: 'summary', type: 'textarea', label: 'Resumen', required: true, localized: true },
    {
      name: 'stage',
      type: 'select',
      label: 'Etapa',
      required: true,
      defaultValue: 'idea',
      options: [
        { value: 'idea', label: 'Idea' },
        { value: 'prototype', label: 'Prototipo' },
        { value: 'testing', label: 'En pruebas' },
        { value: 'graduated', label: 'Graduado a producto' },
      ],
    },
    coverField,
    { name: 'body', type: 'richText', label: 'Contenido', localized: true },
    seoField,
    slugField(),
    orderField,
  ],
}
