import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchIncapacidadKpis } from './incapacidadKpis.service'

vi.mock('./listIncapacidades.service', () => ({
  listIncapacidades: vi.fn(),
}))

import { listIncapacidades } from './listIncapacidades.service'

describe('fetchIncapacidadKpis', () => {
  beforeEach(() => {
    vi.mocked(listIncapacidades).mockReset()
  })

  it('agrega los totales de los cuatro estados KPI', async () => {
    vi.mocked(listIncapacidades)
      .mockResolvedValueOnce({ items: [], total: 124, pages: 1 })
      .mockResolvedValueOnce({ items: [], total: 38, pages: 1 })
      .mockResolvedValueOnce({ items: [], total: 15, pages: 1 })
      .mockResolvedValueOnce({ items: [], total: 71, pages: 1 })

    const k = await fetchIncapacidadKpis()
    expect(k).toEqual({
      totalRecibidas: 124,
      enVerificacion: 38,
      transcribiendo: 15,
      pagadas: 71,
    })
    expect(listIncapacidades).toHaveBeenCalledTimes(4)
  })
})
