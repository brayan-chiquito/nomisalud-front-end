import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  matchesRadicadoDisponibleSearch,
  listRadicadosDisponiblesWithEntidadSearch,
} from './radicadosDisponiblesSearch'
import { listRadicadosDisponiblesWithTextSearch } from '../services/pagos.service'

vi.mock('../services/pagos.service', () => ({
  listRadicadosDisponibles: vi.fn(),
  listRadicadosDisponiblesWithTextSearch: vi.fn(),
}))

describe('radicadosDisponiblesSearch', () => {
  beforeEach(() => {
    vi.mocked(listRadicadosDisponiblesWithTextSearch).mockReset()
  })

  it('matchesRadicadoDisponibleSearch filtra por entidad y radicado', () => {
    const row = {
      incapacidad_id: '1',
      radicado: 'IN01',
      entidad_nombre: 'EPS SURA',
      colaborador_email: 'a@test.com',
    }
    expect(matchesRadicadoDisponibleSearch(row, 'sura')).toBe(true)
    expect(matchesRadicadoDisponibleSearch(row, 'IN01')).toBe(true)
    expect(matchesRadicadoDisponibleSearch(row, 'otro')).toBe(false)
  })

  it('listRadicadosDisponiblesWithEntidadSearch delega a listRadicadosDisponiblesWithTextSearch', async () => {
    const res = {
      items: [{ incapacidad_id: '1', radicado: 'IN01', entidad_nombre: 'EPS SURA' }],
      total: 1,
      pages: 1,
    }
    vi.mocked(listRadicadosDisponiblesWithTextSearch).mockResolvedValue(res)

    const out = await listRadicadosDisponiblesWithEntidadSearch({ entidad: 'SURA', page: 2 })
    expect(out).toEqual(res)
    expect(listRadicadosDisponiblesWithTextSearch).toHaveBeenCalledWith(
      { page: 2, signal: undefined },
      'SURA',
    )
  })
})
