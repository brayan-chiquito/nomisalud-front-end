import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listMisIncapacidades } from './listMisIncapacidades.service'

vi.mock('@/services/http', () => ({
  http: { get: vi.fn() },
}))

import { http } from '@/services/http'

describe('listMisIncapacidades', () => {
  beforeEach(() => {
    vi.mocked(http.get).mockReset()
  })

  it('solicita GET /incapacidades/mias con page por defecto', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { items: [], total: 0, pages: 1 },
    })
    await listMisIncapacidades()
    expect(http.get).toHaveBeenCalledWith('/incapacidades/mias', {
      params: { page: 1 },
      signal: undefined,
    })
  })

  it('respeta page y signal', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { items: [], total: 0, pages: 1 },
    })
    const ac = new AbortController()
    await listMisIncapacidades({ page: 2, signal: ac.signal })
    expect(http.get).toHaveBeenCalledWith('/incapacidades/mias', {
      params: { page: 2 },
      signal: ac.signal,
    })
  })
})
