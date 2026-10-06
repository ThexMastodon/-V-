import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { routing } from '@/i18n/routing'
import { getProjectBySlug, getProjectSlugs, type ProjectCollection } from '@/lib/content'

import { ProjectDetail } from './ProjectDetail'

type Params = Promise<{ locale: string; slug: string }>

/**
 * Las páginas /products/[slug], /work/[slug] y /labs/[slug] son iguales salvo la colección.
 * Se generan estáticas y Payload las regenera al publicar (ver hooks/revalidate.ts).
 */
export function detailRoute(collection: ProjectCollection) {
  async function load(params: Params) {
    const { locale, slug } = await params
    if (!hasLocale(routing.locales, locale)) notFound()
    const doc = await getProjectBySlug(collection, slug, locale)
    if (!doc) notFound()
    return { locale, doc }
  }

  async function generateStaticParams() {
    try {
      const slugs = await getProjectSlugs(collection)
      return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
    } catch {
      // Sin base de datos en el build, las páginas se generan en la primera visita.
      return []
    }
  }

  async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { locale, doc } = await load(params)
    const image = typeof doc.seo?.image === 'object' ? doc.seo.image : typeof doc.cover === 'object' ? doc.cover : null
    const ogUrl = image?.sizes?.og?.url ?? image?.url

    return {
      title: doc.seo?.title || doc.title,
      description: doc.seo?.description || doc.summary,
      alternates: {
        canonical: `/${locale}/${collection}/${doc.slug}`,
        languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/${collection}/${doc.slug}`])),
      },
      openGraph: ogUrl ? { images: [{ url: ogUrl, width: 1200, height: 630 }] } : undefined,
    }
  }

  async function Page({ params }: { params: Params }) {
    const { locale, doc } = await load(params)
    setRequestLocale(locale)
    // El cast es seguro: `doc` viene de la misma `collection` que `kind`.
    return <ProjectDetail {...({ kind: collection, doc, locale } as Parameters<typeof ProjectDetail>[0])} />
  }

  return { generateStaticParams, generateMetadata, Page }
}
