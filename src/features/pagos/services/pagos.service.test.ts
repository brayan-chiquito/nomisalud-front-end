import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listPagos, createPago } from './pagos.service'

vi.mock('@/services/http', () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import { http } from '@/services/http'

describe('pagos.service', () => {
  beforeEach(() => {
    vi.mocked(http.get).mockReset()
    vi.mocked(http.post).mockReset()
  })

  it('listPagos GET /pagos con page por defecto', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { items: [], total: 0, pages: 0 },
    })
    await listPagos()
    expect(http.get).toHaveBeenCalledWith('/pagos', {
      params: { page: 1 },
      signal: undefined,
    })
  })

  it('listPagos incluye filtros', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { items: [], total: 0, pages: 0 },
    })
    const ac = new AbortController()
    await listPagos({
      page: 2,
      entidad: 'Nomi',
      estado: 'Registrado',
      fecha_desde: '2026-01-01',
      fecha_hasta: '2026-12-31',
      signal: ac.signal,
    })
    expect(http.get).toHaveBeenCalledWith('/pagos', {
      params: {
        page: 2,
        entidad: 'Nomi',
        estado: 'registrado',
        fecha_desde: '2026-01-01',
        fecha_hasta: '2026-12-31',
      },
      signal: ac.signal,
    })
  })

  it('createPago POST /pagos con cuerpo JSON', async () => {
    const creado = {
      id: 'p1',
      entidad_origen: 'NomiSalud',
      referencia: 'LOTE-1',
      monto: '1000',
      estado: 'registrado',
    }
    vi.mocked(http.post).mockResolvedValue({ data: creado })
    const res = await createPago({
      entidad_origen: 'NomiSalud',
      referencia: 'LOTE-1',
      monto: '1000',
      radicados: ['IN01'],
    })
    expect(http.post).toHaveBeenCalledWith(
      '/pagos',
      {
        entidad_origen: 'NomiSalud',
        referencia: 'LOTE-1',
        monto: '1000',
        radicados: ['IN01'],
      },
      { signal: undefined },
    )
    expect(res).toEqual(creado)
  })
})
