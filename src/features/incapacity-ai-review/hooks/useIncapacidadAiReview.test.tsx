import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useIncapacidadAiReview } from './useIncapacidadAiReview'
import {
  getIncapacidadDetalle,
  fetchIncapacidadArchivoBlob,
  patchIncapacidadEstado,
  registrarDocumentacionFaltante,
  verificarIncapacidad,
} from '../services/incapacidadReview.service'

vi.mock('../services/incapacidadReview.service', () => ({
  getIncapacidadDetalle: vi.fn(),
  fetchIncapacidadArchivoBlob: vi.fn(),
  patchIncapacidadEstado: vi.fn(),
  registrarDocumentacionFaltante: vi.fn(),
  verificarIncapacidad: vi.fn(),
}))

const detalleBase = {
  id: 'u1',
  radicado: 'IN01',
  estado: 'en_verificacion',
  archivo_tipo: 'pdf',
  extraccion_ia: {
    datos_extraidos: {
      colaborador: { nombre_completo: 'Ana López' },
      incapacidad: { tipo: 'eg' },
    },
  },
}

describe('useIncapacidadAiReview', () => {
  beforeEach(() => {
    vi.mocked(getIncapacidadDetalle).mockReset()
    vi.mocked(fetchIncapacidadArchivoBlob).mockReset()
    vi.mocked(verificarIncapacidad).mockReset()
    vi.mocked(patchIncapacidadEstado).mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('carga detalle y rellena el formulario desde datos_extraidos', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue(detalleBase)
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(
      new Blob(['%PDF'], { type: 'application/pdf' }),
    )

    const { result } = renderHook(() => useIncapacidadAiReview('u1'))

    await waitFor(() => expect(result.current.loadingDetail).toBe(false))
    expect(result.current.detail?.radicado).toBe('IN01')
    expect(result.current.form.nombreColaborador).toBe('Ana López')
    expect(result.current.form.tipoIncapacidad).toBe('eg')
    await waitFor(() => expect(result.current.archivoObjectUrl).not.toBeNull())
  })

  it('confirmar envía datos_extraidos fusionados', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue(detalleBase)
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(new Blob(['x']))
    vi.mocked(verificarIncapacidad).mockResolvedValue({
      id: 'u1',
      radicado: 'IN01',
      estado: 'en_verificacion',
    })
    vi.mocked(patchIncapacidadEstado).mockResolvedValue({
      id: 'u1',
      radicado: 'IN01',
      estado: 'transcrita',
      estado_anterior: 'en_verificacion',
    })

    const { result } = renderHook(() => useIncapacidadAiReview('u1'))
    await waitFor(() => expect(result.current.loadingDetail).toBe(false))

    act(() => {
      result.current.setFormField('entidadNombre', 'EPS Test')
    })

    const ok = await act(async () => result.current.confirmar())
    expect(ok).toBe(true)
    expect(verificarIncapacidad).toHaveBeenCalledWith(
      'u1',
      expect.objectContaining({
        accion: 'confirmar',
        datos_extraidos: expect.objectContaining({
          entidad: expect.objectContaining({ nombre: 'EPS Test' }),
        }),
      }),
    )
    expect(patchIncapacidadEstado).toHaveBeenCalledWith('u1', {
      estado: 'transcrita',
      observacion: 'Datos confirmados en revisión IA',
    })
  })

  it('rechazar envía motivo_rechazo', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue(detalleBase)
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(new Blob(['x']))
    vi.mocked(verificarIncapacidad).mockResolvedValue({
      id: 'u1',
      radicado: 'IN01',
      estado: 'rechazada',
    })

    const { result } = renderHook(() => useIncapacidadAiReview('u1'))
    await waitFor(() => expect(result.current.loadingDetail).toBe(false))

    const ok = await act(async () => result.current.rechazar('No coincide el documento'))
    expect(ok).toBe(true)
    expect(verificarIncapacidad).toHaveBeenCalledWith('u1', {
      accion: 'rechazar',
      motivo_rechazo: 'No coincide el documento',
    })
  })

  it('solicitarDocumentacion envía PUT documentacion-faltante', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue(detalleBase)
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(new Blob(['x']))
    vi.mocked(registrarDocumentacionFaltante).mockResolvedValue({
      id: 'u1',
      radicado: 'IN01',
      estado: 'doc_incompleta',
      estado_anterior: 'en_verificacion',
      documentacion_faltante: ['Historia clínica'],
    })

    const { result } = renderHook(() => useIncapacidadAiReview('u1'))
    await waitFor(() => expect(result.current.loadingDetail).toBe(false))

    const ok = await act(async () =>
      result.current.solicitarDocumentacion(['Historia clínica'], 'Pendiente'),
    )
    expect(ok).toBe(true)
    expect(registrarDocumentacionFaltante).toHaveBeenCalledWith('u1', {
      documentos: ['Historia clínica'],
      observacion: 'Pendiente',
    })
  })
})
