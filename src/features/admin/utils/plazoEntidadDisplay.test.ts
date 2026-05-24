import { describe, it, expect } from 'vitest'
import type { PlazoEntidadItem } from '../types/plazoEntidad'
import {
  formatDiasPromedioPago,
  formatPlazoLimite,
  labelTipoIncapacidad,
  labelUnidadLimite,
} from './plazoEntidadDisplay'

const item: PlazoEntidadItem = {
  id: 'p1',
  entidad_nombre: 'Salud Total',
  tipo_incapacidad: 'general',
  valor_limite: 15,
  unidad_limite: 'dias',
  dias_limite: 15,
  dias_alerta: 3,
  dias_promedio_pago: 30,
}

describe('plazoEntidadDisplay', () => {
  it('labelTipoIncapacidad y labelUnidadLimite resuelven etiquetas', () => {
    expect(labelTipoIncapacidad('accidente_transito')).toBe('Accidente de tránsito')
    expect(labelUnidadLimite('meses')).toBe('Meses')
  })

  it('labelTipoIncapacidad devuelve el valor desconocido', () => {
    expect(labelTipoIncapacidad('otro')).toBe('otro')
  })

  it('formatPlazoLimite incluye valor, unidad y días', () => {
    expect(formatPlazoLimite(item)).toBe('15 días (15 días)')
  })

  it('formatDiasPromedioPago muestra guión cuando es nulo', () => {
    expect(formatDiasPromedioPago(null)).toBe('—')
    expect(formatDiasPromedioPago(12)).toBe('12')
  })
})
