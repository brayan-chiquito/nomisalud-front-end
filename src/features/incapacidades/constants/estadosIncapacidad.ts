/**
 * Estados válidos para el query `estado` en GET `/incapacidades` (API).
 * @see docs/README.md
 */
export const INCAPACIDAD_ESTADOS_FILTRO = [
  { value: 'recibida', label: 'Recibida' },
  { value: 'procesando_ia', label: 'Procesando IA' },
  { value: 'en_verificacion', label: 'En verificación' },
  { value: 'inconsistencia_detectada', label: 'Inconsistencia detectada' },
  { value: 'doc_incompleta', label: 'Doc. incompleta' },
  { value: 'transcrita', label: 'Transcrita' },
  { value: 'cobrada', label: 'Cobrada' },
  { value: 'rechazada', label: 'Rechazada' },
  { value: 'pagada', label: 'Pagada' },
] as const

export type IncapacidadEstadoFiltro = (typeof INCAPACIDAD_ESTADOS_FILTRO)[number]['value']
