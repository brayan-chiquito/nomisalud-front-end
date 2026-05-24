import { http } from '@/services/http'
import type { AuditoriaAccesosListResponse } from '../types/auditoriaAcceso'

export const AUDITORIA_PAGE_SIZE = 50

export type ListAuditoriaAccesosParams = Readonly<{
  page?: number
  page_size?: number
  /** Filtro exacto por UUID. */
  user_id?: string
  /** Búsqueda por correo o nombre (alias API: `q`). */
  usuario?: string
  q?: string
  accion?: string
  fecha_desde?: string
  fecha_hasta?: string
  signal?: AbortSignal
}>

function buildQuery(
  params: Omit<ListAuditoriaAccesosParams, 'signal'>,
): Record<string, string | number> {
  const q: Record<string, string | number> = {
    page: params.page ?? 1,
    page_size: params.page_size ?? AUDITORIA_PAGE_SIZE,
  }
  const userId = params.user_id?.trim()
  if (userId) q.user_id = userId
  const usuario = params.usuario?.trim() || params.q?.trim()
  if (usuario && usuario.length >= 2) q.q = usuario
  const accion = params.accion?.trim()
  if (accion) q.accion = accion
  if (params.fecha_desde?.trim()) q.fecha_desde = params.fecha_desde.trim()
  if (params.fecha_hasta?.trim()) q.fecha_hasta = params.fecha_hasta.trim()
  return q
}

export async function listAuditoriaAccesos(
  params: ListAuditoriaAccesosParams = {},
): Promise<AuditoriaAccesosListResponse> {
  const { signal, ...rest } = params
  const { data } = await http.get<AuditoriaAccesosListResponse>('/auditoria/accesos', {
    params: buildQuery(rest),
    signal,
  })
  return data
}
