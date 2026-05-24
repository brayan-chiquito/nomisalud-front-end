import { describe, it, expect } from 'vitest'
import type { IncapacidadDetalle } from '@/features/incapacity-ai-review/types/incapacidadDetalle'
import {
  documentacionPendienteFromDetalle,
  formatPlazoDocumentacion,
} from './documentacionPendiente'

const baseDetalle: IncapacidadDetalle = {
  id: 't1',
  radicado: 'IN-1',
  estado: 'doc_incompleta',
  archivo_tipo: 'pdf',
  documentacion_faltante: ['Fórmula médica'],
  extraccion_ia: null,
}

describe('documentacionPendienteFromDetalle', () => {
  it('retorna null si no hay detalle o el estado no es doc_incompleta', () => {
    expect(documentacionPendienteFromDetalle(null)).toBeNull()
    expect(documentacionPendienteFromDetalle({ ...baseDetalle, estado: 'recibida' })).toBeNull()
  })

  it('retorna null si no hay documentos faltantes', () => {
    expect(
      documentacionPendienteFromDetalle({ ...baseDetalle, documentacion_faltante: [] }),
    ).toBeNull()
    expect(
      documentacionPendienteFromDetalle({ ...baseDetalle, documentacion_faltante: ['  '] }),
    ).toBeNull()
  })

  it('mapea documentos y plazos desde el detalle', () => {
    const data = documentacionPendienteFromDetalle({
      ...baseDetalle,
      documentacion_faltante: [' Fórmula médica ', 'Historia clínica'],
      dias_habiles_restantes: 3,
      plazo_maximo_dias_habiles: 10,
      fecha_vencimiento_documentacion: '2025-12-31',
    })
    expect(data).toEqual({
      documentos: ['Fórmula médica', 'Historia clínica'],
      diasHabilesRestantes: 3,
      plazoMaximoDiasHabiles: 10,
      fechaVencimientoIso: '2025-12-31',
    })
  })
})

describe('formatPlazoDocumentacion', () => {
  it('combina plazo máximo, días restantes y fecha de vencimiento', () => {
    const texto = formatPlazoDocumentacion({
      documentos: ['A'],
      diasHabilesRestantes: 1,
      plazoMaximoDiasHabiles: 5,
      fechaVencimientoIso: '2025-06-15',
    })
    expect(texto).toMatch(/Plazo máximo: 5 días hábiles/)
    expect(texto).toMatch(/Te quedan 1 día hábil/)
    expect(texto).toMatch(/Vence el/)
  })

  it('retorna null si no hay datos de plazo', () => {
    expect(
      formatPlazoDocumentacion({
        documentos: ['A'],
        diasHabilesRestantes: null,
        plazoMaximoDiasHabiles: null,
        fechaVencimientoIso: null,
      }),
    ).toBeNull()
  })
})
