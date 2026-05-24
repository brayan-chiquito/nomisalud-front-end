import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AUDITORIA_PAGE_SIZE, listAuditoriaAccesos } from './listAuditoriaAccesos.service'

vi.mock('@/services/http', () => ({
  http: { get: vi.fn() },
}))

import { http } from '@/services/http'

describe('listAuditoriaAccesos', () => {
  beforeEach(() => {
    vi.mocked(http.get).mockReset()
  })

  it('consulta GET /auditoria/accesos con page_size 50', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: { items: [], total: 0, pages: 0, page: 1, page_size: 50 },
    })
    await listAuditoriaAccesos({ page: 2, user_id: 'uuid-1', accion: 'GET' })
    expect(http.get).toHaveBeenCalledWith('/auditoria/accesos', {
      params: {
        page: 2,
        page_size: AUDITORIA_PAGE_SIZE,
        user_id: 'uuid-1',
        accion: 'GET',
      },
      signal: undefined,
    })
  })
})
