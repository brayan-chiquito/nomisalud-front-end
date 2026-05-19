import { describe, it, expect } from 'vitest'
import {
  inconsistenciasFromDetalle,
  inconsistenciasFromValidaciones,
  overridePermiteContinuar,
  requiereOverrideAntesDeContinuar,
} from './inconsistencias'

describe('inconsistenciasFromValidaciones', () => {
  it('retorna vacío si no hay array', () => {
    expect(inconsistenciasFromValidaciones(null)).toEqual([])
  })

  it('mapea tipo y descripción de hallazgos', () => {
    expect(
      inconsistenciasFromValidaciones([
        { nivel: 'warning', tipo: 'fechas', mensaje: 'Fin anterior al inicio' },
      ]),
    ).toEqual([{ tipo: 'fechas', descripcion: 'Fin anterior al inicio' }])
  })
})

describe('inconsistenciasFromDetalle', () => {
  it('prioriza inconsistencias[] del detalle', () => {
    expect(
      inconsistenciasFromDetalle(
        [{ tipo: 'dias', descripcion: 'Total no coincide' }],
        [{ nivel: 'warning', tipo: 'fechas', mensaje: 'Ignorado' }],
      ),
    ).toEqual([{ tipo: 'dias', descripcion: 'Total no coincide' }])
  })

  it('usa validaciones si inconsistencias[] está vacío', () => {
    expect(
      inconsistenciasFromDetalle(
        [],
        [{ nivel: 'error', tipo: 'legibilidad', descripcion: 'Ilegible' }],
      ),
    ).toEqual([{ tipo: 'legibilidad', descripcion: 'Ilegible' }])
  })
})

describe('overridePermiteContinuar', () => {
  it('permite continuar en en_verificacion o tras flag local', () => {
    expect(overridePermiteContinuar('inconsistencia_detectada', false)).toBe(false)
    expect(overridePermiteContinuar('en_verificacion', false)).toBe(true)
    expect(overridePermiteContinuar('inconsistencia_detectada', true)).toBe(true)
  })
})

describe('requiereOverrideAntesDeContinuar', () => {
  it('solo exige override en inconsistencia_detectada con hallazgos', () => {
    const hallazgos = [{ tipo: 'fechas', descripcion: 'x' }] as const
    expect(requiereOverrideAntesDeContinuar('inconsistencia_detectada', hallazgos)).toBe(true)
    expect(requiereOverrideAntesDeContinuar('en_verificacion', hallazgos)).toBe(false)
    expect(requiereOverrideAntesDeContinuar('inconsistencia_detectada', [])).toBe(false)
  })
})
