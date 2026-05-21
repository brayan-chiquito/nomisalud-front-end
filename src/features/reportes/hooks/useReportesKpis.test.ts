import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { renderHook, waitFor } from '@testing-library/react'
import { useReportesKpis } from './useReportesKpis'

vi.mock('../services/reportesKpis.service', () => ({
  fetchReportesKpis: vi.fn(),
}))

import { fetchReportesKpis } from '../services/reportesKpis.service'

const sample = {
  por_estado: [],
  por_urgencia: [],
  precision_ocr_promedio: 0.8,
  tasa_clasificacion_ia_correcta: 0.7,
  total_incapacidades: 10,
  generado_en: '2025-06-01T00:00:00Z',
}

describe('useReportesKpis', () => {
  beforeEach(() => {
    vi.mocked(fetchReportesKpis).mockReset()
    vi.mocked(fetchReportesKpis).mockResolvedValue(sample)
  })

  it('carga KPIs al montar', async () => {
    const { result } = renderHook(() => useReportesKpis())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data?.total_incapacidades).toBe(10)
    expect(result.current.error).toBeNull()
  })

  it('expone error 403', async () => {
    vi.mocked(fetchReportesKpis).mockRejectedValue(
      new axios.AxiosError('Forbidden', '403', undefined, undefined, {
        status: 403,
        data: {},
        statusText: 'Forbidden',
        headers: {},
        config: {} as never,
      }),
    )
    const { result } = renderHook(() => useReportesKpis())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toMatch(/permisos/i)
  })
})
