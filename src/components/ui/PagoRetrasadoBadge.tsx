import { Clock } from 'lucide-react'
import { cn } from '@/utils/cn'

export type PagoRetrasadoBadgeProps = Readonly<{
  className?: string
}>

/** Badge de alerta cuando el job SCRUM-193 marcó `pago_retrasado` en el trámite. */
export function PagoRetrasadoBadge({ className }: PagoRetrasadoBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1 truncate rounded-badge bg-warning-light px-2.5 py-1 text-xs font-medium text-warning-text',
        className,
      )}
      title="Superó el plazo promedio de pago sin liquidar tras cobrada"
    >
      <Clock className="h-3 w-3 shrink-0" aria-hidden />
      Pago retrasado
    </span>
  )
}
