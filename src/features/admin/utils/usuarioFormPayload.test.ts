import { describe, it, expect } from 'vitest'
import { buildOptionalUsuarioFields } from './usuarioFormPayload'

describe('usuarioFormPayload', () => {
  it('buildOptionalUsuarioFields omite campos vacíos', () => {
    expect(
      buildOptionalUsuarioFields({
        tipo_documento: '',
        numero_documento: '123',
        area: '',
        cargo: '',
        eps_afiliacion: '',
        arl_afiliacion: '',
      }),
    ).toEqual({ numero_documento: '123' })
  })

  it('buildOptionalUsuarioFields recorta y agrupa todos los campos', () => {
    expect(
      buildOptionalUsuarioFields({
        tipo_documento: ' CC ',
        numero_documento: '1',
        area: 'A',
        cargo: 'C',
        eps_afiliacion: 'E',
        arl_afiliacion: 'ARL',
      }),
    ).toEqual({
      tipo_documento: 'CC',
      numero_documento: '1',
      area: 'A',
      cargo: 'C',
      eps_afiliacion: 'E',
      arl_afiliacion: 'ARL',
    })
  })

  it('buildOptionalUsuarioFields devuelve undefined si todo vacío', () => {
    expect(
      buildOptionalUsuarioFields({
        tipo_documento: '  ',
        numero_documento: '',
        area: '',
        cargo: '',
        eps_afiliacion: '',
        arl_afiliacion: '',
      }),
    ).toBeUndefined()
  })
})
