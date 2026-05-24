import type { UsuarioAdminRole } from '../types/usuarioAdmin'

export const USUARIO_ADMIN_ROLES: readonly { value: UsuarioAdminRole; label: string }[] = [
  { value: 'colaborador', label: 'Colaborador' },
  { value: 'recepcion', label: 'Recepción' },
  { value: 'auxiliar_rrhh', label: 'Auxiliar RRHH' },
  { value: 'coordinador_rrhh', label: 'Coordinador RRHH' },
  { value: 'contabilidad', label: 'Contabilidad' },
  { value: 'admin', label: 'Administrador' },
] as const

export function labelUsuarioRole(role: string): string {
  const row = USUARIO_ADMIN_ROLES.find((r) => r.value === role)
  return row?.label ?? role
}

export function formatUsuarioFecha(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const USUARIOS_ADMIN_PAGE_SIZE = 20
