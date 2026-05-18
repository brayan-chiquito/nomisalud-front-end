import { labelEstadoIncapacidad } from '@/features/incapacidades/utils/estadoBadge'
import { cn } from '@/utils/cn'

const BADGE_BY_ESTADO: Readonly<Record<string, string>> = {
  recibida: 'bg-gray-100 text-gray-600',
  procesando_ia: 'bg-info-light text-info-text',
  en_verificacion: 'bg-primary-100 text-primary-800',
  doc_incompleta: 'bg-warning-light text-warning-text',
  transcrita: 'bg-neutral-light text-neutral-text',
  cobrada: 'bg-primary-50 text-primary-700',
  pagada: 'bg-success-light text-success-text',
  rechazada: 'bg-danger-light text-danger-text',
}

export type StatusBadgeProps = Readonly<{
  estado: string
  className?: string
}>

export function StatusBadge({ estado, className }: StatusBadgeProps) {
  const showPing = estado === 'procesando_ia'

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 truncate rounded-badge px-2.5 py-1 text-xs font-medium',
        BADGE_BY_ESTADO[estado] ?? 'bg-gray-100 text-gray-600',
        className,
      )}
      title={labelEstadoIncapacidad(estado)}
    >
      {showPing ? (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-info animate-ping-slow" aria-hidden />
      ) : null}
      {labelEstadoIncapacidad(estado)}
    </span>
  )
}
