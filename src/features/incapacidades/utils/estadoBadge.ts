import { INCAPACIDAD_ESTADOS_FILTRO } from '../constants/estadosIncapacidad'

const BADGE_BY_ESTADO: Readonly<Record<string, string>> = {
  recibida: 'bg-blue-100 text-blue-700',
  procesando_ia: 'bg-sky-100 text-sky-800',
  en_verificacion: 'bg-amber-100 text-amber-700',
  doc_incompleta: 'bg-orange-100 text-orange-800',
  transcrita: 'bg-violet-100 text-violet-700',
  cobrada: 'bg-emerald-100 text-emerald-800',
  rechazada: 'bg-red-100 text-red-700',
  pagada: 'bg-green-100 text-green-700',
}

export function labelEstadoIncapacidad(estado: string): string {
  const row = INCAPACIDAD_ESTADOS_FILTRO.find((e) => e.value === estado)
  return row?.label ?? estado
}

export function estadoBadgeClasses(estado: string): string {
  return BADGE_BY_ESTADO[estado] ?? 'bg-slate-100 text-slate-700'
}
