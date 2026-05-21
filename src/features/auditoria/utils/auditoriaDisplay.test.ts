import { describe, it, expect } from 'vitest'
import {
  dateInputToIsoEnd,
  dateInputToIsoStart,
  formatAuditoriaTimestamp,
  usuarioAuditoriaLabel,
  usuarioAuditoriaTooltip,
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

  it('usa email o user_id si no hay nombre', () => {
    expect(
      usuarioAuditoriaLabel({
        id: '1',
        user_id: 'u1',
        usuario_email: 'a@test.com',
        accion: 'GET',
        timestamp: '2026-01-01T00:00:00Z',
      }),
    ).toBe('a@test.com')
    expect(
      usuarioAuditoriaLabel({
        id: '2',
        user_id: 'u2',
        accion: 'GET',
        timestamp: '2026-01-01T00:00:00Z',
      }),
    ).toBe('u2')
  })

  it('arma tooltip con nombre, email e id', () => {
    expect(
      usuarioAuditoriaTooltip({
        id: '1',
        user_id: 'u1',
        usuario_nombre: 'Ana',
        usuario_email: 'a@test.com',
        accion: 'GET',
        timestamp: '2026-01-01T00:00:00Z',
      }),
    ).toContain('Ana')
    expect(
      usuarioAuditoriaTooltip({
        id: '1',
        user_id: 'u1',
        usuario_email: 'a@test.com',
        accion: 'GET',
        timestamp: '2026-01-01T00:00:00Z',
      }),
    ).toContain('ID: u1')
  })

  it('devuelve undefined para fechas vacías o inválidas', () => {
    expect(dateInputToIsoStart('')).toBeUndefined()
    expect(dateInputToIsoEnd('   ')).toBeUndefined()
    expect(dateInputToIsoStart('invalid')).toBeUndefined()
  })

  it('devuelve ISO sin formatear si timestamp es inválido', () => {
    expect(formatAuditoriaTimestamp('no-es-fecha')).toBe('no-es-fecha')
  })
})
