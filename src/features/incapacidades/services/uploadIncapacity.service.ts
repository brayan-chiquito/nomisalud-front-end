import axios from 'axios'
import { uploadHttp } from '@/services/uploadHttp'

export interface UploadIncapacityOptions {
  /** Solo si RRHH/admin sube en nombre de un colaborador (ver docs del backend). */
  colaboradorId?: string
  onProgress?: (percent: number) => void
  signal?: AbortSignal
}

function detailStringFromUnknown(detail: unknown): string | null {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0] && typeof detail[0] === 'object') {
    const msg = (detail[0] as { msg?: string }).msg
    if (typeof msg === 'string') return msg
  }
  return null
}

function messageFromResponseData(data: object): string | null {
  if ('detail' in data) {
    const fromDetail = detailStringFromUnknown((data as { detail: unknown }).detail)
    if (fromDetail) return fromDetail
  }
  if ('message' in data && typeof (data as { message: unknown }).message === 'string') {
    return (data as { message: string }).message
  }
  return null
}

function messageFromAxiosError(error: unknown): string {
  const fallback = 'No se pudo completar la carga. Intenta de nuevo.'
  if (!axios.isAxiosError(error)) {
    return fallback
  }
  const data = error.response?.data
  if (data && typeof data === 'object') {
    const msg = messageFromResponseData(data)
    if (msg) return msg
  }
  return fallback
}

/**
 * POST `/incapacidades/upload` (multipart).
 * @returns Payload JSON del backend (estructura según evolución de la API).
 */
export async function uploadIncapacityFile(
  file: File,
  options?: UploadIncapacityOptions,
): Promise<unknown> {
  try {
    const formData = new FormData()
    formData.append('archivo', file)
    if (options?.colaboradorId) {
      formData.append('colaborador_id', options.colaboradorId)
    }

    const { data } = await uploadHttp.post<unknown>('/incapacidades/upload', formData, {
      signal: options?.signal,
      onUploadProgress: (evt) => {
        if (evt.total != null && options?.onProgress) {
          const percent = Math.round((evt.loaded * 100) / evt.total)
          options.onProgress(percent)
        }
      },
    })
    return data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(messageFromAxiosError(err))
    }
    if (err instanceof Error) {
      throw err
    }
    throw new Error('No se pudo completar la carga. Intenta de nuevo.')
  }
}
