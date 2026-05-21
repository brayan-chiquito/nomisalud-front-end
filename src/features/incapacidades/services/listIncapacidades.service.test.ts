import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildIncapacidadesFilterQuery, listIncapacidades } from './listIncapacidades.service'

vi.mock('@/services/http', () => ({
  http: {
    get: vi.fn(),
  },
}))

import { http } from '@/services/http'

describe('buildIncapacidadesFilterQuery', () => {
  it('omite parámetros vacíos', () => {
    expect(buildIncapacidadesFilterQuery({})).toEqual({})
    expect(buildIncapacidadesFilterQuery({ estado: '  ', tipo: '' })).toEqual({})
  })

  it('serializa filtros activos', () => {
    expect(
      buildIncapacidadesFilterQuery({
        estado: 'transcrita',
        entidad: 'SURA',
        urgencia: 'ROJO',
        pagoRetrasado: true,
      }),
    ).toEqual({
      estado: 'transcrita',
      entidad: 'SURA',
      urgencia: 'rojo',
      pago_retrasado: 'true',
    })
  })
})

describe('listIncapacidades', () => {
  beforeEach(() => {
    vi.mocked(http.get).mockReset()
  })

  it('solicita GET /incapacidades con page por defecto', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { items: [], total: 0, pages: 0 },
    })
    await listIncapacidades()
    expect(http.get).toHaveBeenCalledWith('/incapacidades', {
      params: { page: 1 },
      signal: undefined,
    })
  })

  it('incluye estado, tipo y entidad cuando vienen informados', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { items: [], total: 0, pages: 0 },
    })
    const ac = new AbortController()
    await listIncapacidades({
      page: 2,
      estado: 'transcrita',
      tipo: 'pdf',
      entidad: 'sura',
      signal: ac.signal,
    })
    expect(http.get).toHaveBeenCalledWith('/incapacidades', {
      params: { page: 2, estado: 'transcrita', tipo: 'pdf', entidad: 'sura' },
      signal: ac.signal,
    })
  })

  it('incluye urgencia en minúsculas cuando viene informada', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { items: [], total: 0, pages: 0 },
    })
    await listIncapacidades({ urgencia: 'ROJO' })
    expect(http.get).toHaveBeenCalledWith('/incapacidades', {
      params: { page: 1, urgencia: 'rojo' },
      signal: undefined,
    })
  })

  it('incluye pago_retrasado cuando el filtro está activo', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { items: [], total: 0, pages: 0 },
    })
    await listIncapacidades({ estado: 'cobrada', pagoRetrasado: true })
    expect(http.get).toHaveBeenCalledWith('/incapacidades', {
      params: { page: 1, estado: 'cobrada', pago_retrasado: 'true' },
      signal: undefined,
    })
  })

  it('recorta espacios en parámetros de texto', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { items: [], total: 0, pages: 0 },
    })
    await listIncapacidades({ estado: '  en_verificacion  ', entidad: ' eps ' })
    expect(http.get).toHaveBeenCalledWith('/incapacidades', {
      params: { page: 1, estado: 'en_verificacion', entidad: 'eps' },
      signal: undefined,
    })
  })
})
