import { useState } from 'react'
import type { ReactNode } from 'react'
import { X, CircleAlert, Ban, Loader2 } from 'lucide-react'
import { buttonClassName, inputClassName, labelClassName } from '@/components/ui/buttonStyles'
import { cn } from '@/utils/cn'

export type RejectIncapacityModalProps = Readonly<{
  isOpen: boolean
  onClose: () => void
  /** Devuelve true si el rechazo se aplicó en el servidor. */
  onConfirm: (motivo: string) => Promise<boolean>
  isSubmitting?: boolean
  error?: string | null
}>

const PRESETS = [
  'Documento ilegible o deteriorado',
  'Datos no coinciden con el documento',
  'Incapacidad ya vencida',
] as const

/**
 * Modal de rechazo — motivo obligatorio; integra `PUT /incapacidades/{id}/verificar` vía `onConfirm`.
 */
export function RejectIncapacityModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  error = null,
}: RejectIncapacityModalProps) {
  const [preset, setPreset] = useState<(typeof PRESETS)[number] | null>(null)
  const [notes, setNotes] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  if (!isOpen) return null

  const motivoCompuesto = [preset, notes.trim()].filter(Boolean).join('. ').trim()
  const canSubmit = motivoCompuesto.length >= 3 && !isSubmitting

  const handleConfirm = async () => {
    setLocalError(null)
    if (!canSubmit) {
      setLocalError('Describe el motivo del rechazo (mínimo 3 caracteres).')
      return
    }
    const ok = await onConfirm(motivoCompuesto)
    if (ok) onClose()
  }

  const mergedError = localError || error

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-modal-title"
    >
      <div className="w-full max-w-[520px] overflow-hidden rounded-card border border-gray-200/60 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 id="reject-modal-title" className="text-base font-semibold text-gray-900">
            Rechazar incapacidad
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

        <div className="flex flex-col gap-4 px-6 pt-5">
          <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-light p-3">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />
            <p className="text-sm text-danger-text">
              Esta acción no se puede deshacer. El colaborador será notificado del rechazo.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-gray-700">Motivo (elige uno o escribe):</p>
            {PRESETS.map((label) => (
              <RadioOption
                key={label}
                label={label}
                selected={preset === label}
                highlighted={preset === label}
                onSelect={() => setPreset(label)}
              />
            ))}
          </div>

          <div className="flex flex-col gap-1.5 pb-1">
            <label htmlFor="reject-notes" className={labelClassName}>
              Detalle del motivo <span className="text-danger">*</span>
            </label>
            <textarea
              id="reject-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSubmitting}
              placeholder="Describe el motivo detallado del rechazo…"
              className={cn(inputClassName, 'h-auto resize-none py-3')}
            />
          </div>

          {mergedError ? (
            <p className="text-sm text-danger-text" role="alert">
              {mergedError}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6 pt-4">
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
            onClick={() => void handleConfirm()}
            disabled={!canSubmit}
            className={buttonClassName('danger', 'gap-2')}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Ban className="h-4 w-4" aria-hidden />
            )}
            Confirmar rechazo
          </button>
        </div>
      </div>
    </div>
  )
}

type RadioOptionProps = Readonly<{
  label: string
  selected: boolean
  highlighted?: boolean
  onSelect: () => void
}>

function RadioOption({ label, selected, highlighted, onSelect }: RadioOptionProps) {
  const border = highlighted
    ? 'border-2 border-primary bg-primary-50'
    : 'border border-gray-200 bg-white'
  const dot: ReactNode = <RadioDot highlighted={Boolean(highlighted)} selected={selected} />

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-sm transition-all duration-150 hover:bg-gray-50/80',
        border,
        highlighted ? 'font-medium text-gray-900' : 'font-normal text-gray-700',
      )}
    >
      {dot}
      {label}
    </button>
  )
}

type RadioDotProps = Readonly<{
  selected: boolean
  highlighted: boolean
}>

function RadioDot({ selected, highlighted }: RadioDotProps) {
  const ring = <span className="h-4 w-4 rounded-full border-2 border-gray-300 bg-white" />
  if (selected && highlighted) {
    return (
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-600">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      </span>
    )
  }
  return ring
}
