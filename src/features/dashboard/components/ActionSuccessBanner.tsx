import { CircleCheck, X } from 'lucide-react'
import { messageForActionSuccess, type ActionSuccessKind } from '../types/dashboardNavigation'

export type ActionSuccessBannerProps = Readonly<{
  kind: ActionSuccessKind
  onDismiss: () => void
}>

export function ActionSuccessBanner({ kind, onDismiss }: ActionSuccessBannerProps) {
  return (
    <div
      className="mb-4 flex items-start gap-2.5 rounded-lg border border-green-200 bg-green-50 px-4 py-3"
      role="status"
      aria-live="polite"
    >
      <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden />
      <p className="min-w-0 flex-1 text-sm text-green-800">{messageForActionSuccess(kind)}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded p-1 text-green-700 hover:bg-green-100"
        aria-label="Cerrar aviso"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}
