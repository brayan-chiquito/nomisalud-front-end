import type { ReactNode } from 'react'
import { Loader2, X } from 'lucide-react'
import { buttonClassName } from '@/components/ui/buttonStyles'

export type AdminDialogProps = Readonly<{
  isOpen: boolean
  titleId: string
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  isSubmitting?: boolean
}>

/** Diálogo modal reutilizable (gestión admin). */
export function AdminDialog({
  isOpen,
  titleId,
  title,
  onClose,
  children,
  footer,
  isSubmitting = false,
}: AdminDialogProps) {
  if (!isOpen) return null

  return (
    <dialog
      open
      className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none border-0 bg-gray-900/50 p-4 backdrop:bg-gray-900/50 open:flex open:items-center open:justify-center"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault()
        if (!isSubmitting) onClose()
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-card border border-gray-200/60 bg-white shadow-card">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 id={titleId} className="text-base font-semibold text-gray-900">
            {title}
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
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer ? (
          <div className="flex shrink-0 justify-end gap-2 border-t border-gray-100 px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </dialog>
  )
}

export function AdminDialogSubmitButton({
  label,
  isSubmitting,
  disabled,
  form,
}: Readonly<{
  label: string
  isSubmitting: boolean
  disabled?: boolean
  /** Id del formulario cuando el botón está fuera del `<form>`. */
  form?: string
}>) {
  return (
    <button
      type="submit"
      form={form}
      disabled={isSubmitting || disabled}
      className={buttonClassName('primary')}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Guardando…
        </>
      ) : (
        label
      )}
    </button>
  )
}
