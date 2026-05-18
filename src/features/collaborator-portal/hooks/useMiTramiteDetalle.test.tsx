import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMiTramiteDetalle } from './useMiTramiteDetalle'
import { getIncapacidadDetalle } from '@/features/incapacity-ai-review/services/incapacidadReview.service'
import type { IncapacidadDetalle } from '@/features/incapacity-ai-review/types/incapacidadDetalle'

vi.mock('@/features/incapacity-ai-review/services/incapacidadReview.service', () => ({
  getIncapacidadDetalle: vi.fn(),
}))

const detalleBase: IncapacidadDetalle = {
  id: 't1',
  radicado: 'IN-DET',
  estado: 'en_verificacion',
  archivo_tipo: 'pdf',
  historial_estados: [],
  extraccion_ia: null,
}

describe('useMiTramiteDetalle', () => {
  beforeEach(() => {
    vi.mocked(getIncapacidadDetalle).mockReset()
    vi.mocked(getIncapacidadDetalle).mockResolvedValue(detalleBase)
  })

  it('sin tramiteId devuelve estado vacío sin llamar al servicio', () => {
    const { result } = renderHook(() => useMiTramiteDetalle(undefined))

    expect(result.current).toEqual({ detail: null, loading: false, error: null })
    expect(getIncapacidadDetalle).not.toHaveBeenCalled()
  })

  it('carga el detalle del trámite', async () => {
    const { result } = renderHook(() => useMiTramiteDetalle('t1'))

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.detail?.radicado).toBe('IN-DET')
    expect(result.current.error).toBeNull()
    expect(getIncapacidadDetalle).toHaveBeenCalledWith('t1', expect.any(AbortSignal))
  })

  it('expone error cuando falla la carga', async () => {
    vi.mocked(getIncapacidadDetalle).mockRejectedValue(new Error('No encontrado'))

    const { result } = renderHook(() => useMiTramiteDetalle('t1'))

    await waitFor(() => expect(result.current.error).toBeTruthy())
    expect(result.current.detail).toBeNull()
    expect(result.current.loading).toBe(false)
  })
})
