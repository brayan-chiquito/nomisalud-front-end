import { cn } from '@/utils/cn'
import { labelUrgencia, normalizarUrgencia } from '@/features/incapacidades/utils/urgencia'

const BADGE_BY_URGENCIA: Readonly<Record<string, string>> = {
  rojo: 'bg-danger-light text-danger-text',
  amarillo: 'bg-warning-light text-warning-text',
  verde: 'bg-success-light text-success-text',
}

const DOT_BY_URGENCIA: Readonly<Record<string, string>> = {
  rojo: 'bg-danger',
  amarillo: 'bg-warning',
  verde: 'bg-success',
}

export type UrgenciaBadgeProps = Readonly<{
  urgencia: string | null | undefined
  className?: string
}>

/**
 * Indicador visual del semáforo de urgencia (verde / amarillo / rojo).
 */
export function UrgenciaBadge({ urgencia, className }: UrgenciaBadgeProps) {
  const nivel = normalizarUrgencia(urgencia)
  const texto = labelUrgencia(urgencia)

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 truncate rounded-badge px-2.5 py-1 text-xs font-medium',
        nivel
          ? (BADGE_BY_URGENCIA[nivel] ?? 'bg-gray-100 text-gray-600')
          : 'bg-gray-100 text-gray-500',
        className,
      )}
      title={texto}
    >
      <span
        className={cn(
          'h-2 w-2 shrink-0 rounded-full',
          nivel ? (DOT_BY_URGENCIA[nivel] ?? 'bg-gray-400') : 'bg-gray-300',
        )}
        aria-hidden
      />
      {texto}
    </span>
  )
}
