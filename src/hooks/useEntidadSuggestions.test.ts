import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useEntidadSuggestions } from './useEntidadSuggestions'
import { fetchEntidadNombreSuggestions } from '@/features/incapacidades/services/entidadSuggestions.service'

vi.mock('@/features/incapacidades/services/entidadSuggestions.service', () => ({
  fetchEntidadNombreSuggestions: vi.fn(),
}))

describe('useEntidadSuggestions', () => {
  beforeEach(() => {
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
    expect(fetchEntidadNombreSuggestions).toHaveBeenCalledWith('sur', expect.any(AbortSignal))
  })

  it('limpia sugerencias si la petición falla', async () => {
    vi.mocked(fetchEntidadNombreSuggestions).mockRejectedValue(new Error('fail'))
    const { result } = renderHook(() => useEntidadSuggestions('sur', 0))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.suggestions).toEqual([])
  })
})
