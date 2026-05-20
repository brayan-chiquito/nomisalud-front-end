import { describe, it, expect } from 'vitest'
import {
  labelUrgencia,
  normalizarUrgencia,
  ordenarPorUrgenciaDesc,
  prioridadUrgencia,
} from './urgencia'
import type { IncapacidadListItem } from '../types/listIncapacidades'

function item(urgencia: string | null | undefined): IncapacidadListItem {
  return {
    id: String(Math.random()),
    radicado: 'IN1',
    estado: 'recibida',
    colaborador_id: 'c1',
    archivo_tipo: 'pdf',
    fecha_recepcion: '2026-01-01T00:00:00.000Z',
    urgencia,
  }
}

describe('normalizarUrgencia', () => {
  it('acepta valores del semáforo en cualquier capitalización', () => {
    expect(normalizarUrgencia('ROJO')).toBe('rojo')
    expect(normalizarUrgencia(' Amarillo ')).toBe('amarillo')
    expect(normalizarUrgencia('verde')).toBe('verde')
  })

  it('retorna null para valores desconocidos', () => {
    expect(normalizarUrgencia('azul')).toBeNull()
    expect(normalizarUrgencia(null)).toBeNull()
  })
})

describe('labelUrgencia y prioridadUrgencia', () => {
  it('asigna etiquetas legibles', () => {
    expect(labelUrgencia('rojo')).toBe('Urgente')
    expect(labelUrgencia('amarillo')).toBe('Alerta')
    expect(labelUrgencia('verde')).toBe('En plazo')
    expect(labelUrgencia(undefined)).toBe('Sin dato')
  })

  it('prioriza rojo sobre amarillo y verde', () => {
    expect(prioridadUrgencia('rojo')).toBeLessThan(prioridadUrgencia('amarillo'))
    expect(prioridadUrgencia('amarillo')).toBeLessThan(prioridadUrgencia('verde'))
    expect(prioridadUrgencia(null)).toBe(99)
  })
})

describe('ordenarPorUrgenciaDesc', () => {
  it('coloca rojo primero, luego amarillo, verde y sin dato al final', () => {
    const sorted = ordenarPorUrgenciaDesc([
      item('verde'),
      item(null),
      item('rojo'),
      item('amarillo'),
    ])
    expect(sorted.map((i) => i.urgencia)).toEqual(['rojo', 'amarillo', 'verde', null])
  })
})
