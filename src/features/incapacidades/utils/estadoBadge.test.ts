import { describe, it, expect } from 'vitest'
import { estadoBadgeClasses, labelEstadoIncapacidad } from './estadoBadge'

describe('estadoBadge', () => {
  it('devuelve etiqueta legible para estados conocidos', () => {
    expect(labelEstadoIncapacidad('en_verificacion')).toBe('En verificación')
  })

  it('devuelve el valor crudo si no está en el catálogo', () => {
    expect(labelEstadoIncapacidad('custom')).toBe('custom')
  })

  it('asigna clases de badge para estados conocidos', () => {
    expect(estadoBadgeClasses('pagada')).toContain('green')
  })

  it('usa estilo neutro para estados desconocidos', () => {
    expect(estadoBadgeClasses('xyz')).toContain('slate')
  })
})
