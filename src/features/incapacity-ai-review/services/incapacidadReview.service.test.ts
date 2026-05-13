import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getIncapacidadDetalle,
  fetchIncapacidadArchivoBlob,
  verificarIncapacidad,
} from './incapacidadReview.service'

vi.mock('@/services/http', () => ({
  http: {
    get: vi.fn(),
    put: vi.fn(),
  },
}))

import { http } from '@/services/http'

describe('incapacidadReview.service', () => {
  beforeEach(() => {
    vi.mocked(http.get).mockReset()
    vi.mocked(http.put).mockReset()
  })

  it('getIncapacidadDetalle solicita GET /incapacidades/:id', async () => {
    const detalle = {
      id: 'u1',
      radicado: 'IN1',
      estado: 'en_verificacion',
      archivo_tipo: 'pdf',
      extraccion_ia: { datos_extraidos: {} },
    }
    vi.mocked(http.get).mockResolvedValueOnce({ data: detalle })
    const ac = new AbortController()
    await expect(getIncapacidadDetalle('u1', ac.signal)).resolves.toEqual(detalle)
    expect(http.get).toHaveBeenCalledWith('/incapacidades/u1', { signal: ac.signal })
  })

  it('fetchIncapacidadArchivoBlob usa responseType blob', async () => {
    const blob = new Blob(['x'], { type: 'application/pdf' })
    vi.mocked(http.get).mockResolvedValueOnce({ data: blob })
    await expect(fetchIncapacidadArchivoBlob('u1')).resolves.toBe(blob)
    expect(http.get).toHaveBeenCalledWith('/incapacidades/u1/archivo', {
      responseType: 'blob',
      signal: undefined,
    })
  })

  it('verificarIncapacidad envía PUT con cuerpo', async () => {
    vi.mocked(http.put).mockResolvedValueOnce({
      data: { id: 'u1', radicado: 'IN1', estado: 'en_verificacion' },
    })
    const res = await verificarIncapacidad('u1', {
      accion: 'confirmar',
      datos_extraidos: { colaborador: { nombre_completo: 'Ana' } },
    })
    expect(res.estado).toBe('en_verificacion')
    expect(http.put).toHaveBeenCalledWith(
      '/incapacidades/u1/verificar',
      {
        accion: 'confirmar',
        datos_extraidos: { colaborador: { nombre_completo: 'Ana' } },
      },
      { signal: undefined },
    )
  })
})
