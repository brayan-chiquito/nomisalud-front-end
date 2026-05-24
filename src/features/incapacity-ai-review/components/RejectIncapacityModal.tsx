import { useState } from 'react'
import type { ReactNode } from 'react'
import { X, CircleAlert, Ban, Loader2, Plus, Trash2, FileWarning } from 'lucide-react'
import { buttonClassName, inputClassName, labelClassName } from '@/components/ui/buttonStyles'
import { cn } from '@/utils/cn'

export type RejectModalSubmit =
  | Readonly<{ type: 'rechazar'; motivo: string }>
  | Readonly<{
      type: 'documentacion_faltante'
      documentos: readonly string[]
      observacion?: string
    }>

export type RejectIncapacityModalProps = Readonly<{
  isOpen: boolean
  onClose: () => void
  onConfirm: (payload: RejectModalSubmit) => Promise<boolean>
  isSubmitting?: boolean
  error?: string | null
}>

const RECHAZO_PRESETS = [
  'Documento ilegible o deteriorado',
  'Datos no coinciden con el documento',
  'Incapacidad ya vencida',
] as const

const DOCUMENTACION_FALTANTE_OPTION = 'Documentación faltante'

type MotivoMode = 'rechazo' | 'documentacion_faltante'

function emptyDocumentoRow(): string {
  return ''
}

/**
 * Modal RRHH: rechazo definitivo (`PUT verificar` rechazar) o solicitud de documentos (`PUT documentacion-faltante`).
 */
export function RejectIncapacityModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  error = null,
}: RejectIncapacityModalProps) {
  const [mode, setMode] = useState<MotivoMode>('rechazo')
  const [preset, setPreset] = useState<(typeof RECHAZO_PRESETS)[number] | null>(null)
  const [notes, setNotes] = useState('')
  const [documentoRows, setDocumentoRows] = useState<string[]>([emptyDocumentoRow()])
  const [observacionDoc, setObservacionDoc] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  if (!isOpen) return null

  const motivoCompuesto = [preset, notes.trim()].filter(Boolean).join('. ').trim()
  const documentosNormalizados = documentoRows.map((d) => d.trim()).filter(Boolean)
  const canSubmitRechazo = motivoCompuesto.length >= 3 && !isSubmitting
  const allDocRowsFilled = documentoRows.every((row) => row.trim().length > 0)
  const canSubmitDocumentacion =
    documentosNormalizados.length > 0 && allDocRowsFilled && !isSubmitting
  const canSubmit = mode === 'rechazo' ? canSubmitRechazo : canSubmitDocumentacion

  const selectDocumentacionMode = () => {
    setMode('documentacion_faltante')
    setPreset(null)
    setNotes('')
  }

  const selectRechazoPreset = (label: (typeof RECHAZO_PRESETS)[number]) => {
    setMode('rechazo')
    setPreset(label)
  }

  const updateDocumentoRow = (index: number, value: string) => {
    setDocumentoRows((rows) => rows.map((row, i) => (i === index ? value : row)))
  }

  const addDocumentoRow = () => {
    setDocumentoRows((rows) => [...rows, emptyDocumentoRow()])
  }

  const removeDocumentoRow = (index: number) => {
    setDocumentoRows((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== index)))
  }

  const handleConfirm = async () => {
    setLocalError(null)
    if (mode === 'rechazo') {
      if (!canSubmitRechazo) {
        setLocalError('Describe el motivo del rechazo (mínimo 3 caracteres).')
        return
      }
      const ok = await onConfirm({ type: 'rechazar', motivo: motivoCompuesto })
      if (ok) onClose()
      return
    }

    if (!allDocRowsFilled) {
      setLocalError('Completa cada documento o elimina las filas vacías.')
      return
    }
    if (documentosNormalizados.length === 0) {
      setLocalError('Agrega al menos un documento faltante.')
      return
    }

    const ok = await onConfirm({
      type: 'documentacion_faltante',
      documentos: documentosNormalizados,
      observacion: observacionDoc.trim() || undefined,
    })
    if (ok) onClose()
  }

  const mergedError = localError || error
  const isDocMode = mode === 'documentacion_faltante'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-[520px] overflow-hidden overflow-y-auto rounded-card border border-gray-200/60 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 id="reject-modal-title" className="text-base font-semibold text-gray-900">
            {isDocMode ? 'Solicitar documentación' : 'Rechazar incapacidad'}
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
          <div
            className={cn(
              'flex items-start gap-2.5 rounded-lg border p-3',
              isDocMode ? 'border-warning/20 bg-warning-light' : 'border-danger/20 bg-danger-light',
            )}
          >
            {isDocMode ? (
              <FileWarning className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
            ) : (
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />
            )}
            <p className={cn('text-sm', isDocMode ? 'text-warning-text' : 'text-danger-text')}>
              {isDocMode
                ? 'El trámite pasará a Doc. incompleta. El colaborador verá cada documento pendiente en su portal y podrá cargarlos.'
                : 'Esta acción no se puede deshacer. El colaborador será notificado del rechazo.'}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-gray-700">Motivo:</p>
            {RECHAZO_PRESETS.map((label) => (
              <RadioOption
                key={label}
                label={label}
                selected={mode === 'rechazo' && preset === label}
                highlighted={mode === 'rechazo' && preset === label}
                onSelect={() => selectRechazoPreset(label)}
              />
            ))}
            <RadioOption
              label={DOCUMENTACION_FALTANTE_OPTION}
              selected={isDocMode}
              highlighted={isDocMode}
              onSelect={selectDocumentacionMode}
            />
          </div>

          {isDocMode ? (
            <div className="flex flex-col gap-3 pb-1">
              <p className="text-sm text-gray-600">
                Indica cada documento faltante en un campo aparte:
              </p>
              <ul className="flex flex-col gap-2">
                {documentoRows.map((value, index) => (
                  <li key={`doc-row-${index}`} className="flex items-center gap-2">
                    <label htmlFor={`doc-faltante-${index}`} className="sr-only">
                      Documento faltante {index + 1}
                    </label>
                    <input
                      id={`doc-faltante-${index}`}
                      type="text"
                      value={value}
                      onChange={(e) => updateDocumentoRow(index, e.target.value)}
                      disabled={isSubmitting}
                      placeholder={`Ej. Certificado médico ${index + 1}`}
                      className={cn(inputClassName, 'min-w-0 flex-1')}
                    />
                    <button
                      type="button"
                      onClick={() => removeDocumentoRow(index)}
                      disabled={isSubmitting || documentoRows.length <= 1}
                      className={buttonClassName('icon', 'shrink-0 text-gray-500')}
                      aria-label={`Quitar documento ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={addDocumentoRow}
                disabled={isSubmitting}
                className={buttonClassName('secondary', 'w-fit gap-1.5 text-sm')}
              >
                <Plus className="h-4 w-4" aria-hidden />
                Agregar otro documento
              </button>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="doc-observacion" className={labelClassName}>
                  Observación interna (opcional)
                </label>
                <input
                  id="doc-observacion"
                  type="text"
                  value={observacionDoc}
                  onChange={(e) => setObservacionDoc(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Nota de auditoría para RRHH…"
                  className={inputClassName}
                />
              </div>
            </div>
          ) : (
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
          )}

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
            className={buttonClassName(isDocMode ? 'primary' : 'danger', 'gap-2')}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : isDocMode ? (
              <FileWarning className="h-4 w-4" aria-hidden />
            ) : (
              <Ban className="h-4 w-4" aria-hidden />
            )}
            {isDocMode ? 'Solicitar documentación' : 'Confirmar rechazo'}
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
