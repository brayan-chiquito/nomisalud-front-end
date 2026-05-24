import { describe, it, expect } from 'vitest'
import { listSearchQueryVariants, normalizeListSearchTerm } from './listSearchQuery'

describe('listSearchQuery', () => {
  it('normaliza espacios', () => {
    expect(normalizeListSearchTerm('  eps  ')).toBe('eps')
  })

  it('devuelve una variante para texto sin arroba', () => {
    expect(listSearchQueryVariants('col')).toEqual(['col'])
  })

  it('añade parte local del correo como segunda variante', () => {
    expect(listSearchQueryVariants('colaborador@nomisalud.com')).toEqual([
      'colaborador@nomisalud.com',
      'colaborador',
    ])
  })

  it('no duplica si la parte local es muy corta', () => {
    expect(listSearchQueryVariants('a@b.com')).toEqual(['a@b.com'])
  })
})
