import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

export type ListFetchIndicatorProps = Readonly<{
  active: boolean
  label?: string
  className?: string
}>

/** Barra de progreso indeterminada bajo filtros mientras el listado se actualiza. */
export function ListFetchIndicator({
  active,
  label = 'Actualizando listado…',
  className,
}: ListFetchIndicatorProps) {
  if (!active) return null

  return (
    <div
      className={cn(
        'flex items-center gap-2 border-b border-primary/15 bg-primary-50/80 px-5 py-2 text-xs text-primary sm:px-6',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden />
      <span>{label}</span>
    </div>
  )
}
