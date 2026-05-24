import { describe, it, expect } from 'vitest'
import { formatFechaCorta } from './formatFecha'

describe('formatFechaCorta', () => {
  it('formatea una fecha ISO válida', () => {
    const formatted = formatFechaCorta('2025-06-15T12:00:00.000Z')
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })

  it('devuelve el texto original si la fecha no es válida', () => {
    expect(formatFechaCorta('no-es-fecha')).toBe('no-es-fecha')
  })
})
