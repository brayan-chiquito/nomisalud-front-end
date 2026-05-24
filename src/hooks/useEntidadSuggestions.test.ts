import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useEntidadSuggestions } from './useEntidadSuggestions'
import { fetchEntidadNombreSuggestions } from '@/features/incapacidades/services/entidadSuggestions.service'
import { useAuth } from '@/features/auth/context/AuthContext'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/features/incapacidades/services/entidadSuggestions.service', () => ({
  fetchEntidadNombreSuggestions: vi.fn(),
}))

const mockUseAuth = vi.mocked(useAuth)

describe('useEntidadSuggestions', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    vi.mocked(fetchEntidadNombreSuggestions).mockReset()
    vi.mocked(fetchEntidadNombreSuggestions).mockResolvedValue(['EPS Sura'])
  })

  it('no consulta con texto corto', async () => {
    const { result } = renderHook(() => useEntidadSuggestions('a', 0))
    await waitFor(() => expect(result.current.suggestions).toEqual([]))
    expect(fetchEntidadNombreSuggestions).not.toHaveBeenCalled()
  })

  it('carga sugerencias tras debounce', async () => {
    const { result } = renderHook(() => useEntidadSuggestions('sur', 0))
    act(() => undefined)
    await waitFor(() => expect(result.current.suggestions).toEqual(['EPS Sura']))
    expect(fetchEntidadNombreSuggestions).toHaveBeenCalledWith('sur', {
      signal: expect.any(AbortSignal),
      sources: 'all',
      listFilters: undefined,
    })
  })

  it('consulta solo pagos para rol contabilidad', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: '2', email: 'conta@test.com', role: 'contabilidad' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    const { result } = renderHook(() => useEntidadSuggestions('sis', 0))
    await waitFor(() => expect(result.current.suggestions).toEqual(['EPS Sura']))
    expect(fetchEntidadNombreSuggestions).toHaveBeenCalledWith('sis', {
      signal: expect.any(AbortSignal),
      sources: 'pagos',
      listFilters: undefined,
    })
  })

  it('limpia sugerencias si la petición falla', async () => {
    vi.mocked(fetchEntidadNombreSuggestions).mockRejectedValue(new Error('fail'))
    const { result } = renderHook(() => useEntidadSuggestions('sur', 0))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.suggestions).toEqual([])
  })
})
