import { describe, it, expect } from 'vitest'
import { radicadoDisponibleSubtitle } from './radicadoDisponibleDisplay'

describe('radicadoDisponibleDisplay', () => {
  it('arma subtítulo con nombre, email y entidad', () => {
    expect(
      radicadoDisponibleSubtitle({
        incapacidad_id: '1',
        radicado: 'IN01',
        colaborador_nombre: 'Ana',
        colaborador_email: 'ana@test.com',
        entidad_nombre: 'EPS SURA',
      }),
    ).toBe('Ana · EPS SURA')
  })
})
