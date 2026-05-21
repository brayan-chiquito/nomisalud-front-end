import { http } from '@/services/http'
import type { ReportesKpisResponse } from '../types/reportesKpis'

export async function fetchReportesKpis(signal?: AbortSignal): Promise<ReportesKpisResponse> {
  const { data } = await http.get<ReportesKpisResponse>('/reportes/kpis', { signal })
  return data
}
