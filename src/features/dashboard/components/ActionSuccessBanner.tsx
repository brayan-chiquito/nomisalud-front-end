import { CircleCheck, X } from 'lucide-react'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { messageForActionSuccess, type ActionSuccessKind } from '../types/dashboardNavigation'

export type ActionSuccessBannerProps = Readonly<{
  kind: ActionSuccessKind
  onDismiss: () => void
}>

export function ActionSuccessBanner({ kind, onDismiss }: ActionSuccessBannerProps) {
  return (
    <div
      className="mb-4 flex items-start gap-2.5 rounded-xl border border-success/20 bg-success-light px-4 py-3 animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />
      <p className="min-w-0 flex-1 text-sm text-success-text">{messageForActionSuccess(kind)}</p>
      <button
        type="button"
        onClick={onDismiss}
        className={buttonClassName('icon', 'text-success hover:bg-success/10')}
        aria-label="Cerrar aviso"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}
