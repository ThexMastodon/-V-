import type { Field, FieldHook } from 'payload'

export const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    const fallback = data?.[fallbackField] ?? originalDoc?.[fallbackField]
    return typeof fallback === 'string' ? slugify(fallback) : value
  }

/** Slug único, no localizado, generado desde `fallbackField` si se deja vacío. */
export const slugField = (fallbackField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: `Se genera desde "${fallbackField}" si se deja vacío.`,
  },
  hooks: { beforeValidate: [formatSlug(fallbackField)] },
})
