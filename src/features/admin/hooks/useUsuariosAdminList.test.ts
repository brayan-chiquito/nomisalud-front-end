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
})
