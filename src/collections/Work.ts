import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'

import { contentAccess, coverField, orderField, revalidationHooks, seoField, versioned } from './content'

export const Work: CollectionConfig = {
  slug: 'work',
  labels: { singular: 'Proyecto', plural: 'Work' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', '_status', 'updatedAt'],
    group: 'Contenido',
    description: 'Proyectos con clientes — sección "Built with ÆVΛ".',
  },
  access: contentAccess,
  versions: versioned,
  defaultSort: 'order',
  hooks: revalidationHooks('work'),
  fields: [
    { name: 'title', type: 'text', label: 'Título', required: true, localized: true },
    { name: 'client', type: 'text', label: 'Cliente', required: true },
    { name: 'year', type: 'number', label: 'Año' },
    { name: 'summary', type: 'textarea', label: 'Resumen', required: true, localized: true },
    coverField,
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Servicios',
    },
    { name: 'challenge', type: 'richText', label: 'Reto', localized: true },
    { name: 'solution', type: 'richText', label: 'Solución', localized: true },
    {
      name: 'results',
      type: 'array',
      label: 'Resultados',
      labels: { singular: 'Resultado', plural: 'Resultados' },
      fields: [
        { name: 'value', type: 'text', label: 'Cifra', required: true, admin: { placeholder: '+38%' } },
        { name: 'label', type: 'text', label: 'Qué mide', required: true, localized: true },
      ],
    },
    { name: 'url', type: 'text', label: 'Enlace' },
    seoField,
    slugField(),
    orderField,
  ],
}
