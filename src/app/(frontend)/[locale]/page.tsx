import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { Contact } from '@/components/sections/Contact'
import { Hero } from '@/components/sections/Hero'
import { Philosophy } from '@/components/sections/Philosophy'
import { ProjectGrid } from '@/components/sections/ProjectGrid'
import { WhatWeDo } from '@/components/sections/WhatWeDo'
import { WhyAeva, type Pillar } from '@/components/sections/WhyAeva'
import { routing } from '@/i18n/routing'
import { getHome, getProjects, getServices } from '@/lib/content'

/** Lo que el panel deja vacío se completa con el texto por defecto de messages/. */
const or = (value: string | null | undefined, fallback: string) => (value && value.trim()) || fallback

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const [t, home, services, products, work, labs] = await Promise.all([
    getTranslations({ locale }),
    getHome(locale),
    getServices(locale),
    getProjects('products', locale),
    getProjects('work', locale),
    getProjects('labs', locale),
  ])

  const defaultPillars = t.raw('why.pillars') as Pillar[]
  const pillars = defaultPillars.map((fallback, i) => {
    const custom = home.why?.pillars?.[i]
    return { verb: or(custom?.verb, fallback.verb), text: or(custom?.text, fallback.text) }
  })

  const customLines = home.philosophy?.lines?.map((line) => line.text).filter(Boolean) ?? []
  const lines = customLines.length ? customLines : (t.raw('philosophy.lines') as string[])

  return (
    <>
      <Hero
        content={{
          eyebrow: or(home.hero?.eyebrow, t('hero.eyebrow')),
          title: or(home.hero?.title, t('hero.title')),
          lead: or(home.hero?.lead, t('hero.lead')),
          cta: or(home.hero?.cta, t('hero.cta')),
        }}
      />
      <WhatWeDo title={t('whatWeDo.title')} empty={t('whatWeDo.empty')} services={services} />
      <WhyAeva title={or(home.why?.title, t('why.title'))} pillars={pillars} />
      <Philosophy title={or(home.philosophy?.title, t('philosophy.title'))} lines={lines} />
      <ProjectGrid
        id="products"
        basePath="products"
        eyebrow={t('products.eyebrow')}
        title={t('products.title')}
        empty={t('products.empty')}
        items={products.map((p) => ({ ...p, badge: t(`status.${p.status}`) }))}
      />
      <ProjectGrid
        id="work"
        basePath="work"
        eyebrow={t('work.eyebrow')}
        title={t('work.title')}
        empty={t('work.empty')}
        items={work.map((w) => ({ ...w, badge: w.client }))}
      />
      <ProjectGrid
        id="labs"
        basePath="labs"
        eyebrow={t('labs.eyebrow')}
        title={t('labs.title')}
        empty={t('labs.empty')}
        items={labs.map((l) => ({ ...l, badge: t(`status.${l.stage}`) }))}
        tone="dark"
      />
      <Contact title={or(home.contact?.title, t('contact.title'))} lead={or(home.contact?.lead, t('contact.lead'))} />
    </>
  )
}
