/** Rol con acceso solo a pagos y conciliación (SCRUM-200/201). */
export const ROLE_CONTABILIDAD = 'contabilidad'

/** Inicio del módulo financiero tras login o acceso denegado. */
export const FINANZAS_HOME_PATH = '/dashboard/conciliacion'

export const ROUTES_PAGOS = '/dashboard/pagos'
export const ROUTES_CONCILIACION = '/dashboard/conciliacion'

/** Roles con acceso a pagos y conciliación (`docs/README.md`, SCRUM-201). */
export const ROLES_MODULO_FINANZAS = [
  'admin',
  'auxiliar_rrhh',
  'coordinador_rrhh',
  ROLE_CONTABILIDAD,
] as const

export function isContabilidadRole(role: string | undefined): boolean {
  return role?.trim().toLowerCase() === ROLE_CONTABILIDAD
}

/** Redirección cuando el usuario no puede acceder a la ruta solicitada. */
export function accessDeniedRedirectForRole(
  role: string | undefined,
  explicitRedirect?: string,
): string {
  if (explicitRedirect) return explicitRedirect
  if (isContabilidadRole(role)) return FINANZAS_HOME_PATH
  return '/login'
}
