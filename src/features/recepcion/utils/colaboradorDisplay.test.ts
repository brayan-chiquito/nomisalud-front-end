import { describe, it, expect } from 'vitest'
import { colaboradorDisplayLabel } from './colaboradorDisplay'

describe('colaboradorDisplayLabel', () => {
  it('usa nombre completo cuando está presente', () => {
    expect(
      colaboradorDisplayLabel({
        id: '1',
        nombre_completo: '  Ana Pérez  ',
        numero_documento: '1',
        email: 'ana@test.com',
      }),
    ).toBe('Ana Pérez')
  })

  it('usa email si el nombre está vacío', () => {
    expect(
      colaboradorDisplayLabel({
        id: '1',
        nombre_completo: '   ',
        numero_documento: '1',
        email: 'solo@email.com',
      }),
    ).toBe('solo@email.com')
  })
})
