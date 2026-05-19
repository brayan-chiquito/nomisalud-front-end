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
    validaciones: [{ nivel: 'warning', tipo: 'Fechas', mensaje: 'Revisar rango' }],
  },
  inconsistencias: [{ tipo: 'fechas', descripcion: 'Revisar rango' }],
  estado: 'inconsistencia_detectada',
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
    vi.mocked(getIncapacidadDetalle).mockResolvedValue({
      ...detalleBase,
      estado: 'en_verificacion',
      inconsistencias: [],
      extraccion_ia: {
        ...detalleBase.extraccion_ia,
        validaciones: [],
      },
    })
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

  it('expone inconsistencias desde inconsistencias[] del detalle', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue(detalleBase)
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(new Blob(['x']))

    const { result } = renderHook(() => useIncapacidadAiReview('u1'))
    await waitFor(() => expect(result.current.loadingDetail).toBe(false))

    expect(result.current.inconsistencias).toEqual([
      { tipo: 'fechas', descripcion: 'Revisar rango' },
    ])
  })

  it('registrarOverride hace PATCH a en_verificacion con observación', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue(detalleBase)
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(new Blob(['x']))
    vi.mocked(patchIncapacidadEstado).mockResolvedValue({
      id: 'u1',
      radicado: 'IN01',
      estado: 'en_verificacion',
      estado_anterior: 'inconsistencia_detectada',
    })

    const { result } = renderHook(() => useIncapacidadAiReview('u1'))
    await waitFor(() => expect(result.current.loadingDetail).toBe(false))

    act(() => result.current.setOverrideJustificacion('Aprobado con excepción documentada'))
    const ok = await act(async () => result.current.registrarOverride())
    expect(ok).toBe(true)
    expect(patchIncapacidadEstado).toHaveBeenCalledWith('u1', {
      estado: 'en_verificacion',
      observacion: 'Aprobado con excepción documentada',
    })
    expect(result.current.overrideRegistrado).toBe(true)
    expect(result.current.detail?.estado).toBe('en_verificacion')
  })

  it('sin incapacidadId no consulta el detalle', () => {
    renderHook(() => useIncapacidadAiReview(null))
    expect(getIncapacidadDetalle).not.toHaveBeenCalled()
  })

  it('no descarga archivo si el tipo no es visualizable', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue({
      ...detalleBase,
      archivo_tipo: 'docx',
    })
    renderHook(() => useIncapacidadAiReview('u1'))
    await waitFor(() => expect(vi.mocked(getIncapacidadDetalle)).toHaveBeenCalled())
    expect(fetchIncapacidadArchivoBlob).not.toHaveBeenCalled()
  })

  it('registrarOverride exige justificación mínima', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue(detalleBase)
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(new Blob(['x']))

    const { result } = renderHook(() => useIncapacidadAiReview('u1'))
    await waitFor(() => expect(result.current.loadingDetail).toBe(false))

    act(() => result.current.setOverrideJustificacion('corta'))
    const ok = await act(async () => result.current.registrarOverride())
    expect(ok).toBe(false)
    expect(result.current.overrideError).toMatch(/10 caracteres/i)
    expect(patchIncapacidadEstado).not.toHaveBeenCalled()
  })

  it('registrarOverride rechaza si el estado no es inconsistencia_detectada', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue({
      ...detalleBase,
      estado: 'en_verificacion',
    })
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(new Blob(['x']))

    const { result } = renderHook(() => useIncapacidadAiReview('u1'))
    await waitFor(() => expect(result.current.loadingDetail).toBe(false))

    act(() => result.current.setOverrideJustificacion('Justificación válida de prueba'))
    const ok = await act(async () => result.current.registrarOverride())
    expect(ok).toBe(false)
    expect(result.current.overrideError).toMatch(/inconsistencia detectada/i)
  })

  it('registrarOverride propaga error HTTP', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue(detalleBase)
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(new Blob(['x']))
    vi.mocked(patchIncapacidadEstado).mockRejectedValue(new Error('fallo red'))

    const { result } = renderHook(() => useIncapacidadAiReview('u1'))
    await waitFor(() => expect(result.current.loadingDetail).toBe(false))

    act(() => result.current.setOverrideJustificacion('Justificación válida de prueba'))
    const ok = await act(async () => result.current.registrarOverride())
    expect(ok).toBe(false)
    expect(result.current.overrideError).toBe('fallo red')
  })

  it('confirmar no hace PATCH extra si verificar ya dejó transcrita', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue({
      ...detalleBase,
      estado: 'en_verificacion',
      inconsistencias: [],
      extraccion_ia: {
        ...detalleBase.extraccion_ia,
        validaciones: [],
      },
    })
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(new Blob(['x']))
    vi.mocked(verificarIncapacidad).mockResolvedValue({
      id: 'u1',
      radicado: 'IN01',
      estado: 'transcrita',
    })

    const { result } = renderHook(() => useIncapacidadAiReview('u1'))
    await waitFor(() => expect(result.current.loadingDetail).toBe(false))

    const ok = await act(async () => result.current.confirmar())
    expect(ok).toBe(true)
    expect(patchIncapacidadEstado).not.toHaveBeenCalled()
  })

  it('rechazar exige motivo no vacío', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue(detalleBase)
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(new Blob(['x']))

    const { result } = renderHook(() => useIncapacidadAiReview('u1'))
    await waitFor(() => expect(result.current.loadingDetail).toBe(false))

    const ok = await act(async () => result.current.rechazar('   '))
    expect(ok).toBe(false)
    expect(result.current.submitError).toMatch(/motivo/i)
  })

  it('solicitarDocumentacion exige al menos un documento', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue(detalleBase)
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(new Blob(['x']))

    const { result } = renderHook(() => useIncapacidadAiReview('u1'))
    await waitFor(() => expect(result.current.loadingDetail).toBe(false))

    const ok = await act(async () => result.current.solicitarDocumentacion(['  ']))
    expect(ok).toBe(false)
    expect(result.current.submitError).toMatch(/documento faltante/i)
  })

  it('confirmar sin extracción IA devuelve error', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue({
      ...detalleBase,
      estado: 'en_verificacion',
      inconsistencias: [],
      extraccion_ia: null,
    })
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(new Blob(['x']))

    const { result } = renderHook(() => useIncapacidadAiReview('u1'))
    await waitFor(() => expect(result.current.loadingDetail).toBe(false))

    const ok = await act(async () => result.current.confirmar())
    expect(ok).toBe(false)
    expect(result.current.submitError).toMatch(/extracción/i)
  })

  it('confirmar propaga error HTTP', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue({
      ...detalleBase,
      estado: 'en_verificacion',
      inconsistencias: [],
    })
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(new Blob(['x']))
    vi.mocked(verificarIncapacidad).mockRejectedValue(new Error('timeout'))

    const { result } = renderHook(() => useIncapacidadAiReview('u1'))
    await waitFor(() => expect(result.current.loadingDetail).toBe(false))

    const ok = await act(async () => result.current.confirmar())
    expect(ok).toBe(false)
    expect(result.current.submitError).toBe('timeout')
  })

  it('solicitarDocumentacion propaga error HTTP', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue(detalleBase)
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(new Blob(['x']))
    vi.mocked(registrarDocumentacionFaltante).mockRejectedValue(new Error('conflicto'))

    const { result } = renderHook(() => useIncapacidadAiReview('u1'))
    await waitFor(() => expect(result.current.loadingDetail).toBe(false))

    const ok = await act(async () => result.current.solicitarDocumentacion(['Doc'], 'obs'))
    expect(ok).toBe(false)
    expect(result.current.submitError).toBe('conflicto')
  })

  it('confirmar bloquea si hay inconsistencias sin override', async () => {
    vi.mocked(getIncapacidadDetalle).mockResolvedValue(detalleBase)
    vi.mocked(fetchIncapacidadArchivoBlob).mockResolvedValue(new Blob(['x']))

    const { result } = renderHook(() => useIncapacidadAiReview('u1'))
    await waitFor(() => expect(result.current.loadingDetail).toBe(false))

    const ok = await act(async () => result.current.confirmar())
    expect(ok).toBe(false)
    expect(verificarIncapacidad).not.toHaveBeenCalled()
  })
})
