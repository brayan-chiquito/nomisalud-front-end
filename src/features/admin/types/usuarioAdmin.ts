/** Rol de usuario en la API (`/admin/usuarios`). */
export type UsuarioAdminRole =
  | 'colaborador'
  | 'recepcion'
  | 'auxiliar_rrhh'
  | 'coordinador_rrhh'
  | 'contabilidad'
  | 'admin'

export type UsuarioAdmin = Readonly<{
  id: string
  email: string
  role: UsuarioAdminRole
  nombre_completo: string | null
  tipo_documento: string | null
  numero_documento: string | null
  area: string | null
  cargo: string | null
  eps_afiliacion: string | null
  arl_afiliacion: string | null
  activo: boolean
  created_at: string
}>

export type UsuariosAdminListResponse = Readonly<{
  items: readonly UsuarioAdmin[]
  total: number
  page: number
  page_size: number
  pages: number
}>

export type ListUsuariosAdminParams = Readonly<{
  page?: number
  page_size?: number
  role?: string
  activo?: boolean
  q?: string
  signal?: AbortSignal
}>

export type CreateUsuarioAdminPayload = Readonly<{
  email: string
  password: string
  role: UsuarioAdminRole
  nombre_completo?: string
  tipo_documento?: string
  numero_documento?: string
  area?: string
  cargo?: string
  eps_afiliacion?: string
  arl_afiliacion?: string
  activo?: boolean
}>

export type UpdateUsuarioAdminPayload = Readonly<{
  email?: string
  role?: UsuarioAdminRole
  nombre_completo?: string
  tipo_documento?: string
  numero_documento?: string
  area?: string
  cargo?: string
  eps_afiliacion?: string
  arl_afiliacion?: string
  activo?: boolean
}>

export type ChangeOwnPasswordPayload = Readonly<{
  password_actual: string
  password_nueva: string
}>
