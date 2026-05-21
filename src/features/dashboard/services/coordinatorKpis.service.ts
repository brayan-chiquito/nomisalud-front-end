import { listIncapacidades } from '@/features/incapacidades/services/listIncapacidades.service'

export type CoordinatorKpis = Readonly<{
  precisionExtraccionPct: number | null
  tasaClasificacionPct: number | null
  pendientesVerificacion: number
  inconsistenciasIa: number
  pagosRetrasados: number
}>

const ESTADOS_CLASIFICADOS = ['transcrita', 'en_verificacion', 'cobrada', 'pagada'] as const

function pct(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null
  return Math.round((numerator / denominator) * 100)
}

/**
 * KPIs del coordinador vía totales de `GET /incapacidades` (SCRUM-198).
 * Métricas aproximadas hasta un endpoint analítico dedicado.
 */
export async function fetchCoordinatorKpis(signal?: AbortSignal): Promise<CoordinatorKpis> {
  const [
    universo,
    enVerificacion,
    inconsistencia,
    docIncompleta,
    pagoRetrasado,
    ...clasificadosPorEstado
  ] = await Promise.all([
    listIncapacidades({ page: 1, signal }),
    listIncapacidades({ page: 1, estado: 'en_verificacion', signal }),
    listIncapacidades({ page: 1, estado: 'inconsistencia_detectada', signal }),
    listIncapacidades({ page: 1, estado: 'doc_incompleta', signal }),
    listIncapacidades({ page: 1, pagoRetrasado: true, signal }),
    ...ESTADOS_CLASIFICADOS.map((estado) => listIncapacidades({ page: 1, estado, signal })),
  ])

  const totalUniverso = universo.total
  const fallosIa = inconsistencia.total + docIncompleta.total
  const clasificados = clasificadosPorEstado.reduce((sum, r) => sum + r.total, 0)
  const denomClasificacion = clasificados + fallosIa

  return {
    precisionExtraccionPct: pct(totalUniverso - fallosIa, totalUniverso),
    tasaClasificacionPct: pct(clasificados, denomClasificacion),
    pendientesVerificacion: enVerificacion.total,
    inconsistenciasIa: inconsistencia.total,
    pagosRetrasados: pagoRetrasado.total,
  }
}
