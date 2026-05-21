import { describe, it, expect } from 'vitest'
import {
  aniosConciliacionOptions,
  formatFechaConciliacion,
  formatMontoConciliacion,
  labelMes,
} from './conciliacionDisplay'

describe('conciliacionDisplay', () => {
  it('labelMes devuelve nombre en español', () => {
    expect(labelMes(5)).toBe('Mayo')
  })

  it('formatMontoConciliacion formatea COP', () => {
    expect(formatMontoConciliacion('1500000')).toMatch(/1\.500\.000|1,500,000/)
  })

  it('aniosConciliacionOptions incluye rango', () => {
    const years = aniosConciliacionOptions(2024)
    expect(years).toContain(2024)
    expect(years.length).toBeGreaterThan(5)
  })

  it('labelMes devuelve número fuera de rango', () => {
    expect(labelMes(13)).toBe('13')
  })

  it('formatMontoConciliacion devuelve texto si no es número', () => {
    expect(formatMontoConciliacion('no-num')).toBe('no-num')
  })

  it('formatMontoConciliacion acepta número', () => {
    expect(formatMontoConciliacion(1000)).toMatch(/\$|COP|1/)
  })

  it('formatFechaConciliacion formatea ISO válido', () => {
    expect(formatFechaConciliacion('2026-05-01T10:00:00Z')).toMatch(/\d{2}/)
  })

  it('formatFechaConciliacion devuelve em dash si está vacío', () => {
    expect(formatFechaConciliacion('')).toBe('—')
  })

  it('formatFechaConciliacion devuelve texto original si la fecha es inválida', () => {
    expect(formatFechaConciliacion('no-fecha')).toBe('no-fecha')
  })
})
