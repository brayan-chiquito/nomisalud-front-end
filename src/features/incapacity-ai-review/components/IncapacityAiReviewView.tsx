import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Calculator, Cpu, Loader2, Timer } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import {
  labelEstadoIncapacidad,
  estadoBadgeClasses,
} from '@/features/incapacidades/utils/estadoBadge'
import { cn } from '@/utils/cn'
import { useIncapacidadAiReview } from '../hooks/useIncapacidadAiReview'
import {
  calidadDocPercent,
  canHumanVerifyIncapacidad,
  computeDiasIncapacidad,
  contarAlertasValidacion,
  formatDiasIncapacidadLabel,
} from '../utils/reviewFormState'
import { DocumentPreviewPanel } from './DocumentPreviewPanel'
import { RejectIncapacityModal } from './RejectIncapacityModal'

function displayNameFromEmail(email: string | undefined): string {
  if (!email) return 'Usuario'
  const local = email.split('@')[0] ?? email
  return local.replaceAll('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function initialsFromEmail(email: string | undefined, id: string | undefined): string {
  if (email && email.length >= 2) return email.slice(0, 2).toUpperCase()
  if (id && id.length >= 2) return id.slice(0, 2).toUpperCase()
  return 'NS'
}

/**
 * Revisión side-by-side: documento (PDF/imagen con JWT vía blob) + formulario editable desde extracción IA.
 * Ruta: `/incapacidad/revision-ia?id={uuid}` (ver docs/README.md).
 */
export function IncapacityAiReviewView() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const incapacidadId = params.get('id')
  const {
    detail,
    loadingDetail,
    errorDetail,
    archivoObjectUrl,
    loadingArchivo,
    archivoError,
    form,
    setFormField,
    confirmar,
    rechazar,
    submitting,
    submitError,
    clearSubmitError,
  } = useIncapacidadAiReview(incapacidadId)

  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectModalKey, setRejectModalKey] = useState(0)
  const [zoomPercent, setZoomPercent] = useState(100)

  const puedeVerificar = canHumanVerifyIncapacidad(user?.role)
  const backHref = puedeVerificar ? '/dashboard' : '/portal/mi-tramite'

  const confianza = useMemo(
    () => calidadDocPercent(detail?.extraccion_ia?.calidad_doc ?? undefined),
    [detail?.extraccion_ia?.calidad_doc],
  )

  const diasCalculados = useMemo(
    () => computeDiasIncapacidad(form.fechaInicio, form.fechaFin),
    [form.fechaInicio, form.fechaFin],
  )

  const diasMostrar = useMemo(
    () => formatDiasIncapacidadLabel(diasCalculados, form.diasIncapacidad.trim()),
    [diasCalculados, form.diasIncapacidad],
  )

  const alertasCount = useMemo(
    () => contarAlertasValidacion(detail?.extraccion_ia?.validaciones),
    [detail?.extraccion_ia?.validaciones],
  )

  const handleConfirmar = useCallback(async () => {
    clearSubmitError()
    const ok = await confirmar()
    if (ok) navigate(backHref)
  }, [backHref, clearSubmitError, confirmar, navigate])

  const handleZoomIn = useCallback(() => {
    setZoomPercent((z) => Math.min(200, z + 25))
  }, [])
  const handleZoomOut = useCallback(() => {
    setZoomPercent((z) => Math.max(50, z - 25))
  }, [])

  const formDisabled = puedeVerificar === false || submitting || loadingDetail

  if (!incapacidadId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 px-4">
        <p className="text-center text-slate-700">
          Falta el identificador del trámite. Abre esta pantalla desde el listado (enlace{' '}
          <strong>Revisar</strong>) con el parámetro{' '}
          <code className="rounded bg-slate-200 px-1">id</code>, o desde{' '}
          <strong>Continuar al resumen</strong> tras radicar una incapacidad.
        </p>
        <Link
          to={backHref}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {puedeVerificar ? 'Ir al dashboard' : 'Ir a mi trámite'}
        </Link>
      </div>
    )
  }

  if (loadingDetail && !detail) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-100 text-slate-600">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" aria-hidden />
        <p className="text-sm">Cargando trámite…</p>
      </div>
    )
  }

  if (errorDetail) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 px-4">
        <p className="max-w-md text-center text-red-700" role="alert">
          {errorDetail}
        </p>
        <Link
          to={backHref}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Volver
        </Link>
      </div>
    )
  }

  if (!detail) return null

  const estadoLabel = labelEstadoIncapacidad(detail.estado)
  const accionesRevisionDeshabilitadas =
    puedeVerificar === false || submitting || detail.extraccion_ia == null

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Link
            to={backHref}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            aria-label="Volver"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
          </Link>
          <div className="min-w-0 flex flex-col gap-0.5">
            <span className="truncate text-base font-bold text-slate-800">{detail.radicado}</span>
            <span className="text-xs text-slate-400">Revisión de documento de incapacidad</span>
          </div>
          <span
            className={cn(
              'ml-2 inline-flex max-w-[min(200px,40vw)] shrink-0 items-center gap-1.5 truncate rounded-full px-3.5 py-1.5 text-[13px] font-medium',
              estadoBadgeClasses(detail.estado),
            )}
            title={estadoLabel}
          >
            <Timer className="h-3.5 w-3.5" aria-hidden />
            {estadoLabel}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-sm text-slate-500 sm:inline">
            {displayNameFromEmail(user?.email)}
          </span>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-[13px] font-semibold text-white"
            aria-hidden
          >
            {initialsFromEmail(user?.email, user?.id)}
          </div>
        </div>
      </header>

      {submitError ? (
        <div
          className="border-b border-red-200 bg-red-50 px-6 py-2 text-center text-sm text-red-800"
          role="alert"
        >
          {submitError}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <DocumentPreviewPanel
          archivoTipo={detail.archivo_tipo}
          objectUrl={archivoObjectUrl}
          loading={loadingArchivo}
          error={archivoError}
          zoomPercent={zoomPercent}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />

        <section className="flex min-h-0 flex-1 flex-col gap-4 border-l border-slate-200 bg-white p-6 lg:max-w-[50%]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h2 className="text-[15px] font-bold text-slate-800">Datos extraídos por IA</h2>
            {confianza === null ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                <Cpu className="h-3.5 w-3.5" aria-hidden />
                Extracción IA
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                <Cpu className="h-3.5 w-3.5" aria-hidden />
                Confianza: {confianza}%
              </span>
            )}
          </div>

          {detail.extraccion_ia ? null : (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Aún no hay extracción IA para este trámite. Cuando el proceso termine, los campos se
              llenarán automáticamente.
            </p>
          )}

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
            <FormInput
              label="Nombre colaborador"
              value={form.nombreColaborador}
              onChange={(v) => setFormField('nombreColaborador', v)}
              disabled={formDisabled}
            />
            <FormInput
              label="Número de identificación"
              value={form.documentoColaborador}
              onChange={(v) => setFormField('documentoColaborador', v)}
              disabled={formDisabled}
            />
            <FormInput
              label="Tipo de incapacidad"
              value={form.tipoIncapacidad}
              onChange={(v) => setFormField('tipoIncapacidad', v)}
              disabled={formDisabled}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormInput
                label="Fecha de inicio"
                value={form.fechaInicio}
                onChange={(v) => setFormField('fechaInicio', v)}
                disabled={formDisabled}
              />
              <FormInput
                label="Fecha de fin"
                value={form.fechaFin}
                onChange={(v) => setFormField('fechaFin', v)}
                disabled={formDisabled}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-slate-700">
                Días de incapacidad (calculado si hay fechas)
              </span>
              <div className="flex h-[42px] items-center justify-between gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3">
                <span className="text-[13px] font-semibold text-blue-600">{diasMostrar}</span>
                <Calculator className="h-4 w-4 text-blue-600" aria-hidden />
              </div>
            </div>
            <FormInput
              label="Diagnóstico / descripción"
              value={form.diagnostico}
              onChange={(v) => setFormField('diagnostico', v)}
              disabled={formDisabled}
            />
            <FormInput
              label="Código CIE-10"
              value={form.codigoCie10}
              onChange={(v) => setFormField('codigoCie10', v)}
              disabled={formDisabled}
            />
            <FormInput
              label="Entidad (nombre)"
              value={form.entidadNombre}
              onChange={(v) => setFormField('entidadNombre', v)}
              disabled={formDisabled}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormInput
                label="Tipo entidad"
                value={form.entidadTipo}
                onChange={(v) => setFormField('entidadTipo', v)}
                disabled={formDisabled}
              />
              <FormInput
                label="NIT entidad"
                value={form.entidadNit}
                onChange={(v) => setFormField('entidadNit', v)}
                disabled={formDisabled}
              />
            </div>
          </div>
        </section>
      </div>

      <footer className="flex min-h-[68px] shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-3">
        <p className="text-[13px] text-slate-500">
          {alertasCount > 0
            ? `${alertasCount} validación(es) marcada(s) por el motor IA — revisa con cuidado.`
            : 'Revisa los campos antes de confirmar.'}
          {puedeVerificar ? null : ' Solo personal RRHH puede confirmar o rechazar.'}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={accionesRevisionDeshabilitadas}
            onClick={() => {
              setRejectModalKey((k) => k + 1)
              setRejectModalOpen(true)
            }}
            className="rounded-lg border border-red-600 bg-white px-[22px] py-[11px] text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Rechazar con motivo
          </button>
          <button
            type="button"
            disabled={accionesRevisionDeshabilitadas}
            onClick={() => {
              handleConfirmar().catch(() => false)
            }}
            className="rounded-lg bg-blue-600 px-[22px] py-[11px] text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? 'Guardando…' : 'Confirmar datos'}
          </button>
        </div>
      </footer>

      <RejectIncapacityModal
        key={rejectModalKey}
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={rechazar}
        isSubmitting={submitting}
        error={submitError}
      />
    </div>
  )
}

type FormInputProps = Readonly<{
  label: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}>

function FormInput({ label, value, onChange, disabled }: FormInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-slate-800 outline-none ring-blue-500 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50"
      />
    </div>
  )
}
