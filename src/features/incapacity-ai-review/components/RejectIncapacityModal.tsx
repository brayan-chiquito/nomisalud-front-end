import { useState } from 'react'
import type { ReactNode } from 'react'
import { X, CircleAlert, Ban, Loader2 } from 'lucide-react'

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-modal-title"
    >
      <div
        className="w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-xl"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h2 id="reject-modal-title" className="text-base font-semibold text-slate-800">
            Rechazar incapacidad
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 pt-5">
          <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />
            <p className="text-[13px] text-red-600">
              Esta acción no se puede deshacer. El colaborador será notificado del rechazo.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-slate-700">
              Motivo (elige uno o escribe):
            </p>
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
            <label htmlFor="reject-notes" className="text-[13px] font-medium text-slate-700">
              Detalle del motivo <span className="text-red-600">*</span>
            </label>
            <textarea
              id="reject-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSubmitting}
              placeholder="Describe el motivo detallado del rechazo…"
              className="resize-none rounded-lg border border-slate-300 bg-white px-3 py-3 text-[13px] text-slate-800 placeholder:text-slate-400 disabled:bg-slate-50"
            />
          </div>

          {mergedError ? (
            <p className="text-[13px] text-red-600" role="alert">
              {mergedError}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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
    ? 'border-2 border-blue-600 bg-blue-50'
    : 'border border-slate-200 bg-white'
  const dot: ReactNode = <RadioDot highlighted={Boolean(highlighted)} selected={selected} />

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-[13px] ${border} ${
        highlighted ? 'font-medium text-slate-900' : 'font-normal text-slate-700'
      } hover:opacity-95`}
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
  const ring = <span className="h-4 w-4 rounded-full border-2 border-slate-300 bg-white" />
  if (selected && highlighted) {
    return (
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      </span>
    )
  }
  return ring
}
