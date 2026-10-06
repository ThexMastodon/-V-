import type { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Inter, Inter_Tight } from 'next/font/google'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { routing } from '@/i18n/routing'
import { getSite } from '@/lib/content'

import '../styles.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-inter-tight', display: 'swap' })

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    metadataBase: new URL(siteUrl),
    title: { default: t('title'), template: '%s · ÆVΛ' },
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
    openGraph: { siteName: 'ÆVΛ', locale, type: 'website' },
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const site = await getSite(locale)

  return (
    <html lang={locale} className={`${inter.variable} ${interTight.variable}`}>
      <body>
        <NextIntlClientProvider>
          <SmoothScroll>
            <Header locale={locale} />
            <main id="main">{children}</main>
            <Footer locale={locale} site={site} />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
