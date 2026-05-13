import { http } from '@/services/http'
import type {
  IncapacidadDetalle,
  VerificarIncapacidadPayload,
  VerificarIncapacidadResponse,
} from '../types/incapacidadDetalle'

export async function getIncapacidadDetalle(
  id: string,
  signal?: AbortSignal,
): Promise<IncapacidadDetalle> {
  const { data } = await http.get<IncapacidadDetalle>(`/incapacidades/${id}`, { signal })
  return data
}

export async function fetchIncapacidadArchivoBlob(id: string, signal?: AbortSignal): Promise<Blob> {
  const { data } = await http.get<Blob>(`/incapacidades/${id}/archivo`, {
    responseType: 'blob',
    signal,
  })
  return data
}

export async function verificarIncapacidad(
  id: string,
  payload: VerificarIncapacidadPayload,
  signal?: AbortSignal,
): Promise<VerificarIncapacidadResponse> {
  const { data } = await http.put<VerificarIncapacidadResponse>(
    `/incapacidades/${id}/verificar`,
    payload,
    { signal },
  )
  return data
}
