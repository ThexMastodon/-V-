import type { CollectionConfig } from 'payload'

import { ROLES, admins, adminsField, adminsOrSelf, authenticated } from '@/access'

const roleLabels = { admin: 'Admin', editor: 'Editor', viewer: 'Viewer' } as const

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Panel',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  access: {
    read: authenticated,
    create: admins,
    update: adminsOrSelf,
    delete: admins,
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nombre' },
    {
      name: 'role',
      type: 'select',
      label: 'Rol',
      required: true,
      defaultValue: 'viewer',
      saveToJWT: true,
      options: ROLES.map((role) => ({ value: role, label: roleLabels[role] })),
      access: {
        create: adminsField,
        update: adminsField,
      },
      admin: {
        description: 'Admin: todo · Editor: crear y publicar contenido · Viewer: solo lectura.',
      },
    },
  ],
  hooks: {
    beforeChange: [
      // La primera cuenta (creada desde /admin/create-first-user) siempre es Admin.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        if (totalDocs === 0) data.role = 'admin'
        return data
      },
    ],
  },
}
