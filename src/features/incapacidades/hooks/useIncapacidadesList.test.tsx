import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import axios, { AxiosError } from 'axios'
import { useIncapacidadesList } from './useIncapacidadesList'
import { listIncapacidades } from '../services/listIncapacidades.service'

vi.mock('../services/listIncapacidades.service', () => ({
  listIncapacidades: vi.fn(),
}))

const emptyList = { items: [] as const, total: 0, pages: 0 }

describe('useIncapacidadesList', () => {
  beforeEach(() => {
    vi.mocked(listIncapacidades).mockReset()
    vi.mocked(listIncapacidades).mockResolvedValue(emptyList)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('carga datos iniciales y expone estado sin error', async () => {
    vi.mocked(listIncapacidades).mockResolvedValue({
      items: [
        {
          id: '1',
          radicado: 'R1',
          estado: 'recibida',
          colaborador_id: 'c1',
          archivo_tipo: 'pdf',
          fecha_recepcion: '2026-01-01T00:00:00.000Z',
        },
      ],
      total: 1,
      pages: 1,
    })
    const { result } = renderHook(() => useIncapacidadesList())

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBeNull()
    expect(result.current.data?.total).toBe(1)
    expect(listIncapacidades).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, signal: expect.any(AbortSignal) }),
    )
  })

  it('envía filtros estado, tipo y entidad al servicio', async () => {
    const { result } = renderHook(() => useIncapacidadesList(0))

    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.setEstado('recibida')
      result.current.setTipo('pdf')
      result.current.setEntidadInput('EPS')
    })

    await waitFor(() =>
      expect(listIncapacidades).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          estado: 'recibida',
          tipo: 'pdf',
          entidad: 'EPS',
        }),
      ),
    )
  })

  it('resetea la página a 1 cuando cambia la entidad debounced', async () => {
    vi.mocked(listIncapacidades).mockResolvedValue({
      items: [
        {
          id: '1',
          radicado: 'R1',
          estado: 'recibida',
          colaborador_id: 'c1',
          archivo_tipo: 'pdf',
          fecha_recepcion: '2026-01-01T00:00:00.000Z',
        },
      ],
      total: 20,
      pages: 2,
    })

    const { result } = renderHook(() => useIncapacidadesList(0))

    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.setPage(2)
    })
    await waitFor(() => expect(result.current.page).toBe(2))

    act(() => {
      result.current.setEntidadInput('Sura')
    })

    await waitFor(() => {
      expect(result.current.page).toBe(1)
      expect(listIncapacidades).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, entidad: 'Sura' }),
      )
    })
  })

  it('setEstado y setTipo vuelven a la página 1', async () => {
    vi.mocked(listIncapacidades).mockResolvedValue({
      items: [
        {
          id: '1',
          radicado: 'R1',
          estado: 'recibida',
          colaborador_id: 'c1',
          archivo_tipo: 'pdf',
          fecha_recepcion: '2026-01-01T00:00:00.000Z',
        },
      ],
      total: 20,
      pages: 2,
    })
    const { result } = renderHook(() => useIncapacidadesList())

    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => {
      result.current.setPage(2)
    })
    await waitFor(() => expect(result.current.page).toBe(2))

    act(() => {
      result.current.setEstado('transcrita')
    })
    await waitFor(() => expect(result.current.page).toBe(1))

    act(() => {
      result.current.setPage(2)
    })
    await waitFor(() => expect(result.current.page).toBe(2))

    act(() => {
      result.current.setTipo('png')
    })
    await waitFor(() => expect(result.current.page).toBe(1))
  })

  it('expone mensaje detail de Axios cuando viene como string', async () => {
    const err = new AxiosError('request failed')
    err.response = { status: 400, data: { detail: 'Listado no disponible' } } as never
    vi.mocked(listIncapacidades).mockRejectedValueOnce(err)

    const { result } = renderHook(() => useIncapacidadesList())

    await waitFor(() => {
      expect(result.current.error).toBe('Listado no disponible')
      expect(result.current.data).toBeNull()
      expect(result.current.loading).toBe(false)
    })
  })

  it('usa message de Axios si detail no es string', async () => {
    const err = new AxiosError('fallo de red')
    err.response = { status: 500, data: { detail: { code: 1 } } } as never
    vi.mocked(listIncapacidades).mockRejectedValueOnce(err)

    const { result } = renderHook(() => useIncapacidadesList())

    await waitFor(() => expect(result.current.error).toBe('fallo de red'))
  })

  it('usa message de Error genérico', async () => {
    vi.mocked(listIncapacidades).mockRejectedValueOnce(new Error('sin permiso'))

    const { result } = renderHook(() => useIncapacidadesList())

    await waitFor(() => expect(result.current.error).toBe('sin permiso'))
  })

  it('usa mensaje por defecto para errores desconocidos', async () => {
    vi.mocked(listIncapacidades).mockRejectedValueOnce('x')

    const { result } = renderHook(() => useIncapacidadesList())

    await waitFor(() =>
      expect(result.current.error).toBe('No se pudo cargar el listado. Intenta de nuevo.'),
    )
  })

  it('no actualiza error si axios marca cancelación', async () => {
    const cancelErr = new Error('canceled')
    const isCancelSpy = vi.spyOn(axios, 'isCancel').mockReturnValueOnce(true)
    vi.mocked(listIncapacidades).mockRejectedValueOnce(cancelErr)

    try {
      const { result } = renderHook(() => useIncapacidadesList())

      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.error).toBeNull()
    } finally {
      isCancelSpy.mockRestore()
    }
  })

  it('no aplica resultado si el request fue abortado (desmontaje)', async () => {
    let resolveLoad!: (v: typeof emptyList) => void
    const deferred = new Promise<typeof emptyList>((r) => {
      resolveLoad = r
    })
    vi.mocked(listIncapacidades).mockReturnValueOnce(deferred)

    const { result, unmount } = renderHook(() => useIncapacidadesList())

    await waitFor(() => expect(result.current.loading).toBe(true))
    unmount()
    resolveLoad({ items: [], total: 99, pages: 1 })

    await act(async () => {
      await Promise.resolve()
    })
  })
})
