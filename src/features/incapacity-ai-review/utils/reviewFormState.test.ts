import { describe, it, expect } from 'vitest'
import {
  datosExtraidosToForm,
  mergeFormIntoDatosExtraidos,
  emptyReviewForm,
  canHumanVerifyIncapacidad,
  calidadDocPercent,
  contarAlertasValidacion,
  computeDiasIncapacidad,
  splitDiagnosticoCie10,
  formatDiasIncapacidadLabel,
} from './reviewFormState'

describe('reviewFormState', () => {
  it('datosExtraidosToForm mapea anidación típica', () => {
    const f = datosExtraidosToForm({
      colaborador: { nombre_completo: 'Ana', documento: '123' },
      incapacidad: {
        tipo: 'eg',
        fecha_inicio: '2026-01-01',
        fecha_fin: '2026-01-07',
        diagnostico: 'Gripe',
        codigo_cie10: 'J00',
        dias: '7',
      },
      entidad: { nombre: 'EPS', tipo: 'EPS', nit: '800' },
    })
    expect(f.nombreColaborador).toBe('Ana')
    expect(f.documentoColaborador).toBe('123')
    expect(f.tipoIncapacidad).toBe('eg')
    expect(f.fechaInicio).toBe('2026-01-01')
    expect(f.entidadNombre).toBe('EPS')
  })

  it('mergeFormIntoDatosExtraidos conserva claves extra y actualiza campos', () => {
    const orig = {
      foo: 1,
      colaborador: { legacy: true, nombre_completo: 'X' },
      incapacidad: { tipo: 'old' },
    }
    const next = mergeFormIntoDatosExtraidos(orig, {
      ...emptyReviewForm(),
      nombreColaborador: 'Nueva',
      tipoIncapacidad: 'enfermedad_general',
    })
    expect(next.foo).toBe(1)
    expect((next.colaborador as Record<string, unknown>).legacy).toBe(true)
    expect((next.colaborador as Record<string, unknown>).nombre_completo).toBe('Nueva')
    expect((next.incapacidad as Record<string, unknown>).tipo).toBe('enfermedad_general')
  })

  it('canHumanVerifyIncapacidad reconoce roles RRHH', () => {
    expect(canHumanVerifyIncapacidad('admin')).toBe(true)
    expect(canHumanVerifyIncapacidad('Auxiliar_RRHH')).toBe(true)
    expect(canHumanVerifyIncapacidad('colaborador')).toBe(false)
  })

  it('calidadDocPercent normaliza fracción o porcentaje', () => {
    expect(calidadDocPercent(0.85)).toBe(85)
    expect(calidadDocPercent(85)).toBe(85)
    expect(calidadDocPercent(null)).toBeNull()
  })

  it('contarAlertasValidacion cuenta ítems de alerta', () => {
    expect(
      contarAlertasValidacion([{ nivel: 'warning' }, { ok: true }, { severidad: 'error' }]),
    ).toBe(2)
  })

  it('datosExtraidosToForm lee paciente y separa CIE del texto combinado', () => {
    const f = datosExtraidosToForm({
      paciente: {
        nombre_completo: 'USUARIO DE PRUEBA',
        numero_identificacion: '1234567890',
      },
      incapacidad: {
        tipo: 'enfermedad_general',
        diagnostico_principal: 'K30X - Dispepsia',
      },
      entidad: { nombre: 'EPS X' },
    })
    expect(f.nombreColaborador).toBe('USUARIO DE PRUEBA')
    expect(f.documentoColaborador).toBe('1234567890')
    expect(f.codigoCie10).toBe('K30X')
    expect(f.diagnostico).toBe('Dispepsia')
  })

  it('splitDiagnosticoCie10 reconoce guión o dos puntos', () => {
    expect(splitDiagnosticoCie10('J00 - Gripe')).toEqual({ codigo: 'J00', descripcion: 'Gripe' })
    expect(splitDiagnosticoCie10('K30: Reflujo')).toEqual({ codigo: 'K30', descripcion: 'Reflujo' })
    expect(splitDiagnosticoCie10('K30X\u2010Dispepsia')).toEqual({
      codigo: 'K30X',
      descripcion: 'Dispepsia',
    })
  })

  it('datosExtraidosToForm lee objeto diagnostico anidado y total_dias', () => {
    const f = datosExtraidosToForm({
      diagnostico: { codigo_cie10: 'J00', descripcion: 'Gripe aguda' },
      incapacidad: { total_dias: '5', tipo: 'eg' },
    })
    expect(f.codigoCie10).toBe('J00')
    expect(f.diagnostico).toBe('Gripe aguda')
    expect(f.diasIncapacidad).toBe('5')
  })

  it('mergeFormIntoDatosExtraidos escribe total_dias y diagnostico_principal', () => {
    const next = mergeFormIntoDatosExtraidos(
      { incapacidad: { tipo: 'x', dias: '1' } },
      {
        ...emptyReviewForm(),
        codigoCie10: 'A01',
        diagnostico: 'Fiebre',
        diasIncapacidad: '4',
      },
    )
    const inc = next.incapacidad as Record<string, unknown>
    expect(inc.total_dias).toBe('4')
    expect(inc.diagnostico_principal).toBe('A01 - Fiebre')
  })

  it('formatDiasIncapacidadLabel prioriza cálculo, guión o sufijo días', () => {
    expect(formatDiasIncapacidadLabel(3, '')).toBe('3 días')
    expect(formatDiasIncapacidadLabel(null, '')).toBe('—')
    expect(formatDiasIncapacidadLabel(null, '5')).toBe('5')
    expect(formatDiasIncapacidadLabel(null, 'tres')).toBe('tres días')
  })

  it('datosExtraidosToForm ignora diagnostico cuando es objeto (no stringifica)', () => {
    const f = datosExtraidosToForm({
      incapacidad: { tipo: 'eg', diagnostico: { codigo: 'J00' } as unknown as string },
    })
    expect(f.tipoIncapacidad).toBe('eg')
    expect(f.diagnostico).toBe('')
  })

  it('computeDiasIncapacidad calcula rango inclusivo', () => {
    expect(computeDiasIncapacidad('2026-01-01', '2026-01-07')).toBe(7)
    expect(computeDiasIncapacidad('01/01/2026', '07/01/2026')).toBe(7)
  })
})
