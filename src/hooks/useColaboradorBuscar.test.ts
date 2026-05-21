import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useColaboradorBuscar } from './useColaboradorBuscar'

vi.mock('@/features/recepcion/services/buscarColaboradores.service', () => ({
  buscarColaboradores: vi.fn(),
}))

import { buscarColaboradores } from '@/features/recepcion/services/buscarColaboradores.service'

describe('useColaboradorBuscar', () => {
  beforeEach(() => {
    vi.mocked(buscarColaboradores).mockReset()
  })

  it('no consulta con menos de 2 caracteres tras el debounce', async () => {
    const { result } = renderHook(() => useColaboradorBuscar('a', 20))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(buscarColaboradores).not.toHaveBeenCalled()
    expect(result.current.items).toEqual([])
  })

  it('devuelve coincidencias tras debounce', async () => {
    vi.mocked(buscarColaboradores).mockResolvedValue([
      {
        id: '1',
        nombre_completo: 'Juan',
        numero_documento: '99',
        email: 'j@test.com',
      },
    ])
    const { result } = renderHook(() => useColaboradorBuscar('juan', 20))
    await waitFor(() => expect(result.current.items).toHaveLength(1))
    expect(buscarColaboradores).toHaveBeenCalledWith(
      expect.objectContaining({ q: 'juan', limit: 10 }),
    )
  })

  it('vacía resultados si la consulta falla', async () => {
    vi.mocked(buscarColaboradores).mockRejectedValue(new Error('falló'))
    const { result } = renderHook(() => useColaboradorBuscar('juan', 20))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.items).toEqual([])
  })
})
