import { http } from '@/services/http'
import { filenameFromContentDisposition, triggerBrowserDownload } from '@/utils/downloadBlob'
import type {
  ConciliacionResponse,
  ExportConciliacionParams,
  GetConciliacionParams,
} from '../types/conciliacion'

function buildPeriodoQuery(
  mes: number,
  anio: number,
  entidad?: string,
): Record<string, string | number> {
  const q: Record<string, string | number> = { mes, anio }
  const ent = entidad?.trim()
  if (ent) q.entidad = ent
  return q
}

export async function getConciliacion(
  params: GetConciliacionParams,
): Promise<ConciliacionResponse> {
  const { signal, entidad, mes, anio } = params
  const { data } = await http.get<ConciliacionResponse>('/conciliacion', {
    params: buildPeriodoQuery(mes, anio, entidad),
    signal,
  })
  return data
}

export type ExportConciliacionResult = Readonly<{
  filename: string
}>

export async function exportConciliacionExcel(
  params: ExportConciliacionParams,
): Promise<ExportConciliacionResult> {
  const { signal, mes, anio, entidad } = params
  const { data, headers } = await http.get<Blob>('/conciliacion/exportar', {
    params: buildPeriodoQuery(mes, anio, entidad),
    responseType: 'blob',
    signal,
  })
  const disposition = headers['content-disposition'] as string | undefined
  const filename =
    filenameFromContentDisposition(disposition) ??
    `conciliacion_${anio}_${String(mes).padStart(2, '0')}.xlsx`
  triggerBrowserDownload(data, filename)
  return { filename }
}
