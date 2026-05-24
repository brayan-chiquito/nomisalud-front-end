import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  listPlazosEntidad,
  getPlazoEntidad,
  createPlazoEntidad,
  updatePlazoEntidad,
  deletePlazoEntidad,
} from './plazosEntidad.service'

vi.mock('@/services/http', () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

import { http } from '@/services/http'

const plazo = {
  id: 'p1',
  entidad_nombre: 'Salud Total',
  tipo_incapacidad: 'general',
  valor_limite: 15,
  unidad_limite: 'dias',
  dias_limite: 15,
  dias_alerta: 3,
}

describe('plazosEntidad.service', () => {
  beforeEach(() => {
    vi.mocked(http.get).mockReset()
    vi.mocked(http.post).mockReset()
    vi.mocked(http.put).mockReset()
    vi.mocked(http.delete).mockReset()
  })

  it('listPlazosEntidad GET /admin/plazos-entidad', async () => {
    vi.mocked(http.get).mockResolvedValue({ data: { items: [], total: 0 } })
    const data = await listPlazosEntidad()
    expect(data.total).toBe(0)
    expect(http.get).toHaveBeenCalledWith('/admin/plazos-entidad', { signal: undefined })
  })

  it('getPlazoEntidad GET by id', async () => {
    vi.mocked(http.get).mockResolvedValue({ data: plazo })
    const data = await getPlazoEntidad('p1')
    expect(data).toEqual(plazo)
  })

  it('createPlazoEntidad POST', async () => {
    vi.mocked(http.post).mockResolvedValue({ data: plazo })
    const payload = {
      entidad_nombre: 'Salud Total',
      tipo_incapacidad: 'general',
      valor_limite: 15,
      unidad_limite: 'dias',
      dias_alerta: 3,
    }
    await createPlazoEntidad(payload)
    expect(http.post).toHaveBeenCalledWith('/admin/plazos-entidad', payload, { signal: undefined })
  })

  it('updatePlazoEntidad PUT parcial', async () => {
    vi.mocked(http.put).mockResolvedValue({ data: plazo })
    await updatePlazoEntidad('p1', { dias_alerta: 5 })
    expect(http.put).toHaveBeenCalledWith(
      '/admin/plazos-entidad/p1',
      { dias_alerta: 5 },
      { signal: undefined },
    )
  })

  it('deletePlazoEntidad DELETE', async () => {
    await deletePlazoEntidad('p1')
    expect(http.delete).toHaveBeenCalledWith('/admin/plazos-entidad/p1', { signal: undefined })
  })
})
