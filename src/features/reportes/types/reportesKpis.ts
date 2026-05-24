export type ReportesKpisPorEstado = Readonly<{
  estado: string
  total: number
}>

export type ReportesKpisPorUrgencia = Readonly<{
  urgencia: string
  total: number
}>

/** Respuesta de `GET /reportes/kpis` (SCRUM-212/214). */
export type ReportesKpisResponse = Readonly<{
  por_estado: readonly ReportesKpisPorEstado[]
  por_urgencia: readonly ReportesKpisPorUrgencia[]
  precision_ocr_promedio: number | null
  tasa_clasificacion_ia_correcta: number | null
  total_incapacidades: number
  generado_en: string
}>
