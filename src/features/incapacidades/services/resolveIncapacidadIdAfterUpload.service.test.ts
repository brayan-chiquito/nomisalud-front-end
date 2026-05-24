import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  parseUploadIncapacityResponse,
  resolveIncapacidadIdAfterUpload,
} from './resolveIncapacidadIdAfterUpload.service'

vi.mock('./listIncapacidades.service', () => ({
  listIncapacidades: vi.fn(),
}))

import { listIncapacidades } from './listIncapacidades.service'

describe('parseUploadIncapacityResponse', () => {
  it('devuelve null si el payload no es un objeto con radicado y estado', () => {
    expect(parseUploadIncapacityResponse(null)).toBeNull()
    expect(parseUploadIncapacityResponse({ radicado: 'X' })).toBeNull()
    expect(parseUploadIncapacityResponse({ estado: 'Y' })).toBeNull()
  })

  it('interpreta radicado, estado e id opcional', () => {
    expect(
      parseUploadIncapacityResponse({ radicado: ' INC-1 ', estado: ' recibida ', id: ' uuid-1 ' }),
    ).toEqual({ radicado: 'INC-1', estado: 'recibida', id: 'uuid-1' })
  })

  it('acepta tramite_id como identificador cuando faltan radicado y estado', () => {
    expect(parseUploadIncapacityResponse({ tramite_id: 'only-id' })).toEqual({
      radicado: '—',
      estado: 'registrada',
      id: 'only-id',
    })
  })
})

describe('resolveIncapacidadIdAfterUpload', () => {
  beforeEach(() => {
    vi.mocked(listIncapacidades).mockReset()
  })

  it('devuelve id directamente si viene en la respuesta de upload', async () => {
    const id = await resolveIncapacidadIdAfterUpload({
      radicado: 'R1',
      estado: 'x',
      id: '11111111-1111-4111-8111-111111111111',
    })
    expect(id).toBe('11111111-1111-4111-8111-111111111111')
    expect(listIncapacidades).not.toHaveBeenCalled()
  })

  it('busca en el listado por radicado cuando no hay id en la respuesta', async () => {
    vi.mocked(listIncapacidades).mockResolvedValue({
      items: [
        {
          id: '22222222-2222-4222-8222-222222222222',
          radicado: 'INC-B',
          estado: 'recibida',
          colaborador_id: 'c1',
          archivo_tipo: 'pdf',
          fecha_recepcion: '2025-01-01',
        },
      ],
      total: 1,
      pages: 1,
    })
    const id = await resolveIncapacidadIdAfterUpload({ radicado: 'INC-B', estado: 'recibida' })
    expect(id).toBe('22222222-2222-4222-8222-222222222222')
    expect(listIncapacidades).toHaveBeenCalledWith({ page: 1, signal: undefined })
  })

  it('devuelve null si no hay coincidencia en el listado', async () => {
    vi.mocked(listIncapacidades).mockResolvedValue({
      items: [],
      total: 0,
      pages: 1,
    })
    const id = await resolveIncapacidadIdAfterUpload({ radicado: 'N/A', estado: 'recibida' })
    expect(id).toBeNull()
  })
})
