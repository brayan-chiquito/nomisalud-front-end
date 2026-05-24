import { http } from '@/services/http'
import type {
  CreatePlazoEntidadPayload,
  PlazoEntidadItem,
  PlazosEntidadListResponse,
  UpdatePlazoEntidadPayload,
} from '../types/plazoEntidad'

export async function listPlazosEntidad(signal?: AbortSignal): Promise<PlazosEntidadListResponse> {
  const { data } = await http.get<PlazosEntidadListResponse>('/admin/plazos-entidad', { signal })
  return data
}

export async function getPlazoEntidad(id: string, signal?: AbortSignal): Promise<PlazoEntidadItem> {
  const { data } = await http.get<PlazoEntidadItem>(`/admin/plazos-entidad/${id}`, { signal })
  return data
}

export async function createPlazoEntidad(
  payload: CreatePlazoEntidadPayload,
  signal?: AbortSignal,
): Promise<PlazoEntidadItem> {
  const { data } = await http.post<PlazoEntidadItem>('/admin/plazos-entidad', payload, { signal })
  return data
}

export async function updatePlazoEntidad(
  id: string,
  payload: UpdatePlazoEntidadPayload,
  signal?: AbortSignal,
): Promise<PlazoEntidadItem> {
  const { data } = await http.put<PlazoEntidadItem>(`/admin/plazos-entidad/${id}`, payload, {
    signal,
  })
  return data
}

export async function deletePlazoEntidad(id: string, signal?: AbortSignal): Promise<void> {
  await http.delete(`/admin/plazos-entidad/${id}`, { signal })
}
