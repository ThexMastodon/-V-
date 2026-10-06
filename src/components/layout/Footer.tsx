import { getTranslations } from 'next-intl/server'

import { Wordmark } from '@/components/brand/glyphs'
import type { Locale } from '@/i18n/routing'
import type { Site } from '@/payload-types'

export async function Footer({ locale, site }: { locale: Locale; site: Site }) {
  const t = await getTranslations({ locale, namespace: 'footer' })

  return (
    <footer className="section-dark py-16">
      <div className="container-aeva flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Wordmark className="text-future text-4xl" />
          {site.footerNote && <p className="mt-4 max-w-sm text-clean/60">{site.footerNote}</p>}
        </div>
        <div className="flex flex-col gap-4 text-sm text-clean/70 md:items-end">
          {site.contactEmail && (
            <a href={`mailto:${site.contactEmail}`} className="hover:text-clean transition-colors">
              {site.contactEmail}
            </a>
          )}
          {site.social && site.social.length > 0 && (
            <ul className="flex gap-5">
              {site.social.map((item) => (
                <li key={item.id ?? item.url}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-clean transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="text-clean/40">
            © {new Date().getFullYear()} ÆVΛ. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
