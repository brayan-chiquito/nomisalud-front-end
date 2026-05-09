import { useCallback, useId, useRef, useState } from 'react'
import { CloudUpload, FolderOpen } from 'lucide-react'

export type FileDropzoneProps = Readonly<{
  /** Valor del atributo `accept` del input (MIME y/o extensiones). */
  accept: string
  /** Tamaño máximo mostrado en la leyenda (MB). */
  maxSizeLabelMb: number
  selectedFile: File | null
  onFileSelected: (file: File | null) => void
  errorMessage?: string | null
  uploadProgress: number | null
  disabled?: boolean
  browseButtonLabel?: string
}>

/**
 * Zona dual: arrastrar y soltar + selección por clic (input file).
 */
export function FileDropzone({
  accept,
  maxSizeLabelMb,
  selectedFile,
  onFileSelected,
  errorMessage,
  uploadProgress,
  disabled = false,
  browseButtonLabel = 'O selecciona un archivo desde tu equipo',
}: FileDropzoneProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const applyFile = useCallback(
    (file: File | null) => {
      if (disabled) return
      onFileSelected(file)
    },
    [disabled, onFileSelected],
  )

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    e.target.value = ''
    applyFile(file)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (disabled) return
    const file = e.dataTransfer.files?.[0] ?? null
    applyFile(file)
  }

  const openPicker = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  const showProgress = uploadProgress !== null && uploadProgress < 100

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={onInputChange}
        disabled={disabled}
        aria-hidden
        tabIndex={-1}
      />

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (disabled) return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openPicker()
          }
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => openPicker()}
        className={`flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-blue-50 px-4 py-6 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          isDragging ? 'border-blue-500 bg-blue-100' : 'border-blue-200'
        } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        aria-disabled={disabled}
        aria-describedby={errorMessage ? `${inputId}-error` : undefined}
      >
        <CloudUpload className="h-8 w-8 text-blue-600" aria-hidden />
        <p className="text-center text-sm font-semibold text-slate-800">
          {selectedFile ? selectedFile.name : 'Arrastra tu documento aquí'}
        </p>
        <p className="text-center text-xs text-slate-400">
          PDF, JPG o PNG — hasta {maxSizeLabelMb} MB
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          openPicker()
        }}
        disabled={disabled}
        className="inline-flex items-center justify-center gap-1.5 self-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-[13px] text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FolderOpen className="h-3.5 w-3.5" aria-hidden />
        {browseButtonLabel}
      </button>

      {showProgress && (
        <div className="space-y-1" aria-live="polite">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-[width] duration-150"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-center text-xs text-slate-500">Subiendo… {uploadProgress}%</p>
        </div>
      )}

      {uploadProgress === 100 && (
        <p className="text-center text-xs font-medium text-emerald-600">Carga completada</p>
      )}

      {errorMessage ? (
        <p id={`${inputId}-error`} className="text-center text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
