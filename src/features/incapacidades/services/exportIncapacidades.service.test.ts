import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import {
  exportIncapacidadesXlsx,
  detailFromExportError,
  INCAPACIDADES_EXPORT_DEFAULT_FILENAME,
} from './exportIncapacidades.service'

vi.mock('@/services/http', () => ({
  http: { get: vi.fn() },
}))

vi.mock('@/utils/downloadBlob', () => ({
  filenameFromContentDisposition: vi.fn(() => 'export.xlsx'),
  triggerBrowserDownload: vi.fn(),
}))

import { http } from '@/services/http'
import { triggerBrowserDownload } from '@/utils/downloadBlob'

describe('exportIncapacidades.service', () => {
  beforeEach(() => {
    vi.mocked(http.get).mockReset()
    vi.mocked(triggerBrowserDownload).mockReset()
  })

  it('GET /incapacidades/exportar con filtros y descarga blob', async () => {
    const blob = new Blob(['xlsx'])
    vi.mocked(http.get).mockResolvedValue({
      data: blob,
      headers: { 'content-disposition': 'attachment; filename="incapacidades.xlsx"' },
    })
    const res = await exportIncapacidadesXlsx({
      estado: 'transcrita',
      urgencia: 'rojo',
      pagoRetrasado: true,
    })
    expect(http.get).toHaveBeenCalledWith('/incapacidades/exportar', {
      params: { estado: 'transcrita', urgencia: 'rojo', pago_retrasado: 'true' },
      responseType: 'blob',
      signal: undefined,
    })
    expect(triggerBrowserDownload).toHaveBeenCalledWith(blob, 'export.xlsx')
    expect(res.filename).toBe('export.xlsx')
  })

  it('usa nombre por defecto sin Content-Disposition', async () => {
    const { filenameFromContentDisposition } = await import('@/utils/downloadBlob')
    vi.mocked(filenameFromContentDisposition).mockReturnValueOnce(null)
    vi.mocked(http.get).mockResolvedValue({ data: new Blob([]), headers: {} })
    const res = await exportIncapacidadesXlsx()
    expect(res.filename).toBe(INCAPACIDADES_EXPORT_DEFAULT_FILENAME)
  })

  it('extrae detail de error JSON en blob', async () => {
    const err = new axios.AxiosError('Too large', '413', undefined, undefined, {
      status: 413,
      data: new Blob([JSON.stringify({ detail: 'Máximo 10000 filas' })], {
        type: 'application/json',
      }),
      statusText: 'Payload Too Large',
      headers: {},
      config: {} as never,
    })
    const detail = await detailFromExportError(err)
    expect(detail).toBe('Máximo 10000 filas')
  })
})
