import { http } from '@/services/http'
import type {
  DocumentacionFaltantePayload,
  DocumentacionFaltanteResponse,
  IncapacidadDetalle,
  PatchIncapacidadEstadoPayload,
  PatchIncapacidadEstadoResponse,
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

/** Registra documentos pendientes y pasa a `doc_incompleta` (RRHH). */
export async function registrarDocumentacionFaltante(
  id: string,
  payload: DocumentacionFaltantePayload,
  signal?: AbortSignal,
): Promise<DocumentacionFaltanteResponse> {
  const { data } = await http.put<DocumentacionFaltanteResponse>(
    `/incapacidades/${id}/documentacion-faltante`,
    payload,
    { signal },
  )
  return data
}

/** Avanza el trámite en la máquina de estados (p. ej. `en_verificacion` → `transcrita`). */
export async function patchIncapacidadEstado(
  id: string,
  payload: PatchIncapacidadEstadoPayload,
  signal?: AbortSignal,
): Promise<PatchIncapacidadEstadoResponse> {
  const { data } = await http.patch<PatchIncapacidadEstadoResponse>(
    `/incapacidades/${id}/estado`,
    payload,
    { signal },
  )
  return data
}
