import axios from 'axios'
import { detailFromExportError } from '../services/exportIncapacidades.service'

export const EXPORT_INCAPACIDADES_ERROR = 'No se pudo exportar el listado. Intenta de nuevo.'
export const EXPORT_INCAPACIDADES_FORBIDDEN = 'No tienes permisos para exportar incapacidades.'
export const EXPORT_INCAPACIDADES_TOO_LARGE_HINT =
  'Demasiados registros para exportar. Aplica más filtros e intenta de nuevo.'

export async function messageFromIncapacidadesExportError(error: unknown): Promise<string> {
  const detail = await detailFromExportError(error)
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 403) return EXPORT_INCAPACIDADES_FORBIDDEN
    if (status === 401) return 'Sesión expirada. Inicia sesión de nuevo.'
    if (status === 413) return detail ?? EXPORT_INCAPACIDADES_TOO_LARGE_HINT
    if (status === 422) return detail ?? 'Revisa los filtros seleccionados e intenta de nuevo.'
    if (detail) return detail
  }
  if (error instanceof Error && error.message) return error.message
  return EXPORT_INCAPACIDADES_ERROR
}
