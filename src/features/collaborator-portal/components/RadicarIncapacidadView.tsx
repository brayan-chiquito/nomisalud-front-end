import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown, Calendar, Info, ArrowRight, Loader2 } from 'lucide-react'
import logo from '@/assets/logo.png'
import { FileDropzone } from '@/components/ui/FileDropzone'
import {
  INCAPACITY_FILE_ACCEPT,
  INCAPACITY_MAX_BYTES,
  validateIncapacityFile,
} from '@/features/incapacidades/utils/validateIncapacityFile'
import { uploadIncapacityFile } from '@/features/incapacidades/services/uploadIncapacity.service'
import { useAuth } from '@/features/auth/context/AuthContext'

const MAX_MB = INCAPACITY_MAX_BYTES / (1024 * 1024)

/**
 * Vista "Radicar nueva incapacidad" — carga de documento vía POST `/incapacidades/upload`.
 * Los demás campos siguen como UI placeholder hasta que la API los requiera en el mismo u otros endpoints.
 */
export function RadicarIncapacidadView() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [file, setFile] = useState<File | null>(null)
  const [clientError, setClientError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const headerInitials =
    user?.email?.slice(0, 2).toUpperCase() ?? user?.id?.slice(0, 2).toUpperCase() ?? 'NS'

  const handleFileSelected = useCallback((next: File | null) => {
    setServerError(null)
    if (!next) {
      setFile(null)
      setClientError(null)
      setUploadProgress(null)
      return
    }
    const err = validateIncapacityFile(next)
    if (err) {
      setFile(null)
      setClientError(err.message)
      setUploadProgress(null)
      return
    }
    setFile(next)
    setClientError(null)
    setUploadProgress(null)
  }, [])

  const handleContinue = async () => {
    if (!file || isUploading) return
    setServerError(null)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const data = await uploadIncapacityFile(file, {
        onProgress: (p) => setUploadProgress(p),
        // TODO: si el rol es RRHH/admin y se elige colaborador, pasar colaboradorId
      })
      setUploadProgress(100)
      navigate('/incapacidad/revision-ia', { state: { uploadResponse: data, fileName: file.name } })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al subir el archivo.'
      setServerError(msg)
      setUploadProgress(null)
    } finally {
      setIsUploading(false)
    }
  }

  const dropzoneError = clientError ?? serverError
  const canSubmit = Boolean(file) && !isUploading

  return (
    <div className="flex min-h-screen flex-col bg-blue-50">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="Nomisalud" className="h-[30px] w-[30px] object-contain" />
          <span className="text-[15px] font-bold text-slate-800">Nomisalud</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{user?.email ?? 'Usuario'}</span>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-[13px] font-semibold text-white"
            aria-hidden
          >
            {headerInitials}
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center gap-5 px-8 py-8">
        <div className="flex w-full max-w-[680px] items-center gap-3">
          <Link
            to="/portal/mi-tramite"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Volver
          </Link>
          <h1 className="text-lg font-bold text-slate-800">Radicar nueva incapacidad</h1>
        </div>

        <section
          className="w-full max-w-[680px] overflow-hidden rounded-2xl bg-white shadow-md"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <h2 className="text-base font-semibold text-slate-800">
              Sube el documento de incapacidad
            </h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              Paso 1 de 2
            </span>
          </div>

          <div className="flex flex-col gap-4 p-6">
            <FileDropzone
              accept={INCAPACITY_FILE_ACCEPT}
              maxSizeLabelMb={MAX_MB}
              selectedFile={file}
              onFileSelected={handleFileSelected}
              errorMessage={dropzoneError}
              uploadProgress={uploadProgress}
              disabled={isUploading}
            />

            <div className="h-px w-full bg-slate-100" />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FieldSelect label="Tipo de incapacidad" placeholder="Seleccionar tipo..." />
              <FieldSelect label="Entidad EPS/ARL" placeholder="Seleccionar entidad..." />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FieldDate label="Fecha de inicio" placeholder="DD/MM/AAAA" />
              <FieldDate label="Fecha de fin" placeholder="DD/MM/AAAA" />
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3.5 py-2.5">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-600" aria-hidden />
              <p className="text-xs text-sky-800">
                La IA extraerá automáticamente los datos del documento. Podrás revisar y corregir
                antes de confirmar.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-50 px-6 pb-6 pt-4">
            <Link
              to="/portal/mi-tramite"
              className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </Link>
            <button
              type="button"
              onClick={() => void handleContinue()}
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Subiendo…
                </>
              ) : (
                <>
                  Continuar al resumen
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </>
              )}
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

function FieldSelect({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <button
        type="button"
        className="flex h-[42px] items-center justify-between rounded-lg border border-slate-300 bg-gray-50 px-3 text-left text-[13px] text-slate-400"
      >
        {placeholder}
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" aria-hidden />
      </button>
    </div>
  )
}

function FieldDate({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <div className="flex h-[42px] items-center justify-between rounded-lg border border-slate-300 bg-gray-50 px-3 text-[13px] text-slate-400">
        <span>{placeholder}</span>
        <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden />
      </div>
    </div>
  )
}
