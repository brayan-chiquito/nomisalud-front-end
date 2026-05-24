import axios from 'axios'
import { isContabilidadRole } from './roleAccess'

/** Mensaje cuando contabilidad intenta APIs de documentos/RRHH (SCRUM-206). */
export const FINANCIAL_MODULE_ONLY_MESSAGE =
  'Tu rol solo tiene acceso al módulo financiero. Usa Pagos / Conciliación.'

/** Rutas HTTP que contabilidad no debe consumir en flujo normal. */
export const RESTRICTED_DOCUMENT_API_PREFIXES = ['/incapacidades', '/colaboradores'] as const

export function isRestrictedDocumentApiPath(url: string): boolean {
  const path = url.split('?')[0] ?? url
  return RESTRICTED_DOCUMENT_API_PREFIXES.some((prefix) => path.includes(prefix))
}

/** Fuente autorizada para radicados a liquidar (todos los roles en pagos). */
export const RADICADOS_DISPONIBLES_API_PATH = '/pagos/radicados-disponibles'

export function messageFromFinancialForbiddenError(
  error: unknown,
  role: string | undefined,
  requestUrl?: string,
): string | null {
  if (!isContabilidadRole(role)) return null
  if (!axios.isAxiosError(error) || error.response?.status !== 403) return null
  const url = requestUrl ?? (typeof error.config?.url === 'string' ? error.config.url : '')
  if (!url || !isRestrictedDocumentApiPath(url)) return null
  return FINANCIAL_MODULE_ONLY_MESSAGE
}
