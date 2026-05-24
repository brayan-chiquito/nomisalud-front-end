import axios from 'axios'
import { messageFromHttpError } from '@/features/incapacity-ai-review/utils/httpErrorMessage'

const DEFAULT_MESSAGE = 'No se pudo actualizar el estado del trámite. Intenta de nuevo.'

const STATUS_MESSAGES: Readonly<Record<number, string>> = {
  400: 'El trámite ya se encuentra en el estado solicitado.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'Incapacidad no encontrada.',
  409: 'Transición no permitida: el trámite debe estar en estado transcrita.',
  422: 'Los datos enviados no son válidos.',
}

function hasApiDetail(error: import('axios').AxiosError): boolean {
  const d = error.response?.data
  return Boolean(
    d &&
    typeof d === 'object' &&
    'detail' in d &&
    typeof (d as { detail: unknown }).detail === 'string',
  )
}

/** Mensajes claros para errores de `PATCH /incapacidades/{id}/estado` (SCRUM-187-2). */
export function messageFromPatchEstadoError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (hasApiDetail(error)) return messageFromHttpError(error)
    const status = error.response?.status
    if (status !== undefined && status in STATUS_MESSAGES) {
      return STATUS_MESSAGES[status]
    }
    return messageFromHttpError(error) || DEFAULT_MESSAGE
  }
  if (error instanceof Error) return error.message
  return DEFAULT_MESSAGE
}
