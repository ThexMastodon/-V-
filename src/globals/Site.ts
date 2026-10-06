import type { GlobalConfig } from 'payload'

import { anyone, editors } from '@/access'
import { revalidateEverything } from '@/hooks/revalidate'

export const Site: GlobalConfig = {
  slug: 'site',
  label: 'Navegación y pie',
  admin: { group: 'Sitio' },
  access: { read: anyone, update: editors },
  hooks: { afterChange: [revalidateEverything] },
  fields: [
    { name: 'contactEmail', type: 'email', label: 'Correo público' },
    {
      name: 'social',
      type: 'array',
      label: 'Redes',
      fields: [
        { name: 'label', type: 'text', label: 'Nombre', required: true },
        { name: 'url', type: 'text', label: 'URL', required: true },
      ],
    },
    { name: 'footerNote', type: 'text', label: 'Nota del pie', localized: true },
  ],
}
