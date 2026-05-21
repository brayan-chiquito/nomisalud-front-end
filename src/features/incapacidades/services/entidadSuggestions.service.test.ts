import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchEntidadNombreSuggestions } from './entidadSuggestions.service'
import { listIncapacidades } from './listIncapacidades.service'
import { listPagos } from '@/features/pagos/services/pagos.service'

vi.mock('./listIncapacidades.service', () => ({
  listIncapacidades: vi.fn(),
}))

vi.mock('@/features/pagos/services/pagos.service', () => ({
  listPagos: vi.fn(),
}))

describe('fetchEntidadNombreSuggestions', () => {
  beforeEach(() => {
    vi.mocked(listIncapacidades).mockReset()
    vi.mocked(listPagos).mockReset()
  })

  it('devuelve vacío con menos de 2 caracteres', async () => {
    expect(await fetchEntidadNombreSuggestions('a')).toEqual([])
    expect(listIncapacidades).not.toHaveBeenCalled()
  })

  it('une nombres únicos de incapacidades y pagos', async () => {
    vi.mocked(listIncapacidades).mockResolvedValue({
      items: [{ entidad_nombre: 'EPS Sura' } as never],
      total: 1,
      pages: 1,
    })
    vi.mocked(listPagos).mockResolvedValue({
      items: [{ entidad_origen: 'EPS Sura' }, { entidad_origen: 'SIS' }] as never[],
      total: 2,
      pages: 1,
    })

    const names = await fetchEntidadNombreSuggestions('sis')
    expect(names).toEqual(['EPS Sura', 'SIS'])
    expect(listIncapacidades).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, entidad: 'sis' }),
    )
    expect(listPagos).toHaveBeenCalledWith(expect.objectContaining({ page: 1, entidad: 'sis' }))
  })

  it('devuelve vacío si las peticiones fallan', async () => {
    vi.mocked(listIncapacidades).mockRejectedValue(new Error('red'))
    vi.mocked(listPagos).mockRejectedValue(new Error('red'))
    expect(await fetchEntidadNombreSuggestions('eps')).toEqual([])
  })
})
