import { labelEstadoIncapacidad } from '@/features/incapacidades/utils/estadoBadge'
import type { ReportesKpisPorEstado, ReportesKpisResponse } from '../types/reportesKpis'

export function formatReportesRatioPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return `${(value * 100).toFixed(1)}%`
}

export function urgenciaRojoTotal(
  porUrgencia: ReportesKpisResponse['por_urgencia'],
): number | null {
  const row = porUrgencia.find((u) => u.urgencia.trim().toLowerCase() === 'rojo')
  return row?.total ?? null
}

export type EstadoChartDatum = Readonly<{
  estado: string
  label: string
  total: number
  fill: string
}>

const CHART_FILL_BY_ESTADO: Readonly<Record<string, string>> = {
  recibida: '#3b82f6',
  procesando_ia: '#0ea5e9',
  en_verificacion: '#f59e0b',
  inconsistencia_detectada: '#f97316',
  doc_incompleta: '#fb923c',
  transcrita: '#8b5cf6',
  cobrada: '#10b981',
  rechazada: '#ef4444',
  pagada: '#22c55e',
}

export function mapPorEstadoToChartData(
  porEstado: readonly ReportesKpisPorEstado[],
): readonly EstadoChartDatum[] {
  return porEstado.map((row) => ({
    estado: row.estado,
    label: labelEstadoIncapacidad(row.estado),
    total: row.total,
    fill: CHART_FILL_BY_ESTADO[row.estado] ?? '#64748b',
  }))
}

export const REPORTES_KPIS_LOAD_ERROR =
  'No se pudieron cargar los indicadores. Verifica tu sesión o intenta de nuevo.'

export const REPORTES_KPIS_FORBIDDEN_ERROR =
  'No tienes permisos para ver los reportes analíticos del coordinador.'
