import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listPlazosEntidad } from './plazosEntidad.service'

vi.mock('@/services/http', () => ({
  http: { get: vi.fn() },
}))

import { http } from '@/services/http'

describe('listPlazosEntidad', () => {
  beforeEach(() => {
    vi.mocked(http.get).mockReset()
  })

  it('consulta GET /admin/plazos-entidad', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { items: [], total: 0 },
    })
    const data = await listPlazosEntidad()
    expect(data.total).toBe(0)
    expect(http.get).toHaveBeenCalledWith('/admin/plazos-entidad', { signal: undefined })
  })
})
