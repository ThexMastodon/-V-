/**
 * Contenido de ejemplo para desarrollo local: `pnpm seed`.
 * Solo crea lo que no existe, así que se puede correr varias veces.
 */
import config from '@payload-config'
import { getPayload, type CollectionSlug, type Payload } from 'payload'

const context = { disableRevalidate: true }

type Data = Record<string, unknown>
type Bilingual = { es: Data; en: Data | ((created: Data) => Data) }

async function upsert(payload: Payload, collection: CollectionSlug, key: Record<string, string>, data: Bilingual & { shared?: Record<string, unknown> }) {
  const [field, value] = Object.entries(key)[0]
  const { docs } = await payload.find({ collection, where: { [field]: { equals: value } }, limit: 1, depth: 0 })
  if (docs[0]) return docs[0]

  const created = await payload.create({
    collection,
    locale: 'es',
    context,
    data: { ...data.shared, ...data.es } as never,
  })
  await payload.update({ collection, id: created.id, locale: 'en', context, data: (typeof data.en === 'function' ? data.en(created as unknown as Data) : data.en) as never })
  return created
}

async function seed() {
  const payload = await getPayload({ config })

  const services = [
    ['SaaS', 'Productos de software por suscripción, de la idea al lanzamiento.', 'Subscription software, from idea to launch.'],
    ['Apps', 'Aplicaciones web y móviles rápidas y cuidadas.', 'Fast, polished web and mobile apps.'],
    ['IA y agentes', 'Agentes que automatizan trabajo real con modelos de lenguaje.', 'Agents that automate real work with language models.'],
    ['E-commerce', 'Tiendas que venden mejor y se operan solas.', 'Stores that sell better and run themselves.'],
  ] as const

  for (const [i, [title, es, en]] of services.entries()) {
    await upsert(payload, 'services', { title }, {
      shared: { order: i },
      es: { title, description: es },
      en: { title: title === 'IA y agentes' ? 'AI & agents' : title, description: en },
    })
  }

  await upsert(payload, 'products', { slug: 'aeva-flow' }, {
    shared: { slug: 'aeva-flow', status: 'beta', _status: 'published', url: 'https://example.com' },
    es: { title: 'ÆVΛ Flow', summary: 'Automatiza procesos con agentes de IA sin escribir código.' },
    en: { title: 'ÆVΛ Flow', summary: 'Automate processes with AI agents, no code required.' },
  })

  await upsert(payload, 'work', { slug: 'retail-lab' }, {
    shared: {
      slug: 'retail-lab',
      client: 'Retail Lab',
      year: 2026,
      _status: 'published',
      results: [{ value: '+38%', label: 'conversión' }],
    },
    es: { title: 'Una tienda que se reinventa cada semana', summary: 'Rediseño y plataforma headless para una marca de retail.' },
    // Las filas del array se conservan por id; solo se traduce la etiqueta.
    en: (created) => ({
      title: 'A store that reinvents itself every week',
      summary: 'Redesign and headless platform for a retail brand.',
      results: (created.results as Data[]).map((row) => ({ ...row, label: 'conversion' })),
    }),
  })

  await upsert(payload, 'labs', { slug: 'voice-agent' }, {
    shared: { slug: 'voice-agent', stage: 'prototype', _status: 'published' },
    es: { title: 'Agente de voz', summary: 'Un agente que atiende llamadas y agenda citas.' },
    en: { title: 'Voice agent', summary: 'An agent that answers calls and books appointments.' },
  })

  payload.logger.info('Seed listo.')
  process.exit(0)
}

await seed()
