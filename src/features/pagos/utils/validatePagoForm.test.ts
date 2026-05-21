import { describe, it, expect } from 'vitest'
import { validatePagoFormFields } from './validatePagoForm'

describe('validatePagoFormFields', () => {
  it('requiere todos los campos', () => {
    const fe = validatePagoFormFields({
      entidadOrigen: '',
      referencia: '',
      monto: '',
      radicadosCount: 0,
    })
    expect(fe.entidad_origen).toBeDefined()
    expect(fe.referencia).toBeDefined()
    expect(fe.monto).toBeDefined()
    expect(fe.radicados).toBeDefined()
  })

  it('rechaza monto inválido', () => {
    const fe = validatePagoFormFields({
      entidadOrigen: 'EPS',
      referencia: 'R1',
      monto: '0',
      radicadosCount: 1,
    })
    expect(fe.monto).toMatch(/mayor que cero/)
  })

  it('acepta formulario válido', () => {
    const fe = validatePagoFormFields({
      entidadOrigen: 'EPS',
      referencia: 'R1',
      monto: '1500,50',
      radicadosCount: 2,
    })
    expect(Object.keys(fe)).toHaveLength(0)
  })
})
