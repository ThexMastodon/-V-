import type { GlobalConfig } from 'payload'

import { anyone, editors } from '@/access'
import { revalidateEverything } from '@/hooks/revalidate'

/** Textos de la página principal. Lo que se deje vacío usa el texto por defecto de messages/. */
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Página principal',
  admin: { group: 'Sitio' },
  access: { read: anyone, update: editors },
  hooks: { afterChange: [revalidateEverything] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: 'Hero',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Antetítulo', localized: true },
            { name: 'title', type: 'text', label: 'Titular', localized: true },
            { name: 'lead', type: 'textarea', label: 'Bajada', localized: true },
            { name: 'cta', type: 'text', label: 'Texto del botón', localized: true },
          ],
        },
        {
          name: 'why',
          label: 'Why ÆVΛ',
          fields: [
            { name: 'title', type: 'text', label: 'Título', localized: true },
            {
              name: 'pillars',
              type: 'array',
              label: 'Símbolos',
              maxRows: 3,
              admin: { description: 'En orden: Æ, V, Λ.' },
              fields: [
                { name: 'verb', type: 'text', label: 'Verbo', localized: true, required: true },
                { name: 'text', type: 'textarea', label: 'Texto', localized: true },
              ],
            },
          ],
        },
        {
          name: 'philosophy',
          label: 'Philosophy',
          fields: [
            { name: 'title', type: 'text', label: 'Título', localized: true },
            {
              name: 'lines',
              type: 'array',
              label: 'Manifiesto',
              labels: { singular: 'Línea', plural: 'Líneas' },
              fields: [{ name: 'text', type: 'text', localized: true, required: true }],
            },
          ],
        },
        {
          name: 'contact',
          label: 'Contacto',
          fields: [
            { name: 'title', type: 'text', label: 'Título', localized: true },
            { name: 'lead', type: 'textarea', label: 'Bajada', localized: true },
          ],
        },
      ],
    },
  ],
}
