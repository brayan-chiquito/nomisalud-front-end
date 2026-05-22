import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useUsuariosAdminList } from './useUsuariosAdminList'

vi.mock('../services/usuariosAdmin.service', () => ({
  listUsuariosAdmin: vi.fn(),
}))

import { listUsuariosAdmin } from '../services/usuariosAdmin.service'

describe('useUsuariosAdminList', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.mocked(listUsuariosAdmin).mockReset()
    vi.mocked(listUsuariosAdmin).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      page_size: 20,
      pages: 0,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('aplica debounce al texto de búsqueda antes de llamar al API', async () => {
    const { result } = renderHook(() => useUsuariosAdminList())

    await act(async () => {
      await vi.runOnlyPendingTimersAsync()
    })
    vi.mocked(listUsuariosAdmin).mockClear()

    act(() => result.current.setSearch('brayan'))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(349)
    })
    expect(vi.mocked(listUsuariosAdmin).mock.calls.some((c) => c[0]?.q === 'brayan')).toBe(false)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2)
      await vi.runOnlyPendingTimersAsync()
    })
    expect(vi.mocked(listUsuariosAdmin).mock.calls.some((c) => c[0]?.q === 'brayan')).toBe(true)
  })

  it('expone error si falla la carga', async () => {
    vi.mocked(listUsuariosAdmin).mockRejectedValue(new Error('fallo'))
    const { result } = renderHook(() => useUsuariosAdminList())

    await act(async () => {
      await vi.runOnlyPendingTimersAsync()
    })
    expect(result.current.error).toBe('fallo')
    expect(result.current.data).toBeNull()
  })

  it('recarga al llamar reload', async () => {
    const { result } = renderHook(() => useUsuariosAdminList())
    await act(async () => {
      await vi.runOnlyPendingTimersAsync()
    })
    const callsBefore = vi.mocked(listUsuariosAdmin).mock.calls.length
    act(() => result.current.reload())
    await act(async () => {
      await vi.runOnlyPendingTimersAsync()
    })
    expect(vi.mocked(listUsuariosAdmin).mock.calls.length).toBeGreaterThan(callsBefore)
  })

  it('envía filtro activo false al API', async () => {
    const { result } = renderHook(() => useUsuariosAdminList())
    await act(async () => {
      await vi.runOnlyPendingTimersAsync()
    })
    vi.mocked(listUsuariosAdmin).mockClear()
    act(() => result.current.setActivoFilter('false'))
    await act(async () => {
      await vi.runOnlyPendingTimersAsync()
    })
    expect(vi.mocked(listUsuariosAdmin).mock.calls.some((c) => c[0]?.activo === false)).toBe(true)
  })
})
