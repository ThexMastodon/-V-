import { getTranslations } from 'next-intl/server'

import { Wordmark } from '@/components/brand/glyphs'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

const SECTIONS = [
  ['whatWeDo', 'what-we-do'],
  ['products', 'products'],
  ['work', 'work'],
  ['labs', 'labs'],
] as const

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'nav' })
  const other: Locale = locale === 'es' ? 'en' : 'es'

  return (
    <header className="bg-deep text-clean fixed inset-x-0 top-0 z-50">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-4">
        {t('skip')}
      </a>
      <nav className="container-aeva flex h-16 items-center justify-between gap-6">
        <Link href="/" className="text-2xl" aria-label="ÆVΛ — inicio">
          <Wordmark />
        </Link>
        <ul className="hidden items-center gap-8 text-sm text-clean/80 md:flex">
          {SECTIONS.map(([key, anchor]) => (
            <li key={key}>
              <Link href={`/#${anchor}`} className="hover:text-clean transition-colors">
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" locale={other} className="text-clean/70 hover:text-clean transition-colors" hrefLang={other}>
            {t('language')}
          </Link>
          <Link
            href="/#contact"
            className="bg-action rounded-full px-4 py-2 font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            {t('contact')}
          </Link>
        </div>
      </nav>
    </header>
  )
}
