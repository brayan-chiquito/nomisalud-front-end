import { describe, it, expect } from 'vitest'
import {
  colaboradorNombreLegible,
  colaboradorTooltipLista,
  entidadCeldaLista,
  entidadDetalleTooltip,
  entidadNombreLegible,
  tipoArchivoLegible,
} from './listIncapacidadItemDisplay'
import type { IncapacidadListItem } from '../types/listIncapacidades'

const base: IncapacidadListItem = {
  id: '1',
  radicado: 'IN01',
  estado: 'recibida',
  colaborador_id: 'uuid-1',
  archivo_tipo: 'pdf',
  fecha_recepcion: '2025-01-01T00:00:00Z',
}

describe('tipoArchivoLegible', () => {
  it('muestra solo el tipo de documento (archivo_tipo), ignorando incapacidad extraída', () => {
    expect(
      tipoArchivoLegible({
        ...base,
        archivo_tipo: 'pdf',
        incapacidad_tipo_extraido: 'enfermedad_general',
        datos_extraidos: { incapacidad: { tipo: 'Accidente' } },
      }),
    ).toBe('PDF')
  })

  it('devuelve — si no hay archivo_tipo', () => {
    expect(tipoArchivoLegible({ ...base, archivo_tipo: '' })).toBe('—')
  })
})

describe('listIncapacidadItemDisplay', () => {
  it('prioriza colaborador_nombre', () => {
    expect(colaboradorNombreLegible({ ...base, colaborador_nombre: 'Ana López' })).toBe('Ana López')
  })

  it('usa colaborador_email si no hay nombre', () => {
    expect(
      colaboradorNombreLegible({
        ...base,
        colaborador_nombre: null,
        colaborador_email: 'ana@nomisalud.com',
      }),
    ).toBe('ana@nomisalud.com')
  })

  it('lee colaborador desde datos_extraidos si no hay campos en raíz', () => {
    expect(
      colaboradorNombreLegible({
        ...base,
        datos_extraidos: { colaborador: { nombre_completo: 'Carlos Pérez' } },
      }),
    ).toBe('Carlos Pérez')
  })

  it('devuelve vacío si no hay dato de colaborador', () => {
    expect(colaboradorNombreLegible(base)).toBe('')
  })

  it('tooltip incluye nombre, email distinto e id', () => {
    const tip = colaboradorTooltipLista({
      ...base,
      colaborador_nombre: 'Ana',
      colaborador_email: 'ana@nomisalud.com',
    })
    expect(tip).toContain('Ana')
    expect(tip).toContain('ana@nomisalud.com')
    expect(tip).toContain('ID: uuid-1')
  })

  it('entidad desde entidad_nombre en raíz', () => {
    expect(
      entidadNombreLegible({
        ...base,
        entidad_nombre: 'EPS Sura',
      }),
    ).toBe('EPS Sura')
  })

  it('entidad desde datos_extraidos si no hay entidad_nombre', () => {
    expect(
      entidadNombreLegible({
        ...base,
        datos_extraidos: { entidad: { nombre: 'ARL X' } },
      }),
    ).toBe('ARL X')
  })

  it('entidadDetalleTooltip une tipo, nit y ciudad', () => {
    expect(
      entidadDetalleTooltip({
        ...base,
        entidad_tipo: 'EPS',
        entidad_nit: '800-1',
        entidad_ciudad: 'Bogotá',
      }),
    ).toBe('EPS · 800-1 · Bogotá')
  })

  it('entidadCeldaLista arma texto y title', () => {
    expect(
      entidadCeldaLista({
        ...base,
        entidad_nombre: 'EPS Sura',
        entidad_tipo: 'EPS',
      }),
    ).toEqual({ texto: 'EPS Sura', title: 'EPS Sura · EPS' })
    expect(entidadCeldaLista(base)).toEqual({ texto: '—' })
  })
})
