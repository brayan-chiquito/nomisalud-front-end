import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useExportIncapacidades } from './useExportIncapacidades'

vi.mock('../services/exportIncapacidades.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/exportIncapacidades.service')>()
  return {
    ...actual,
    exportIncapacidadesXlsx: vi.fn(),
  }
})

import { exportIncapacidadesXlsx } from '../services/exportIncapacidades.service'

describe('useExportIncapacidades', () => {
  beforeEach(() => {
    vi.mocked(exportIncapacidadesXlsx).mockReset()
    vi.mocked(exportIncapacidadesXlsx).mockResolvedValue({ filename: 'incapacidades.xlsx' })
  })

  it('exporta con filtros del getter', async () => {
    const getFilters = vi.fn(() => ({ estado: 'cobrada', urgencia: 'rojo' }))
    const { result } = renderHook(() => useExportIncapacidades(getFilters))

    await act(async () => {
      await result.current.exportar()
    })

    expect(exportIncapacidadesXlsx).toHaveBeenCalledWith({ estado: 'cobrada', urgencia: 'rojo' })
    await waitFor(() => expect(result.current.exporting).toBe(false))
    expect(result.current.exportError).toBeNull()
  })

  it('guarda error si falla la exportación', async () => {
    vi.mocked(exportIncapacidadesXlsx).mockRejectedValue(
      new axios.AxiosError('fail', '500', undefined, undefined, {
        status: 500,
        data: { detail: 'Error servidor' },
        statusText: 'Error',
        headers: {},
        config: {} as never,
      }),
    )
    const { result } = renderHook(() => useExportIncapacidades(() => ({})))

    await act(async () => {
      await result.current.exportar()
    })

    expect(result.current.exportError).toBe('Error servidor')
  })
})
