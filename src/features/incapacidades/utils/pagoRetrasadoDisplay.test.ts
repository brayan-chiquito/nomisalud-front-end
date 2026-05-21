import { describe, it, expect } from 'vitest'
import { debeMostrarPagoRetrasado } from './pagoRetrasadoDisplay'

const base = {
  id: '1',
  radicado: 'IN1',
  estado: 'cobrada',
  colaborador_id: 'c1',
  archivo_tipo: 'pdf',
  fecha_recepcion: '2026-01-01T00:00:00Z',
}

describe('debeMostrarPagoRetrasado', () => {
  it('muestra badge en cobrada con pago_retrasado', () => {
    expect(debeMostrarPagoRetrasado({ ...base, pago_retrasado: true })).toBe(true)
  })

  it('no muestra badge si el estado no es cobrada', () => {
    expect(debeMostrarPagoRetrasado({ ...base, estado: 'pagada', pago_retrasado: true })).toBe(
      false,
    )
  })

  it('no muestra badge sin flag del backend', () => {
    expect(debeMostrarPagoRetrasado({ ...base, pago_retrasado: false })).toBe(false)
  })
})
