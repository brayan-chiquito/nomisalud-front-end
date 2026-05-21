import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useTranscritasCobroList } from './useTranscritasCobroList'
import { listIncapacidades } from '@/features/incapacidades/services/listIncapacidades.service'

vi.mock('@/features/incapacidades/services/listIncapacidades.service', () => ({
  listIncapacidades: vi.fn(),
}))

describe('useTranscritasCobroList', () => {
  beforeEach(() => {
    vi.mocked(listIncapacidades).mockReset()
    vi.mocked(listIncapacidades).mockResolvedValue({
      items: [],
      total: 0,
      pages: 0,
    })
  })

  it('carga con estado transcrita', async () => {
    const { result } = renderHook(() => useTranscritasCobroList())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(listIncapacidades).toHaveBeenCalledWith(
      expect.objectContaining({ estado: 'transcrita', page: 1 }),
    )
  })

  it('refetch incrementa versión y vuelve a cargar', async () => {
    const { result } = renderHook(() => useTranscritasCobroList())
    await waitFor(() => expect(result.current.loading).toBe(false))
    vi.mocked(listIncapacidades).mockClear()
    result.current.refetch()
    await waitFor(() => expect(listIncapacidades).toHaveBeenCalled())
  })
})
