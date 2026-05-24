import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useAuditoriaAccesos } from './useAuditoriaAccesos'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: '1', email: 'admin@test.com', role: 'admin' },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  })),
}))

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
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.mocked(listAuditoriaAccesos).mockReset()
    vi.mocked(listAuditoriaAccesos).mockResolvedValue(sampleResponse)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('carga registros al montar', async () => {
    const { result } = renderHook(() => useAuditoriaAccesos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data?.items).toHaveLength(1)
    expect(listAuditoriaAccesos).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, page_size: 50 }),
    )
  })

  it('reinicia página al cambiar filtro de acción debounced', async () => {
    const { result } = renderHook(() => useAuditoriaAccesos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.setPage(2))
    await waitFor(() => expect(result.current.page).toBe(2))
    act(() => result.current.setAccion('POST'))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })
    await waitFor(() => expect(result.current.page).toBe(1))
    expect(listAuditoriaAccesos).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1, accion: 'POST' }),
    )
  })

  it('envía q al API cuando filtra por correo o nombre', async () => {
    const { result } = renderHook(() => useAuditoriaAccesos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.setUsuario('admin@nomisalud.com'))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })
    await waitFor(() =>
      expect(listAuditoriaAccesos).toHaveBeenLastCalledWith(
        expect.objectContaining({ q: 'admin@nomisalud.com' }),
      ),
    )
    expect(listAuditoriaAccesos).toHaveBeenLastCalledWith(
      expect.not.objectContaining({ user_id: expect.anything() }),
    )
  })

  it('usa UUID directamente como user_id', async () => {
    const { result } = renderHook(() => useAuditoriaAccesos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.setUsuario('550e8400-e29b-41d4-a716-446655440000'))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })
    await waitFor(() =>
      expect(listAuditoriaAccesos).toHaveBeenLastCalledWith(
        expect.objectContaining({
          user_id: '550e8400-e29b-41d4-a716-446655440000',
        }),
      ),
    )
  })

  it('fija user_id al elegir usuario del autocompletado', async () => {
    const { result } = renderHook(() => useAuditoriaAccesos())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() =>
      result.current.selectUsuario({
        id: 'user-pinned',
        email: 'colaborador@nomisalud.com',
        label: 'Colaborador · colaborador@nomisalud.com',
      }),
    )
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })
    await waitFor(() =>
      expect(listAuditoriaAccesos).toHaveBeenLastCalledWith(
        expect.objectContaining({ user_id: 'user-pinned' }),
      ),
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
