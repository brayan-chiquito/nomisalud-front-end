import { describe, it, expect } from 'vitest'
import { aniosConciliacionOptions, formatMontoConciliacion, labelMes } from './conciliacionDisplay'

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
})
