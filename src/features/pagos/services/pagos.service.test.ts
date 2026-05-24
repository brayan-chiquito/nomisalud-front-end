import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  listPagos,
  listPagosWithTextSearch,
  listRadicadosDisponibles,
  listRadicadosDisponiblesWithTextSearch,
  createPago,
} from './pagos.service'
import { RADICADOS_DISPONIBLES_API_PATH } from '@/features/auth/utils/financialModuleAccess'

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

  it('listPagos envía q cuando hay búsqueda libre', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { items: [], total: 0, pages: 0 },
    })
    await listPagos({ page: 2, q: 'LOTE-2026' })
    expect(http.get).toHaveBeenCalledWith('/pagos', {
      params: { page: 2, q: 'LOTE-2026' },
      signal: undefined,
    })
  })

  it('listPagos incluye filtros y entidad legacy', async () => {
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

  it('listPagosWithTextSearch reintenta variantes de correo', async () => {
    vi.mocked(http.get)
      .mockResolvedValueOnce({ data: { items: [], total: 0, pages: 0 } })
      .mockResolvedValueOnce({ data: { items: [{ id: 'p1' }], total: 1, pages: 1 } })
    const res = await listPagosWithTextSearch({ page: 1 }, 'user@nomisalud.com')
    expect(res.total).toBe(1)
    expect(http.get).toHaveBeenNthCalledWith(1, '/pagos', {
      params: { page: 1, q: 'user@nomisalud.com' },
      signal: undefined,
    })
    expect(http.get).toHaveBeenNthCalledWith(2, '/pagos', {
      params: { page: 1, q: 'user' },
      signal: undefined,
    })
  })

  it('listRadicadosDisponibles GET con q', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { items: [], total: 0, pages: 0, page: 1 },
    })
    await listRadicadosDisponibles({ page: 2, q: 'brayan' })
    expect(http.get).toHaveBeenCalledWith(RADICADOS_DISPONIBLES_API_PATH, {
      params: { page: 2, q: 'brayan' },
      signal: undefined,
    })
  })

  it('listRadicadosDisponiblesWithTextSearch usa q en API', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { items: [{ incapacidad_id: '1' }], total: 1, pages: 1 },
    })
    await listRadicadosDisponiblesWithTextSearch({ page: 1 }, 'SURA')
    expect(http.get).toHaveBeenCalledWith(RADICADOS_DISPONIBLES_API_PATH, {
      params: { page: 1, q: 'SURA' },
      signal: undefined,
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
