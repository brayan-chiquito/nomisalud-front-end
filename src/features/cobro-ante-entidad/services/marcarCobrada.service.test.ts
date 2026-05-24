import { describe, it, expect, vi, beforeEach } from 'vitest'
import { marcarIncapacidadCobrada } from './marcarCobrada.service'
import { patchIncapacidadEstado } from '@/features/incapacity-ai-review/services/incapacidadReview.service'

vi.mock('@/features/incapacity-ai-review/services/incapacidadReview.service', () => ({
  patchIncapacidadEstado: vi.fn(),
}))

describe('marcarIncapacidadCobrada', () => {
  beforeEach(() => {
    vi.mocked(patchIncapacidadEstado).mockReset()
  })

  it('invoca PATCH con estado cobrada y observación', async () => {
    vi.mocked(patchIncapacidadEstado).mockResolvedValue({
      id: 'u1',
      radicado: 'IN01',
      estado: 'cobrada',
      estado_anterior: 'transcrita',
    })
    await marcarIncapacidadCobrada('u1', '  ref EPS  ')
    expect(patchIncapacidadEstado).toHaveBeenCalledWith(
      'u1',
      { estado: 'cobrada', observacion: 'ref EPS' },
      undefined,
    )
  })

  it('omite observación si está vacía', async () => {
    vi.mocked(patchIncapacidadEstado).mockResolvedValue({
      id: 'u1',
      radicado: 'IN01',
      estado: 'cobrada',
      estado_anterior: 'transcrita',
    })
    await marcarIncapacidadCobrada('u1', '   ')
    expect(patchIncapacidadEstado).toHaveBeenCalledWith('u1', { estado: 'cobrada' }, undefined)
  })
})
