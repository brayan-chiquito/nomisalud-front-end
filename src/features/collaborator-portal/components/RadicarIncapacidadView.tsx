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
import { resolveIncapacidadIdAfterUpload } from '@/features/incapacidades/services/resolveIncapacidadIdAfterUpload.service'
import { useAuth } from '@/features/auth/context/AuthContext'
import { UserProfileMenu } from '@/components/UserProfileMenu'
import { Card } from '@/components/ui/Card'
import { buttonClassName, labelClassName } from '@/components/ui/buttonStyles'
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

  const headerName =
    user?.email
      ?.split('@')[0]
      ?.replaceAll('.', ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) ?? 'Colaborador'
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
        // RRHH/admin: pasar colaboradorId cuando la UI permita elegir colaborador
      })
      setUploadProgress(100)
      const incapacidadId = await resolveIncapacidadIdAfterUpload(data)
      const state = { uploadResponse: data, fileName: file.name }
      if (incapacidadId) {
        navigate(`/portal/mi-tramite/${encodeURIComponent(incapacidadId)}`, { state })
      } else {
        setServerError(
          'El documento se cargó, pero no se pudo abrir la revisión automáticamente. Abre tu trámite desde Mi trámite en unos segundos.',
        )
        navigate('/portal/mi-tramite', { state })
      }
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
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="Nomisalud" className="h-8 w-8 object-contain" />
          <span className="text-sm font-semibold text-gray-900">Nomisalud</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-400 sm:inline">{headerName}</span>
          <UserProfileMenu
            userName={headerName}
            companyName="Portal colaborador"
            avatarInitials={headerInitials}
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 py-8">
        <div className="flex items-center gap-3">
          <Link
            to="/portal/mi-tramite"
            className={buttonClassName('secondary', 'gap-1.5 py-1.5 text-[13px]')}
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Volver
          </Link>
          <h1 className="text-[22px] font-semibold tracking-tight text-gray-900">
            Radicar nueva incapacidad
          </h1>
        </div>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <h2 className="text-base font-semibold text-gray-900">
              Sube el documento de incapacidad
            </h2>
            <span className="rounded-badge bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800">
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

            <div className="h-px w-full bg-gray-100" />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FieldSelect label="Tipo de incapacidad" placeholder="Seleccionar tipo..." />
              <FieldSelect label="Entidad EPS/ARL" placeholder="Seleccionar entidad..." />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FieldDate label="Fecha de inicio" placeholder="DD/MM/AAAA" />
              <FieldDate label="Fecha de fin" placeholder="DD/MM/AAAA" />
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary-50 px-3.5 py-2.5">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-600" aria-hidden />
              <p className="text-xs text-primary-800">
                La IA extraerá automáticamente los datos del documento. Podrás revisar y corregir
                antes de confirmar.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-6 pb-6 pt-4">
            <Link to="/portal/mi-tramite" className={buttonClassName('secondary')}>
              Cancelar
            </Link>
            <button
              type="button"
              onClick={() => void handleContinue()}
              disabled={!canSubmit}
              className={buttonClassName('primary', 'gap-2 px-7 py-3')}
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
        </Card>
      </main>
    </div>
  )
}

type FieldSelectProps = Readonly<{ label: string; placeholder: string }>

function FieldSelect({ label, placeholder }: FieldSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className={labelClassName}>{label}</span>
      <button
        type="button"
        className="flex h-11 items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 text-left text-[13px] text-gray-400"
      >
        {placeholder}
        <ChevronDown className="h-3.5 w-3.5 text-gray-400" aria-hidden />
      </button>
    </div>
  )
}

type FieldDateProps = Readonly<{ label: string; placeholder: string }>

function FieldDate({ label, placeholder }: FieldDateProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className={labelClassName}>{label}</span>
      <div className="flex h-11 items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 text-[13px] text-gray-400">
        <span>{placeholder}</span>
        <Calendar className="h-3.5 w-3.5 text-gray-400" aria-hidden />
      </div>
    </div>
  )
}
