import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchCoordinatorKpis } from './coordinatorKpis.service'

vi.mock('@/features/incapacidades/services/listIncapacidades.service', () => ({
  listIncapacidades: vi.fn(),
}))

import { listIncapacidades } from '@/features/incapacidades/services/listIncapacidades.service'

describe('fetchCoordinatorKpis', () => {
  beforeEach(() => {
    vi.mocked(listIncapacidades).mockReset()
  })

  it('calcula porcentajes y totales desde las respuestas paginadas', async () => {
    const totals: Record<string, number> = {
      universo: 100,
      en_verificacion: 12,
      inconsistencia_detectada: 8,
      doc_incompleta: 2,
      pago_retrasado: 3,
      transcrita: 20,
      cobrada: 10,
      pagada: 5,
    }
    vi.mocked(listIncapacidades).mockImplementation(async (params) => {
      if (params?.pagoRetrasado === true) {
        return { items: [], total: totals.pago_retrasado, pages: 1 }
      }
      const estado = params?.estado
      if (!estado) {
        return { items: [], total: totals.universo, pages: 5 }
      }
      return { items: [], total: totals[estado] ?? 0, pages: 1 }
    })

    const kpis = await fetchCoordinatorKpis()
    expect(kpis.pendientesVerificacion).toBe(12)
    expect(kpis.inconsistenciasIa).toBe(8)
    expect(kpis.pagosRetrasados).toBe(3)
    expect(kpis.precisionExtraccionPct).toBe(90)
    expect(kpis.tasaClasificacionPct).toBe(82)
  })
})
