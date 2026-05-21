import { describe, it, expect } from 'vitest'
import {
  dateInputToIsoEnd,
  dateInputToIsoStart,
  formatAuditoriaTimestamp,
  usuarioAuditoriaLabel,
} from './auditoriaDisplay'

describe('auditoriaDisplay', () => {
  it('prioriza nombre de usuario', () => {
    expect(
      usuarioAuditoriaLabel({
        id: '1',
        user_id: 'u1',
        usuario_nombre: 'Ana',
        usuario_email: 'a@test.com',
        accion: 'GET',
        timestamp: '2026-01-01T00:00:00Z',
      }),
    ).toBe('Ana')
  })

  it('convierte fechas del filtro a ISO', () => {
    const start = dateInputToIsoStart('2026-05-01')
    const end = dateInputToIsoEnd('2026-05-01')
    expect(start).toBeTruthy()
    expect(end).toBeTruthy()
    expect(new Date(end!).getTime()).toBeGreaterThan(new Date(start!).getTime())
  })

  it('formatea timestamp legible', () => {
    expect(formatAuditoriaTimestamp('2026-05-21T14:30:00Z')).toMatch(/\d{2}/)
  })
})
