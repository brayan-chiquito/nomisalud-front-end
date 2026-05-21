import { http } from '@/services/http'
import type { PlazosEntidadListResponse } from '../types/plazoEntidad'

export async function listPlazosEntidad(signal?: AbortSignal): Promise<PlazosEntidadListResponse> {
  const { data } = await http.get<PlazosEntidadListResponse>('/admin/plazos-entidad', { signal })
  return data
}
