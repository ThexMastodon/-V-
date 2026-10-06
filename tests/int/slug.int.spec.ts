import { describe, expect, it } from 'vitest'

import { slugify } from '@/fields/slug'

describe('slugify', () => {
  it('quita acentos, mayúsculas y signos', () => {
    expect(slugify('  Agentes de IA: ¡Versión 2!  ')).toBe('agentes-de-ia-version-2')
  })

  it('no deja guiones al inicio ni al final', () => {
    expect(slugify('--ÆVΛ Labs--')).toBe('v-labs')
  })
})
