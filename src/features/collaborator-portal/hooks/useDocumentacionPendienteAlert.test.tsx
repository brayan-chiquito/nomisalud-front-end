import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDocumentacionPendienteAlert } from './useDocumentacionPendienteAlert'
import type { IncapacidadDetalle } from '@/features/incapacity-ai-review/types/incapacidadDetalle'

const mockGetDetalle = vi.fn()

vi.mock('@/features/incapacity-ai-review/services/incapacidadReview.service', () => ({
  getIncapacidadDetalle: (...args: unknown[]) => mockGetDetalle(...args),
}))

const detalleDoc: IncapacidadDetalle = {
  id: 't-doc',
  radicado: 'IN-DOC',
  estado: 'doc_incompleta',
  archivo_tipo: 'pdf',
  documentacion_faltante: ['Certificado'],
  dias_habiles_restantes: 4,
  extraccion_ia: null,
}

describe('useDocumentacionPendienteAlert', () => {
  beforeEach(() => {
    mockGetDetalle.mockReset()
  })

  it('usa el detalle en pantalla cuando aplica', () => {
    const { result } = renderHook(() => useDocumentacionPendienteAlert(detalleDoc, [], true))
    expect(result.current.data?.documentos).toEqual(['Certificado'])
    expect(result.current.data?.diasHabilesRestantes).toBe(4)
    expect(mockGetDetalle).not.toHaveBeenCalled()
  })

  it('carga detalle del primer trámite doc_incompleta del listado', async () => {
    mockGetDetalle.mockResolvedValue(detalleDoc)

    const { result } = renderHook(() =>
      useDocumentacionPendienteAlert(
        null,
        [{ id: 't-doc', radicado: 'IN-DOC', estado: 'doc_incompleta', updated_at: '' }],
        true,
      ),
    )

    await waitFor(() => {
      expect(result.current.data?.documentos).toEqual(['Certificado'])
    })
    expect(mockGetDetalle).toHaveBeenCalledWith('t-doc', expect.any(AbortSignal))
  })

  it('no consulta la API cuando está deshabilitado', () => {
    renderHook(() =>
      useDocumentacionPendienteAlert(
        null,
        [{ id: 't-doc', radicado: 'IN-DOC', estado: 'doc_incompleta', updated_at: '' }],
        false,
      ),
    )
    expect(mockGetDetalle).not.toHaveBeenCalled()
  })
})
