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

  it('acepta ok:false y alias de nivel', () => {
    expect(
      inconsistenciasFromValidaciones([
        { ok: false, campo: 'dias', detalle: 'No cuadra' },
        { severidad: 'error', codigo: 'leg', message: 'Ilegible' },
        { nivel: 'warn', regla: 'nit', texto: 'NIT inválido' },
      ]),
    ).toEqual([
      { tipo: 'dias', descripcion: 'No cuadra' },
      { tipo: 'leg', descripcion: 'Ilegible' },
      { tipo: 'nit', descripcion: 'NIT inválido' },
    ])
  })

  it('ignora entradas inválidas o sin hallazgo', () => {
    expect(
      inconsistenciasFromValidaciones([null, 'texto', { nivel: 'info', tipo: 'x', mensaje: 'ok' }]),
    ).toEqual([])
    expect(
      inconsistenciasFromValidaciones([
        { nivel: 'warning', tipo_validacion: 'eps', mensaje: '  ' },
      ]),
    ).toEqual([{ tipo: 'eps', descripcion: 'Sin descripción' }])
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

  it('usa validaciones si inconsistencias es null', () => {
    expect(
      inconsistenciasFromDetalle(null, [{ ok: false, tipo: 'fechas', mensaje: 'Rango inválido' }]),
    ).toEqual([{ tipo: 'fechas', descripcion: 'Rango inválido' }])
  })

  it('filtra registros vacíos de la tabla', () => {
    expect(
      inconsistenciasFromDetalle(
        [{ tipo: '', descripcion: '' }],
        [{ nivel: 'warning', tipo: 'eps', mensaje: 'Revisar' }],
      ),
    ).toEqual([{ tipo: 'eps', descripcion: 'Revisar' }])
  })
})

describe('overridePermiteContinuar', () => {
  it('permite continuar en en_verificacion o tras flag local', () => {
    expect(overridePermiteContinuar('inconsistencia_detectada', false)).toBe(false)
    expect(overridePermiteContinuar('en_verificacion', false)).toBe(true)
    expect(overridePermiteContinuar('inconsistencia_detectada', true)).toBe(true)
    expect(overridePermiteContinuar('transcrita', false)).toBe(true)
    expect(overridePermiteContinuar('cobrada', false)).toBe(true)
    expect(overridePermiteContinuar('pagada', false)).toBe(true)
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
