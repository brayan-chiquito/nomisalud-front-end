import { http } from '@/services/http'
import type {
  ChangeOwnPasswordPayload,
  CreateUsuarioAdminPayload,
  ListUsuariosAdminParams,
  UpdateUsuarioAdminPayload,
  UsuarioAdmin,
  UsuariosAdminListResponse,
} from '../types/usuarioAdmin'

function buildListQuery(
  params: Omit<ListUsuariosAdminParams, 'signal'>,
): Record<string, string | number> {
  const q: Record<string, string | number> = {
    page: params.page ?? 1,
    page_size: params.page_size ?? 20,
  }
  if (params.role?.trim()) q.role = params.role.trim()
  if (params.activo === true) q.activo = 'true'
  if (params.activo === false) q.activo = 'false'
  if (params.q?.trim()) q.q = params.q.trim()
  return q
}

export async function listUsuariosAdmin(
  params: ListUsuariosAdminParams = {},
): Promise<UsuariosAdminListResponse> {
  const { signal, ...rest } = params
  const { data } = await http.get<UsuariosAdminListResponse>('/admin/usuarios', {
    params: buildListQuery(rest),
    signal,
  })
  return data
}

export async function getUsuarioAdmin(id: string, signal?: AbortSignal): Promise<UsuarioAdmin> {
  const { data } = await http.get<UsuarioAdmin>(`/admin/usuarios/${id}`, { signal })
  return data
}

export async function createUsuarioAdmin(
  payload: CreateUsuarioAdminPayload,
  signal?: AbortSignal,
): Promise<UsuarioAdmin> {
  const { data } = await http.post<UsuarioAdmin>('/admin/usuarios', payload, { signal })
  return data
}

export async function updateUsuarioAdmin(
  id: string,
  payload: UpdateUsuarioAdminPayload,
  signal?: AbortSignal,
): Promise<UsuarioAdmin> {
  const { data } = await http.put<UsuarioAdmin>(`/admin/usuarios/${id}`, payload, { signal })
  return data
}

export async function deactivateUsuarioAdmin(id: string, signal?: AbortSignal): Promise<void> {
  await http.delete(`/admin/usuarios/${id}`, { signal })
}

export async function resetUsuarioAdminPassword(
  id: string,
  password: string,
  signal?: AbortSignal,
): Promise<void> {
  await http.put(`/admin/usuarios/${id}/password`, { password }, { signal })
}

export async function changeOwnPassword(
  payload: ChangeOwnPasswordPayload,
  signal?: AbortSignal,
): Promise<void> {
  await http.put('/auth/password', payload, { signal })
}
