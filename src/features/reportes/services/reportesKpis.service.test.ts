import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchReportesKpis } from './reportesKpis.service'

vi.mock('@/services/http', () => ({
  http: { get: vi.fn() },
}))

import { http } from '@/services/http'

const sample: import('../types/reportesKpis').ReportesKpisResponse = {
  por_estado: [{ estado: 'transcrita', total: 12 }],
  por_urgencia: [{ urgencia: 'rojo', total: 3 }],
  precision_ocr_promedio: 0.82,
  tasa_clasificacion_ia_correcta: 0.71,
  total_incapacidades: 45,
  generado_en: '2025-06-01T15:30:00Z',
}

describe('reportesKpis.service', () => {
  beforeEach(() => {
    vi.mocked(http.get).mockReset()
  })

  it('fetchReportesKpis GET /reportes/kpis', async () => {
    vi.mocked(http.get).mockResolvedValue({ data: sample })
    const res = await fetchReportesKpis()
    expect(http.get).toHaveBeenCalledWith('/reportes/kpis', { signal: undefined })
    expect(res.total_incapacidades).toBe(45)
  })
})
