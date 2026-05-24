import { describe, it, expect } from 'vitest'
import type { PlazoEntidadItem } from '../types/plazoEntidad'
import {
  buildCreatePlazoEntidadPayload,
  buildUpdatePlazoEntidadPayload,
  emptyPlazoEntidadFormValues,
  plazoEntidadFormValuesFromItem,
} from './plazoEntidadFormPayload'

const baseItem: PlazoEntidadItem = {
  id: 'p1',
  entidad_nombre: 'Salud Total',
  tipo_incapacidad: 'general',
  valor_limite: 15,
  unidad_limite: 'dias',
  dias_limite: 15,
  dias_alerta: 3,
  dias_promedio_pago: 30,
}

describe('plazoEntidadFormPayload', () => {
  it('emptyPlazoEntidadFormValues devuelve valores por defecto', () => {
    expect(emptyPlazoEntidadFormValues()).toEqual({
      entidad_nombre: '',
      tipo_incapacidad: 'general',
      valor_limite: '',
      unidad_limite: 'dias',
      dias_alerta: '',
      dias_promedio_pago: '',
    })
  })

  it('plazoEntidadFormValuesFromItem mapea el ítem', () => {
    expect(plazoEntidadFormValuesFromItem(baseItem)).toEqual({
      entidad_nombre: 'Salud Total',
      tipo_incapacidad: 'general',
      valor_limite: '15',
      unidad_limite: 'dias',
      dias_alerta: '3',
      dias_promedio_pago: '30',
    })
  })

  it('plazoEntidadFormValuesFromItem deja vacío pago promedio nulo', () => {
    expect(
      plazoEntidadFormValuesFromItem({ ...baseItem, dias_promedio_pago: null }).dias_promedio_pago,
    ).toBe('')
  })

  it('buildCreatePlazoEntidadPayload construye payload válido', () => {
    expect(
      buildCreatePlazoEntidadPayload({
        entidad_nombre: '  EPS Sura ',
        tipo_incapacidad: 'accidente_trabajo',
        valor_limite: '20',
        unidad_limite: 'meses',
        dias_alerta: '5',
        dias_promedio_pago: '45',
      }),
    ).toEqual({
      entidad_nombre: 'EPS Sura',
      tipo_incapacidad: 'accidente_trabajo',
      valor_limite: 20,
      unidad_limite: 'meses',
      dias_alerta: 5,
      dias_promedio_pago: 45,
    })
  })

  it('buildCreatePlazoEntidadPayload omite pago promedio vacío', () => {
    expect(
      buildCreatePlazoEntidadPayload({
        ...emptyPlazoEntidadFormValues(),
        entidad_nombre: 'EPS',
        valor_limite: '10',
        dias_alerta: '2',
      }),
    ).toEqual({
      entidad_nombre: 'EPS',
      tipo_incapacidad: 'general',
      valor_limite: 10,
      unidad_limite: 'dias',
      dias_alerta: 2,
    })
  })

  it('buildCreatePlazoEntidadPayload valida entidad y números', () => {
    expect(() =>
      buildCreatePlazoEntidadPayload({
        ...emptyPlazoEntidadFormValues(),
        entidad_nombre: '   ',
        valor_limite: '10',
        dias_alerta: '2',
      }),
    ).toThrow(/nombre de la entidad/i)

    expect(() =>
      buildCreatePlazoEntidadPayload({
        ...emptyPlazoEntidadFormValues(),
        entidad_nombre: 'EPS',
        valor_limite: '0',
        dias_alerta: '2',
      }),
    ).toThrow(/plazo límite/i)
  })

  it('buildUpdatePlazoEntidadPayload lanza si no hay cambios', () => {
    const values = plazoEntidadFormValuesFromItem(baseItem)
    expect(() => buildUpdatePlazoEntidadPayload(values, baseItem)).toThrow(/no hay cambios/i)
  })

  it('buildUpdatePlazoEntidadPayload detecta cambios parciales', () => {
    const values = {
      ...plazoEntidadFormValuesFromItem(baseItem),
      entidad_nombre: 'Nueva EPS',
      valor_limite: '20',
      dias_promedio_pago: '',
    }
    expect(buildUpdatePlazoEntidadPayload(values, baseItem)).toEqual({
      entidad_nombre: 'Nueva EPS',
      valor_limite: 20,
      dias_promedio_pago: null,
    })
  })
})
