import { describe, it, expect } from 'vitest'
import { historialToTimelineRecords } from './historialToTimeline'
import type { HistorialEstadoRecord } from '@/features/incapacity-ai-review/types/incapacidadDetalle'

const HISTORIAL: HistorialEstadoRecord[] = [
  {
    id: '1',
    estado_nuevo: 'recibida',
    timestamp: '2025-06-01T10:00:00.000Z',
    usuario_nombre: 'Sistema',
  },
  {
    id: '2',
    estado_nuevo: 'procesando_ia',
    timestamp: '2025-06-01T11:00:00.000Z',
    usuario_nombre: 'Motor IA',
  },
  {
    id: '3',
    estado_nuevo: 'en_verificacion',
    timestamp: '2025-06-01T12:00:00.000Z',
    usuario_nombre: 'RRHH',
  },
]

describe('historialToTimelineRecords', () => {
  it('ordena por timestamp y marca el último como current', () => {
    const records = historialToTimelineRecords(
      [HISTORIAL[2], HISTORIAL[0], HISTORIAL[1]],
      'en_verificacion',
    )
    expect(records).toHaveLength(3)
    expect(records[0].estadoLabel).toBe('Recibida')
    expect(records[2].phase).toBe('current')
    expect(records[0].phase).toBe('completed')
  })

  it('si no hay historial devuelve un nodo con el estado actual', () => {
    const records = historialToTimelineRecords([], 'procesando_ia')
    expect(records).toHaveLength(1)
    expect(records[0].phase).toBe('current')
    expect(records[0].estadoLabel).toBe('Procesando IA')
  })

  it('usa alias estado y usuario por defecto', () => {
    const records = historialToTimelineRecords(
      [{ estado: 'recibida', timestamp: '2025-06-01T10:00:00.000Z' }],
      'recibida',
    )
    expect(records[0].estadoLabel).toBe('Recibida')
    expect(records[0].usuarioNombre).toBe('Sistema')
    expect(records[0].id).toContain('2025-06-01')
  })
})
