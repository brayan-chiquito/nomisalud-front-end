import type { IncapacidadListItem } from '../types/listIncapacidades'

/** Badge solo si el backend marcó retraso y el trámite sigue en cobrada (SCRUM-193/194). */
export function debeMostrarPagoRetrasado(row: IncapacidadListItem): boolean {
  return row.pago_retrasado === true && row.estado === 'cobrada'
}
