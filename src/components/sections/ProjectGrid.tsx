import type { Media } from '@/payload-types'

import { ProjectCard, type ProjectCardData } from './ProjectCard'
import { SectionHeading } from './SectionHeading'

type Item = {
  id: number
  slug?: string | null
  title: string
  summary: string
  cover?: number | Media | null
  badge?: string
}

type Props = {
  id: string
  basePath: 'products' | 'work' | 'labs'
  eyebrow: string
  title: string
  empty: string
  items: Item[]
  tone?: 'light' | 'dark'
}

export function ProjectGrid({ id, basePath, eyebrow, title, empty, items, tone = 'light' }: Props) {
  const cards: ProjectCardData[] = items
    .filter((item) => item.slug)
    .map((item) => ({
      id: item.id,
      href: `/${basePath}/${item.slug}`,
      title: item.title,
      summary: item.summary,
      badge: item.badge,
      cover: typeof item.cover === 'object' && item.cover?.url ? { url: item.cover.url, alt: item.cover.alt } : null,
    }))

  return (
    <section id={id} className={`${tone === 'dark' ? 'section-dark' : 'section-light'} py-24 sm:py-32`}>
      <div className="container-aeva">
        <SectionHeading eyebrow={eyebrow} title={title} />
        {cards.length === 0 ? (
          <p className="mt-10 opacity-60">{empty}</p>
        ) : (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <li key={card.id}>
                <ProjectCard card={card} tone={tone} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
