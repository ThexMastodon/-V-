import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'

import { contentAccess, coverField, orderField, revalidationHooks, seoField, versioned } from './content'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Producto', plural: 'Products' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', '_status', 'updatedAt'],
    group: 'Contenido',
    description: 'Productos propios — sección "Built by ÆVΛ".',
  },
  access: contentAccess,
  versions: versioned,
  defaultSort: 'order',
  hooks: revalidationHooks('products'),
  fields: [
    { name: 'title', type: 'text', label: 'Nombre', required: true, localized: true },
    { name: 'summary', type: 'textarea', label: 'Resumen', required: true, localized: true },
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      required: true,
      defaultValue: 'building',
      // Evita chocar con el enum de borradores (_status) que Payload crea en Postgres.
      enumName: 'enum_products_lifecycle',
      options: [
        { value: 'concept', label: 'Concepto' },
        { value: 'building', label: 'En construcción' },
        { value: 'beta', label: 'Beta' },
        { value: 'live', label: 'Disponible' },
      ],
    },
    coverField,
    { name: 'body', type: 'richText', label: 'Descripción', localized: true },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galería',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'url', type: 'text', label: 'Enlace al producto' },
    seoField,
    slugField(),
    orderField,
  ],
}
