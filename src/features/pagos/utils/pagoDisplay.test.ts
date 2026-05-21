import { describe, it, expect } from 'vitest'
import { fechaPagoIso, formatFechaPago, formatMontoPago, labelEstadoPago } from './pagoDisplay'

describe('pagoDisplay', () => {
  it('formatMontoPago formatea COP', () => {
    expect(formatMontoPago(1500000.5)).toMatch(/1[\s.]?500[\s.]?000/)
  })

  it('formatMontoPago acepta string con coma', () => {
    expect(formatMontoPago('1500000,50')).toMatch(/1[\s.]?500[\s.]?000/)
  })

  it('formatMontoPago retorna el texto si no es un número', () => {
    expect(formatMontoPago('no-num')).toBe('no-num')
  })

  it('fechaPagoIso prioriza fecha_operacion', () => {
    expect(
      fechaPagoIso({
        id: '1',
        entidad_origen: 'x',
        referencia: 'r',
        monto: 1,
        fecha_operacion: '2026-05-01T10:00:00.000Z',
        fecha_registro: '2026-04-01T10:00:00.000Z',
      }),
    ).toBe('2026-05-01T10:00:00.000Z')
  })

  it('fechaPagoIso cae a created_at si no hay otras fechas', () => {
    expect(
      fechaPagoIso({
        id: '1',
        entidad_origen: 'x',
        referencia: 'r',
        monto: 1,
        created_at: '2026-04-01T10:00:00.000Z',
      }),
    ).toBe('2026-04-01T10:00:00.000Z')
  })

  it('formatFechaPago devuelve — si vacío', () => {
    expect(formatFechaPago('')).toBe('—')
  })

  it('formatFechaPago devuelve el input si ISO inválido', () => {
    expect(formatFechaPago('no-iso')).toBe('no-iso')
  })

  it('labelEstadoPago traduce claves conocidas', () => {
    expect(labelEstadoPago('registrado')).toBe('Registrado')
    expect(labelEstadoPago('anulado')).toBe('Anulado')
    expect(labelEstadoPago('')).toBe('—')
    expect(labelEstadoPago('otro')).toBe('otro')
  })
})
