import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
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

  it('reinicia página al cambiar userId', async () => {
    const { result } = renderHook(() => useAuditoriaAccesos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.setPage(2))
    await waitFor(() => expect(result.current.page).toBe(2))
    act(() => result.current.setUserId('uuid-filtro'))
    await waitFor(() => expect(result.current.page).toBe(1))
    expect(listAuditoriaAccesos).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1, user_id: 'uuid-filtro' }),
    )
  })

  it('expone error cuando falla la carga', async () => {
    vi.mocked(listAuditoriaAccesos).mockRejectedValue(
      new axios.AxiosError('fail', '500', undefined, undefined, {
        status: 500,
        data: { detail: 'Error servidor' },
        statusText: 'Error',
        headers: {},
        config: {} as never,
      }),
    )
    const { result } = renderHook(() => useAuditoriaAccesos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBeTruthy()
    expect(result.current.data).toBeNull()
  })

  it('envía fechas ISO en filtros de rango', async () => {
    const { result } = renderHook(() => useAuditoriaAccesos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.setFechaDesde('2026-05-01'))
    act(() => result.current.setFechaHasta('2026-05-31'))
    await waitFor(() =>
      expect(listAuditoriaAccesos).toHaveBeenLastCalledWith(
        expect.objectContaining({
          fecha_desde: expect.any(String),
          fecha_hasta: expect.any(String),
        }),
      ),
    )
  })
})
