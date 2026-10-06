import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { getProjectSlugs, type ProjectCollection } from '@/lib/content'

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const COLLECTIONS: ProjectCollection[] = ['products', 'work', 'labs']

export const revalidate = 3600

const entry = (path: string): MetadataRoute.Sitemap[number] => ({
  url: `${siteUrl}/${routing.defaultLocale}${path}`,
  alternates: {
    languages: Object.fromEntries(routing.locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`])),
  },
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const details = await Promise.all(
    COLLECTIONS.map(async (collection) => {
      const slugs = await getProjectSlugs(collection).catch(() => [])
      return slugs.map((slug) => entry(`/${collection}/${slug}`))
    }),
  )
  return [entry(''), ...details.flat()]
}
