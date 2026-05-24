import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  filterStringsMatchingSearch,
  incapacidadesSearchFilterParams,
  listIncapacidadesWithTextSearch,
  matchesIncapacidadListSearch,
  stripIncapacidadesSearchFilters,
} from './listIncapacidadSearch'
import { listIncapacidades } from '../services/listIncapacidades.service'

vi.mock('../services/listIncapacidades.service', () => ({
  listIncapacidades: vi.fn(),
}))
import type { IncapacidadListItem } from '../types/listIncapacidades'

const row = (overrides: Partial<IncapacidadListItem> = {}): IncapacidadListItem => ({
  id: '1',
  radicado: 'IN0001',
  estado: 'transcrita',
  colaborador_id: 'c1',
  archivo_tipo: 'pdf',
  fecha_recepcion: '2026-01-01T00:00:00.000Z',
  colaborador_email: 'colaborador@nomisalud.com',
  entidad_nombre: 'SISTEMA NACIONAL DE SALUD (SIMULADO)',
  ...overrides,
})

describe('listIncapacidadSearch', () => {
  it('matchesIncapacidadListSearch por entidad', () => {
    expect(matchesIncapacidadListSearch(row(), 'sistema')).toBe(true)
    expect(matchesIncapacidadListSearch(row(), 'SURA')).toBe(false)
  })

  it('matchesIncapacidadListSearch por radicado', () => {
    expect(matchesIncapacidadListSearch(row({ radicado: 'IN87894AA' }), '87894')).toBe(true)
  })

  it('matchesIncapacidadListSearch por nombre y correo de colaborador', () => {
    expect(
      matchesIncapacidadListSearch(
        row({ colaborador_nombre: 'brayan chiquito', colaborador_email: 'b@test.com' }),
        'brayan',
      ),
    ).toBe(true)
    expect(matchesIncapacidadListSearch(row(), 'colaborador@')).toBe(true)
  })

  it('incapacidadesSearchFilterParams envía solo q', () => {
    expect(incapacidadesSearchFilterParams('  brayan  ')).toEqual({ q: 'brayan' })
    expect(incapacidadesSearchFilterParams('')).toEqual({})
  })

  it('stripIncapacidadesSearchFilters elimina q y entidad', () => {
    expect(
      stripIncapacidadesSearchFilters({
        estado: 'transcrita',
        q: 'brayan',
        entidad: 'brayan',
      }),
    ).toEqual({ estado: 'transcrita' })
  })

  it('filterStringsMatchingSearch omite valores sin coincidencia', () => {
    expect(
      filterStringsMatchingSearch(
        ['colaborador@nomisalud.com', 'SISTEMA NACIONAL', 'IN0001'],
        'sistema',
      ),
    ).toEqual(['SISTEMA NACIONAL'])
  })
})

describe('listIncapacidadesWithTextSearch', () => {
  beforeEach(() => {
    vi.mocked(listIncapacidades).mockReset()
  })

  it('consulta el API con q y reintenta variantes de correo', async () => {
    const empty = { items: [], total: 0, pages: 0 }
    const hit = {
      items: [row({ colaborador_nombre: 'brayan chiquito' })],
      total: 1,
      pages: 1,
    }
    vi.mocked(listIncapacidades).mockResolvedValueOnce(empty).mockResolvedValueOnce(hit)

    const res = await listIncapacidadesWithTextSearch({ page: 1 }, 'brayan@test.com')
    expect(res.items).toHaveLength(1)
    expect(listIncapacidades).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ q: 'brayan@test.com' }),
    )
    expect(listIncapacidades).toHaveBeenNthCalledWith(2, expect.objectContaining({ q: 'brayan' }))
  })

  it('devuelve última respuesta si ninguna variante tiene filas', async () => {
    const empty = { items: [], total: 0, pages: 0 }
    vi.mocked(listIncapacidades).mockResolvedValue(empty)

    const res = await listIncapacidadesWithTextSearch(
      { page: 1, estado: 'transcrita' },
      'IN6C6EF070',
    )
    expect(res).toEqual(empty)
    expect(listIncapacidades).toHaveBeenLastCalledWith(
      expect.objectContaining({ q: 'IN6C6EF070', estado: 'transcrita' }),
    )
  })
})
