'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { submitContact, type ContactField, type ContactState } from '@/app/(frontend)/[locale]/actions'

const input =
  'mt-2 w-full rounded-xl border border-deep/15 bg-white px-4 py-3 text-deep placeholder:text-deep/40 aria-[invalid=true]:border-red-500'

export function Contact({ title, lead }: { title: string; lead: string }) {
  const t = useTranslations('contact')
  const locale = useLocale()
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: 'idle' })

  const invalid = (field: ContactField) => state.status === 'invalid' && state.fields.includes(field)

  return (
    <section id="contact" className="section-light py-24 sm:py-32">
      <div className="container-aeva grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-tight font-semibold tracking-tight">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-lg text-deep/70">{lead}</p>
        </div>

        {state.status === 'success' ? (
          <p role="status" className="border-future bg-white self-start rounded-2xl border-l-4 p-6 text-lg">
            {t('success')}
          </p>
        ) : (
          <form action={action} noValidate className="grid gap-5">
            <input type="hidden" name="locale" value={locale} />
            <div aria-hidden className="absolute -left-[9999px]">
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <label className="text-sm font-medium">
              {t('name')}
              <input name="name" required autoComplete="name" aria-invalid={invalid('name')} className={input} />
            </label>
            <label className="text-sm font-medium">
              {t('email')}
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                aria-invalid={invalid('email')}
                className={input}
              />
            </label>
            <label className="text-sm font-medium">
              {t('company')}
              <input name="company" autoComplete="organization" className={input} />
            </label>
            <label className="text-sm font-medium">
              {t('message')}
              <textarea name="message" required rows={5} aria-invalid={invalid('message')} className={input} />
            </label>

            <div aria-live="polite" className="min-h-6 text-sm text-red-600">
              {state.status === 'invalid' && t('invalid')}
              {state.status === 'error' && t('error')}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="bg-action h-12 w-fit rounded-full px-8 font-medium text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {pending ? t('sending') : t('submit')}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
