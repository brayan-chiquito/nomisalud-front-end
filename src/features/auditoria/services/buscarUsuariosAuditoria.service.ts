import axios from 'axios'
import { listUsuariosAdmin } from '@/features/admin/services/usuariosAdmin.service'
import { buscarColaboradores } from '@/features/recepcion/services/buscarColaboradores.service'
import {
  pickUniqueUsuarioAuditoriaOption,
  usuarioAuditoriaOptionLabel,
  type UsuarioAuditoriaOption,
} from '../utils/auditoriaUsuarioSearch'
import { isUuid } from '@/utils/uuid'

export type BuscarUsuariosAuditoriaParams = Readonly<{
  q: string
  /** Si true, incluye `GET /admin/usuarios` (solo rol admin). */
  includeAdminDirectory?: boolean
  signal?: AbortSignal
}>

function mergeUsuarioOptions(
  target: Map<string, UsuarioAuditoriaOption>,
  id: string,
  email: string,
  nombre?: string | null,
): void {
  const trimmedId = id.trim()
  const trimmedEmail = email.trim()
  if (!trimmedId || target.has(trimmedId)) return
  target.set(trimmedId, {
    id: trimmedId,
    email: trimmedEmail,
    nombre: nombre?.trim() || undefined,
    label: usuarioAuditoriaOptionLabel(trimmedEmail, nombre),
  })
}

export async function buscarUsuariosAuditoria(
  params: BuscarUsuariosAuditoriaParams,
): Promise<readonly UsuarioAuditoriaOption[]> {
  const q = params.q.trim()
  if (q.length < 2) return []

  const signal = params.signal
  const byId = new Map<string, UsuarioAuditoriaOption>()

  try {
    const colaboradores = await buscarColaboradores({ q, limit: 15, signal })
    for (const row of colaboradores) {
      mergeUsuarioOptions(byId, row.id, row.email, row.nombre_completo)
    }
  } catch (e) {
    if (axios.isCancel(e)) throw e
  }

  if (params.includeAdminDirectory) {
    try {
      const res = await listUsuariosAdmin({ q, page: 1, page_size: 15, signal })
      for (const row of res.items) {
        mergeUsuarioOptions(byId, row.id, row.email, row.nombre_completo)
      }
    } catch (e) {
      if (axios.isCancel(e)) throw e
    }
  }

  const lower = q.toLowerCase()
  return [...byId.values()]
    .filter(
      (o) =>
        o.email.toLowerCase().includes(lower) ||
        (o.nombre?.toLowerCase().includes(lower) ?? false) ||
        o.label.toLowerCase().includes(lower),
    )
    .sort((a, b) => a.label.localeCompare(b.label, 'es'))
}

export type ResolveAuditoriaUserIdResult = Readonly<{
  userId?: string
  error?: string
}>

const MULTIPLE_USERS_MSG =
  'Hay varios usuarios con ese texto. Elige uno de las sugerencias del listado.'
const NOT_FOUND_MSG =
  'No se encontró un usuario con ese correo o nombre. Prueba el correo completo o elige una sugerencia.'

export async function resolveAuditoriaUserId(
  term: string,
  includeAdminDirectory: boolean,
  signal?: AbortSignal,
): Promise<ResolveAuditoriaUserIdResult> {
  const trimmed = term.trim()
  if (!trimmed) return {}
  if (isUuid(trimmed)) return { userId: trimmed }

  const options = await buscarUsuariosAuditoria({
    q: trimmed,
    includeAdminDirectory,
    signal,
  })
  if (signal?.aborted) return {}

  const unique = pickUniqueUsuarioAuditoriaOption(options, trimmed)
  if (unique) return { userId: unique.id }

  if (options.length > 1) return { error: MULTIPLE_USERS_MSG }
  return { error: NOT_FOUND_MSG }
}
