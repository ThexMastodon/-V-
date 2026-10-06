import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import type { Lab, Media, Product, Work } from '@/payload-types'

type Props =
  | { kind: 'products'; doc: Product; locale: Locale }
  | { kind: 'work'; doc: Work; locale: Locale }
  | { kind: 'labs'; doc: Lab; locale: Locale }

const asMedia = (value: number | Media | null | undefined) =>
  typeof value === 'object' && value?.url ? value : null

function Rich({ data }: { data?: SerializedEditorState | null }) {
  if (!data) return null
  return <RichText data={data} className="prose-aeva space-y-4 text-lg leading-relaxed text-deep/80" />
}

export async function ProjectDetail(props: Props) {
  const { kind, doc, locale } = props
  const t = await getTranslations({ locale })
  const cover = asMedia(doc.cover)

  const badge =
    kind === 'products' ? t(`status.${props.doc.status}`) : kind === 'labs' ? t(`status.${props.doc.stage}`) : props.doc.client

  return (
    <article className="section-light">
      <header className="section-dark pt-32 pb-16">
        <div className="container-aeva">
          <Link href={`/#${kind}`} className="text-sm text-clean/60 hover:text-clean transition-colors">
            ← {t('detail.back')}
          </Link>
          <p className="text-future mt-8 text-xs font-semibold tracking-[0.15em] uppercase">{badge}</p>
          <h1 className="font-display mt-3 max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.05] font-semibold tracking-tight text-balance">
            {doc.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-clean/75">{doc.summary}</p>
        </div>
      </header>

      {cover && (
        <div className="container-aeva -mt-px pt-12">
          <Image
            src={cover.url!}
            alt={cover.alt}
            width={cover.width ?? 1600}
            height={cover.height ?? 900}
            sizes="(min-width: 1152px) 1152px, 100vw"
            priority
            className="w-full rounded-2xl"
          />
        </div>
      )}

      <div className="container-aeva grid gap-12 py-16 sm:py-24">
        {kind === 'work' ? (
          <>
            {props.doc.challenge && (
              <section>
                <h2 className="font-display text-2xl font-semibold">{t('detail.challenge')}</h2>
                <div className="mt-4 max-w-3xl">
                  <Rich data={props.doc.challenge} />
                </div>
              </section>
            )}
            {props.doc.solution && (
              <section>
                <h2 className="font-display text-2xl font-semibold">{t('detail.solution')}</h2>
                <div className="mt-4 max-w-3xl">
                  <Rich data={props.doc.solution} />
                </div>
              </section>
            )}
            {props.doc.results && props.doc.results.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-semibold">{t('detail.results')}</h2>
                <dl className="mt-6 grid gap-6 sm:grid-cols-3">
                  {props.doc.results.map((result) => (
                    <div key={result.id ?? result.label} className="rounded-2xl border border-deep/10 bg-white p-6">
                      <dt className="text-deep/60 order-2 mt-2 text-sm">{result.label}</dt>
                      <dd className="font-display text-action text-4xl font-semibold">{result.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </>
        ) : (
          <div className="max-w-3xl">
            <Rich data={props.doc.body} />
          </div>
        )}

        {'url' in doc && doc.url && (
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-action inline-flex h-12 w-fit items-center rounded-full px-7 font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            {t('detail.visit')} ↗
          </a>
        )}
      </div>
    </article>
  )
}
