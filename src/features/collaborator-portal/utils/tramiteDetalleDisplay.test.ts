import { describe, it, expect } from 'vitest'
import { tramiteDetalleToDisplay } from './tramiteDetalleDisplay'
import type { IncapacidadDetalle } from '@/features/incapacity-ai-review/types/incapacidadDetalle'

describe('tramiteDetalleToDisplay', () => {
  it('mapea campos desde datos_extraidos', () => {
    const detail: IncapacidadDetalle = {
      id: '1',
      radicado: 'IN001',
      estado: 'en_verificacion',
      archivo_tipo: 'pdf',
      fecha_recepcion: '2025-06-01T12:00:00.000Z',
      extraccion_ia: {
        datos_extraidos: {
          incapacidad: { origen: 'Enfermedad general', dias: '5' },
          entidad: { nombre: 'EPS Test' },
        },
      },
    }
    const d = tramiteDetalleToDisplay(detail)
    expect(d.tipoIncapacidad).toBe('Enfermedad general')
    expect(d.entidadNombre).toBe('EPS Test')
    expect(d.diasIncapacidad).toBe('5 días')
    expect(d.fechaCarga).toMatch(/2025/)
  })
})
