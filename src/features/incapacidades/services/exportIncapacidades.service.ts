import axios from 'axios'
import { http } from '@/services/http'
import { filenameFromContentDisposition, triggerBrowserDownload } from '@/utils/downloadBlob'
import {
  buildIncapacidadesFilterQuery,
  type IncapacidadesFilterParams,
} from './listIncapacidades.service'

export const INCAPACIDADES_EXPORT_DEFAULT_FILENAME = 'incapacidades.xlsx'

export type ExportIncapacidadesResult = Readonly<{
  filename: string
}>

export async function exportIncapacidadesXlsx(
  filters: IncapacidadesFilterParams = {},
  signal?: AbortSignal,
): Promise<ExportIncapacidadesResult> {
  const { data, headers } = await http.get<Blob>('/incapacidades/exportar', {
    params: buildIncapacidadesFilterQuery(filters),
    responseType: 'blob',
    signal,
  })
  const disposition = headers['content-disposition'] as string | undefined
  const filename =
    filenameFromContentDisposition(disposition) ?? INCAPACIDADES_EXPORT_DEFAULT_FILENAME
  triggerBrowserDownload(data, filename)
  return { filename }
}

export async function detailFromExportError(error: unknown): Promise<string | null> {
  if (!axios.isAxiosError(error) || !error.response?.data) return null
  const body = error.response.data
  if (typeof body === 'object' && body !== null && 'detail' in body) {
    const detail = (body as { detail: unknown }).detail
    if (typeof detail === 'string') return detail
  }
  if (body instanceof Blob) {
    try {
      const text = await body.text()
      const parsed = JSON.parse(text) as { detail?: unknown }
      if (typeof parsed.detail === 'string') return parsed.detail
    } catch {
      return null
    }
  }
  return null
}
