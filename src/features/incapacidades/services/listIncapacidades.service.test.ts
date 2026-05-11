import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listIncapacidades } from './listIncapacidades.service'

vi.mock('@/services/http', () => ({
  http: {
    get: vi.fn(),
  },
}))

import { http } from '@/services/http'

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
