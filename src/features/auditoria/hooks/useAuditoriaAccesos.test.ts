import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useAuditoriaAccesos } from './useAuditoriaAccesos'

vi.mock('../services/listAuditoriaAccesos.service', () => ({
  AUDITORIA_PAGE_SIZE: 50,
  listAuditoriaAccesos: vi.fn(),
}))

import { listAuditoriaAccesos } from '../services/listAuditoriaAccesos.service'

const sampleResponse = {
  items: [
    {
      id: '1',
      user_id: 'u1',
      accion: 'GET /test',
      timestamp: '2026-05-21T10:00:00Z',
    },
  ],
  total: 1,
  pages: 1,
  page: 1,
  page_size: 50,
}

describe('useAuditoriaAccesos', () => {
  beforeEach(() => {
    vi.mocked(listAuditoriaAccesos).mockReset()
    vi.mocked(listAuditoriaAccesos).mockResolvedValue(sampleResponse)
  })

  it('carga registros al montar', async () => {
    const { result } = renderHook(() => useAuditoriaAccesos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data?.items).toHaveLength(1)
    expect(listAuditoriaAccesos).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, page_size: 50 }),
    )
  })

  it('reinicia página al cambiar filtro de acción', async () => {
    const { result } = renderHook(() => useAuditoriaAccesos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.setPage(2))
    await waitFor(() => expect(result.current.page).toBe(2))
    act(() => result.current.setAccion('POST'))
    await waitFor(() => expect(result.current.page).toBe(1))
    expect(listAuditoriaAccesos).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1, accion: 'POST' }),
    )
  })
})
