import type { CollectionConfig } from 'payload'

import { admins, authenticated, editors } from '@/access'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Lead', plural: 'Leads' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'company', 'status', 'createdAt'],
    group: 'Contacto',
    description: 'Mensajes del formulario de contacto.',
  },
  // El sitio crea leads con la API local desde una server action,
  // así que la API REST pública no permite crearlos directamente.
  access: {
    read: authenticated,
    create: admins,
    update: editors,
    delete: admins,
  },
  defaultSort: '-createdAt',
  fields: [
    { name: 'name', type: 'text', label: 'Nombre', required: true },
    { name: 'email', type: 'email', label: 'Correo', required: true },
    { name: 'company', type: 'text', label: 'Empresa' },
    { name: 'message', type: 'textarea', label: 'Mensaje', required: true },
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      defaultValue: 'new',
      options: [
        { value: 'new', label: 'Nuevo' },
        { value: 'contacted', label: 'Contactado' },
        { value: 'qualified', label: 'Calificado' },
        { value: 'closed', label: 'Cerrado' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'locale',
      type: 'text',
      label: 'Idioma del sitio',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        const to = process.env.LEADS_NOTIFY_TO
        if (operation !== 'create' || !to) return doc
        try {
          await req.payload.sendEmail({
            to,
            replyTo: doc.email,
            subject: `Nuevo lead: ${doc.name}${doc.company ? ` (${doc.company})` : ''}`,
            text: [`Nombre: ${doc.name}`, `Correo: ${doc.email}`, `Empresa: ${doc.company || '—'}`, '', doc.message].join(
              '\n',
            ),
          })
        } catch (err) {
          // El lead ya quedó guardado; un fallo de correo no debe perderlo.
          req.payload.logger.error({ err, msg: 'No se pudo enviar el aviso de lead' })
        }
        return doc
      },
    ],
  },
}
