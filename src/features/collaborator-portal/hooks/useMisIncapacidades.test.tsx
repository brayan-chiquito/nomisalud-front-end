import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import axios, { AxiosError } from 'axios'
import { useMisIncapacidades } from './useMisIncapacidades'
import { listMisIncapacidades } from '../services/listMisIncapacidades.service'
import type { MisIncapacidadesResponse } from '../types/misIncapacidades'

vi.mock('../services/listMisIncapacidades.service', () => ({
  listMisIncapacidades: vi.fn(),
}))

const emptyList: MisIncapacidadesResponse = { items: [], total: 0, pages: 1 }

describe('useMisIncapacidades', () => {
  beforeEach(() => {
    vi.mocked(listMisIncapacidades).mockReset()
    vi.mocked(listMisIncapacidades).mockResolvedValue(emptyList)
  })

  it('carga datos iniciales', async () => {
    vi.mocked(listMisIncapacidades).mockResolvedValue({
      items: [
        {
          id: '1',
          radicado: 'IN-1',
          estado: 'recibida',
          updated_at: '2026-01-01T00:00:00.000Z',
        },
      ],
      total: 1,
      pages: 1,
    })

    const { result } = renderHook(() => useMisIncapacidades())

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data?.items).toHaveLength(1)
    expect(result.current.error).toBeNull()
    expect(listMisIncapacidades).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, signal: expect.any(AbortSignal) }),
    )
  })

  it('no consulta la API cuando enabled es false', async () => {
    const { result } = renderHook(() => useMisIncapacidades(false))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(listMisIncapacidades).not.toHaveBeenCalled()
    expect(result.current.data).toBeNull()
  })

  it('expone error cuando falla la petición', async () => {
    const err = new AxiosError('fallo')
    err.response = {
      data: { detail: 'Sin permiso' },
      status: 403,
      statusText: '',
      headers: {},
      config: {} as never,
    }
    vi.mocked(listMisIncapacidades).mockRejectedValue(err)

    const { result } = renderHook(() => useMisIncapacidades())

    await waitFor(() => expect(result.current.error).toBe('Sin permiso'))
    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('usa mensaje genérico para errores no axios', async () => {
    vi.mocked(listMisIncapacidades).mockRejectedValue(new Error('red caída'))

    const { result } = renderHook(() => useMisIncapacidades())

    await waitFor(() => expect(result.current.error).toBe('red caída'))
  })

  it('usa mensaje por defecto para errores desconocidos', async () => {
    vi.mocked(listMisIncapacidades).mockRejectedValue('timeout')

    const { result } = renderHook(() => useMisIncapacidades())

    await waitFor(() =>
      expect(result.current.error).toBe('No se pudieron cargar tus trámites. Intenta de nuevo.'),
    )
  })

  it('recarga al invocar reload', async () => {
    const { result } = renderHook(() => useMisIncapacidades())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(listMisIncapacidades).toHaveBeenCalledTimes(1)

    act(() => result.current.reload())

    await waitFor(() => expect(listMisIncapacidades).toHaveBeenCalledTimes(2))
  })

  it('vuelve a cargar al cambiar de página', async () => {
    const { result } = renderHook(() => useMisIncapacidades())

    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.setPage(2))

    await waitFor(() =>
      expect(listMisIncapacidades).toHaveBeenCalledWith(expect.objectContaining({ page: 2 })),
    )
  })

  it('ignora cancelación axios sin marcar error', async () => {
    vi.mocked(listMisIncapacidades).mockRejectedValue(new axios.CanceledError('aborted'))

    const { result } = renderHook(() => useMisIncapacidades())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBeNull()
  })
})
