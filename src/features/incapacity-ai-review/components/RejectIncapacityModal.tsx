import type { ReactNode } from 'react'
import { X, CircleAlert, Ban } from 'lucide-react'

export interface RejectIncapacityModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Modal "Rechazar incapacidad" — motivos y comentario.
 * TODO: POST rechazo al backend con motivoId + notas.
 * TODO: invalidar queries / redirigir tras éxito.
 */
export function RejectIncapacityModal({ isOpen, onClose }: RejectIncapacityModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-modal-title"
    >
      {/* TODO: cerrar al hacer clic en backdrop si el diseño lo permite */}
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
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
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
              Selecciona el motivo de rechazo:
            </p>
            <RadioOption
              label="Documento ilegible o deteriorado"
              selected={false}
              onSelect={() => {
                /* TODO: setMotivoId */
              }}
            />
            <RadioOption
              label="Datos no coinciden con el documento"
              selected
              highlighted
              onSelect={() => {
                /* TODO: setMotivoId */
              }}
            />
            <RadioOption
              label="Incapacidad ya vencida"
              selected={false}
              onSelect={() => {
                /* TODO: setMotivoId */
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5 pb-1">
            <label htmlFor="reject-notes" className="text-[13px] font-medium text-slate-700">
              Comentario adicional (opcional):
            </label>
            <textarea
              id="reject-notes"
              rows={3}
              readOnly
              placeholder="Escribe el motivo detallado..."
              className="resize-none rounded-lg border border-slate-300 bg-gray-50 px-3 py-3 text-[13px] text-slate-800 placeholder:text-slate-400"
            />
            {/* TODO: quitar readOnly y enlazar a estado / react-hook-form */}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            <Ban className="h-4 w-4" aria-hidden />
            Confirmar rechazo
          </button>
          {/* TODO: onClick → llamada API y manejo de loading / error */}
        </div>
      </div>
    </div>
  )
}

function RadioOption({
  label,
  selected,
  highlighted,
  onSelect,
}: {
  label: string
  selected: boolean
  highlighted?: boolean
  onSelect: () => void
}) {
  const border = highlighted
    ? 'border-2 border-blue-600 bg-blue-50'
    : 'border border-slate-200 bg-white'
  const dot: ReactNode = selected ? (
    highlighted ? (
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      </span>
    ) : (
      <span className="h-4 w-4 rounded-full border-2 border-slate-300 bg-white" />
    )
  ) : (
    <span className="h-4 w-4 rounded-full border-2 border-slate-300 bg-white" />
  )

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
