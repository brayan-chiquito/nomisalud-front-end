import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getConciliacion, exportConciliacionExcel } from './conciliacion.service'
import { http } from '@/services/http'

vi.mock('@/services/http', () => ({
  http: {
    get: vi.fn(),
  },
}))

vi.mock('@/utils/downloadBlob', () => ({
  filenameFromContentDisposition: () => 'reporte.xlsx',
  triggerBrowserDownload: vi.fn(),
}))

describe('conciliacion.service', () => {
  beforeEach(() => {
    vi.mocked(http.get).mockReset()
  })

  it('getConciliacion consulta con mes, anio y entidad', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: {
        entidad: 'EPS',
        mes: 5,
        anio: 2024,
        total_cobrado: '100',
        total_pagado: '80',
        diferencia: '20',
        cantidad_cobrada_periodo: 1,
        cantidad_pendiente_pago: 0,
        pendientes: [],
        detalle: [],
      },
    })
    const res = await getConciliacion({ entidad: 'EPS', mes: 5, anio: 2024 })
    expect(res.entidad).toBe('EPS')
    expect(http.get).toHaveBeenCalledWith('/conciliacion', {
      params: { mes: 5, anio: 2024, entidad: 'EPS' },
      signal: undefined,
    })
  })

  it('exportConciliacionExcel descarga blob', async () => {
    vi.mocked(http.get).mockResolvedValue({
      data: new Blob(['x']),
      headers: { 'content-disposition': 'attachment; filename="a.xlsx"' },
    })
    const res = await exportConciliacionExcel({ mes: 5, anio: 2024, entidad: 'EPS' })
    expect(res.filename).toBe('reporte.xlsx')
    expect(http.get).toHaveBeenCalledWith('/conciliacion/exportar', {
      params: { mes: 5, anio: 2024, entidad: 'EPS' },
      responseType: 'blob',
      signal: undefined,
    })
  })
})
