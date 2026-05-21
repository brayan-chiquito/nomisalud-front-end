import { useState } from 'react'
import { CircleCheck, Loader2, X } from 'lucide-react'
import { buttonClassName, inputClassName, labelClassName } from '@/components/ui/buttonStyles'

export type MarcarCobradaModalProps = Readonly<{
  isOpen: boolean
  radicado: string
  onClose: () => void
  onConfirm: (observacion?: string) => Promise<boolean>
  isSubmitting?: boolean
  error?: string | null
}>

/**
 * Confirmación para `PATCH …/estado` con destino `cobrada` (SCRUM-187-2).
 */
export function MarcarCobradaModal({
  isOpen,
  radicado,
  onClose,
  onConfirm,
  isSubmitting = false,
  error = null,
}: MarcarCobradaModalProps) {
  const [observacion, setObservacion] = useState('')

  if (!isOpen) return null

  const handleSubmit = async () => {
    const ok = await onConfirm(observacion.trim() || undefined)
    if (ok) {
      setObservacion('')
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="marcar-cobrada-title"
    >
      <div className="w-full max-w-[480px] overflow-hidden rounded-card border border-gray-200/60 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 id="marcar-cobrada-title" className="text-base font-semibold text-gray-900">
            Marcar como cobrada
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className={buttonClassName('icon')}
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex items-start gap-2.5 rounded-lg border border-success/20 bg-success-light p-3">
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
            <p className="text-sm text-success-text">
              El trámite <span className="font-mono font-medium">{radicado}</span> pasará a estado
              cobrada y podrá incluirse en Registrar pago.
            </p>
          </div>

          <div>
            <label htmlFor="cobrada-observacion" className={labelClassName}>
              Observación (opcional)
            </label>
            <input
              id="cobrada-observacion"
              type="text"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              disabled={isSubmitting}
              placeholder="Ej.: Radicado EPS ref. 12345"
              className={inputClassName}
              maxLength={4000}
            />
          </div>

          {error ? (
            <p
              className="rounded-lg border border-danger/20 bg-danger-light px-3 py-2 text-sm text-danger-text"
              role="alert"
            >
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className={buttonClassName('secondary')}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              void handleSubmit()
            }}
            disabled={isSubmitting}
            className={buttonClassName('primary')}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Guardando…
              </>
            ) : (
              'Confirmar cobro'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
