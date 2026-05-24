import { listIncapacidades } from './listIncapacidades.service'

export type IncapacidadKpis = Readonly<{
  totalRecibidas: number
  enVerificacion: number
  transcribiendo: number
  pagadas: number
}>

const KPI_ESTADOS = ['recibida', 'en_verificacion', 'transcrita', 'pagada'] as const

/**
 * Totales por estado vía GET `/incapacidades?page=1&estado=…` (campo `total` de la respuesta).
 */
export async function fetchIncapacidadKpis(signal?: AbortSignal): Promise<IncapacidadKpis> {
  const results = await Promise.all(
    KPI_ESTADOS.map((estado) => listIncapacidades({ page: 1, estado, signal })),
  )
  return {
    totalRecibidas: results[0].total,
    enVerificacion: results[1].total,
    transcribiendo: results[2].total,
    pagadas: results[3].total,
  }
}
