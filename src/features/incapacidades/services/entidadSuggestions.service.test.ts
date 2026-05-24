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
    expect(names).toEqual(['SIS'])
    expect(listIncapacidades).toHaveBeenCalledWith(expect.objectContaining({ page: 1, q: 'sis' }))
    expect(listPagos).toHaveBeenCalledWith(expect.objectContaining({ page: 1, q: 'sis' }))
  })

  it('usa solo pagos cuando sources es pagos (contabilidad)', async () => {
    vi.mocked(listPagos).mockResolvedValue({
      items: [{ entidad_origen: 'SIS' }] as never[],
      total: 1,
      pages: 1,
    })

    const names = await fetchEntidadNombreSuggestions('sis', { sources: 'pagos' })
    expect(names).toEqual(['SIS'])
    expect(listIncapacidades).not.toHaveBeenCalled()
    expect(listPagos).toHaveBeenCalled()
  })

  it('sigue con pagos si incapacidades responde 403', async () => {
    vi.mocked(listIncapacidades).mockRejectedValue({ response: { status: 403 } })
    vi.mocked(listPagos).mockResolvedValue({
      items: [{ entidad_origen: 'SIS' }] as never[],
      total: 1,
      pages: 1,
    })

    const names = await fetchEntidadNombreSuggestions('sis')
    expect(names).toEqual(['SIS'])
  })

  it('usa solo incapacidades con filtros de listado (cobro transcrita)', async () => {
    vi.mocked(listIncapacidades).mockResolvedValueOnce({
      items: [
        {
          entidad_nombre: 'EPS Sura',
          colaborador_nombre: 'Colaborador Demo',
          colaborador_email: 'colaborador@nomisalud.com',
          radicado: 'IN0001',
        },
      ] as never[],
      total: 1,
      pages: 1,
    })

    const names = await fetchEntidadNombreSuggestions('cola', {
      sources: 'incapacidades',
      listFilters: { estado: 'transcrita' },
    })
    expect(names).toEqual(['Colaborador Demo'])
    expect(listIncapacidades).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, q: 'cola', estado: 'transcrita' }),
    )
    expect(listPagos).not.toHaveBeenCalled()
  })

  it('ignora q/entidad en listFilters y consulta con q en API', async () => {
    vi.mocked(listIncapacidades).mockResolvedValueOnce({
      items: [
        {
          colaborador_nombre: 'brayan chiquito',
          colaborador_email: 'b@test.com',
          entidad_nombre: 'COOSALUD EPS',
          radicado: 'IN01',
        },
      ] as never[],
      total: 1,
      pages: 1,
    })

    const names = await fetchEntidadNombreSuggestions('brayan', {
      sources: 'incapacidades',
      listFilters: { q: 'brayan', entidad: 'brayan', estado: 'transcrita' },
    })
    expect(names).toContain('brayan chiquito')
    expect(listIncapacidades).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, estado: 'transcrita', q: 'brayan' }),
    )
  })

  it('devuelve vacío solo si ambas fuentes fallan', async () => {
    vi.mocked(listIncapacidades).mockRejectedValue(new Error('red'))
    vi.mocked(listPagos).mockRejectedValue(new Error('red'))
    expect(await fetchEntidadNombreSuggestions('eps')).toEqual([])
  })
})
