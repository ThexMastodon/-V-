import type { Service } from '@/payload-types'

import { SectionHeading } from './SectionHeading'

export function WhatWeDo({ title, empty, services }: { title: string; empty: string; services: Service[] }) {
  return (
    <section id="what-we-do" className="section-light py-24 sm:py-32">
      <div className="container-aeva">
        <SectionHeading title={title} />
        {services.length === 0 ? (
          <p className="mt-10 text-deep/60">{empty}</p>
        ) : (
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-deep/10 bg-deep/10 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <li key={service.id} className="bg-clean p-8 transition-colors hover:bg-white">
                <h3 className="font-display text-xl font-semibold tracking-tight">{service.title}</h3>
                <p className="mt-3 text-deep/70">{service.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
