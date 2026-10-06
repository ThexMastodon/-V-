'use server'

import { hasLocale } from 'next-intl'

import { routing } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/content'

export type ContactField = 'name' | 'email' | 'message'

export type ContactState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'invalid'; fields: ContactField[] }
  | { status: 'error' }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const text = (form: FormData, key: string, max: number) => String(form.get(key) ?? '').trim().slice(0, max)

export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Campo trampa: invisible para personas, los bots suelen llenarlo.
  if (text(form, 'website', 200)) return { status: 'success' }

  const data = {
    name: text(form, 'name', 120),
    email: text(form, 'email', 200),
    company: text(form, 'company', 120),
    message: text(form, 'message', 5000),
  }
  const locale = text(form, 'locale', 5)

  const fields: ContactField[] = []
  if (!data.name) fields.push('name')
  if (!EMAIL.test(data.email)) fields.push('email')
  if (data.message.length < 10) fields.push('message')
  if (fields.length) return { status: 'invalid', fields }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'leads',
      data: { ...data, locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale },
    })
    return { status: 'success' }
  } catch (err) {
    console.error('No se pudo guardar el lead', err)
    return { status: 'error' }
  }
}
