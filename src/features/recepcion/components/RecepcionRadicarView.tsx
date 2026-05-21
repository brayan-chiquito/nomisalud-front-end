import { useCallback, useState } from 'react'
import { ArrowRight, CheckCircle2, Info, Loader2 } from 'lucide-react'
import { FileDropzone } from '@/components/ui/FileDropzone'
import { ColaboradorAutocompleteInput } from '@/components/ui/ColaboradorAutocompleteInput'
import { Card } from '@/components/ui/Card'
import { buttonClassName, labelClassName } from '@/components/ui/buttonStyles'
import {
  INCAPACITY_FILE_ACCEPT,
  INCAPACITY_MAX_BYTES,
  validateIncapacityFile,
} from '@/features/incapacidades/utils/validateIncapacityFile'
import { uploadIncapacityFile } from '@/features/incapacidades/services/uploadIncapacity.service'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useColaboradorBuscar } from '@/hooks/useColaboradorBuscar'
import type { ColaboradorBusquedaItem } from '@/features/recepcion/types/colaboradorBusqueda'
import { RecepcionPortalShell } from './RecepcionPortalShell'

const MAX_MB = INCAPACITY_MAX_BYTES / (1024 * 1024)

function displayNameFromEmail(email: string | undefined): string {
  if (!email) return 'Usuario'
  const local = email.split('@')[0] ?? email
  return local.replace(/\./g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function initialsFromEmail(email: string | undefined, id: string | undefined): string {
  if (email && email.length >= 2) return email.slice(0, 2).toUpperCase()
  if (id && id.length >= 2) return id.slice(0, 2).toUpperCase()
  return 'NS'
}

export function RecepcionRadicarView() {
  const { user } = useAuth()

  const [colaboradorQuery, setColaboradorQuery] = useState('')
  const [colaboradorSeleccionado, setColaboradorSeleccionado] =
    useState<ColaboradorBusquedaItem | null>(null)
  const { items: sugerenciasColaborador, loading: buscandoColaborador } =
    useColaboradorBuscar(colaboradorQuery)

  const [file, setFile] = useState<File | null>(null)
  const [clientError, setClientError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [radicadoOk, setRadicadoOk] = useState<string | null>(null)
  const [ultimoColaboradorNombre, setUltimoColaboradorNombre] = useState<string | null>(null)

  const handleColaboradorQueryChange = useCallback((next: string) => {
    setColaboradorQuery(next)
    setColaboradorSeleccionado(null)
    setServerError(null)
  }, [])

  const handleColaboradorSelect = useCallback((item: ColaboradorBusquedaItem) => {
    setColaboradorSeleccionado(item)
    setServerError(null)
  }, [])

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

  const handleSubmit = async () => {
    if (!file || !colaboradorSeleccionado || isUploading) return
    setServerError(null)
    setRadicadoOk(null)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const nombreOk = colaboradorSeleccionado.nombre_completo
      const data = await uploadIncapacityFile(file, {
        colaboradorId: colaboradorSeleccionado.id,
        onProgress: (p) => setUploadProgress(p),
      })
      setUploadProgress(100)
      const payload = data as Record<string, unknown>
      const ref = payload.tramite_id ?? payload.incapacidad_id ?? payload.radicado
      setUltimoColaboradorNombre(nombreOk)
      setRadicadoOk(
        typeof ref === 'string' && ref.trim() ? ref : 'Documento registrado correctamente.',
      )
      setFile(null)
      setColaboradorQuery('')
      setColaboradorSeleccionado(null)
      setUploadProgress(null)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al subir el archivo.'
      setServerError(msg)
      setUploadProgress(null)
    } finally {
      setIsUploading(false)
    }
  }

  const dropzoneError = clientError ?? serverError
  const canSubmit = Boolean(file && colaboradorSeleccionado) && !isUploading

  return (
    <RecepcionPortalShell
      headerTitle="Radicar incapacidad"
      userName={displayNameFromEmail(user?.email)}
      userInitials={initialsFromEmail(user?.email, user?.id)}
    >
      <div className="mx-auto w-full max-w-2xl">
        {radicadoOk ? (
          <div
            className="mb-4 flex items-start gap-2 rounded-lg border border-success/30 bg-success-light px-4 py-3 text-sm text-success"
            role="status"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <p>
              Incapacidad radicada para{' '}
              <span className="font-medium">{ultimoColaboradorNombre ?? 'el colaborador'}</span>.
              {typeof radicadoOk === 'string' ? ` Referencia: ${radicadoOk}.` : null}
            </p>
          </div>
        ) : null}

        <Card className="overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="text-base font-semibold text-gray-900">Asociar colaborador</h2>
            <p className="mt-1 text-xs text-gray-500">
              Busca por nombre o número de documento antes de cargar el archivo.
            </p>
          </div>

          <div className="flex flex-col gap-4 p-6">
            <div className="flex flex-col gap-1.5">
              <span className={labelClassName}>Colaborador</span>
              <ColaboradorAutocompleteInput
                value={colaboradorQuery}
                onChange={handleColaboradorQueryChange}
                suggestions={sugerenciasColaborador}
                suggestionsLoading={buscandoColaborador}
                onSelect={handleColaboradorSelect}
              />
              {colaboradorSeleccionado ? (
                <p className="text-xs text-primary-700">
                  Seleccionado: {colaboradorSeleccionado.nombre_completo} (ID{' '}
                  {colaboradorSeleccionado.id.slice(0, 8)}…)
                </p>
              ) : (
                <p className="text-xs text-gray-400">Selecciona un colaborador de la lista.</p>
              )}
            </div>

            <div className="h-px w-full bg-gray-100" />

            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Documento de incapacidad</h3>
              <FileDropzone
                accept={INCAPACITY_FILE_ACCEPT}
                maxSizeLabelMb={MAX_MB}
                selectedFile={file}
                onFileSelected={handleFileSelected}
                errorMessage={dropzoneError}
                uploadProgress={uploadProgress}
                disabled={isUploading || !colaboradorSeleccionado}
              />
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary-50 px-3.5 py-2.5">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-600" aria-hidden />
              <p className="text-xs text-primary-800">
                El documento quedará vinculado al colaborador seleccionado. La extracción con IA se
                ejecutará en segundo plano.
              </p>
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-100 px-6 pb-6 pt-4">
            <button
              type="button"
              onClick={() => void handleSubmit()}
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
                  Radicar documento
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </>
              )}
            </button>
          </div>
        </Card>
      </div>
    </RecepcionPortalShell>
  )
}
