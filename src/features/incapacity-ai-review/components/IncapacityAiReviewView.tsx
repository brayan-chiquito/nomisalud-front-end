import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Calculator, Cpu, Loader2 } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/Card'
import { buttonClassName, inputClassName, labelClassName } from '@/components/ui/buttonStyles'
import { useIncapacidadAiReview } from '../hooks/useIncapacidadAiReview'
import {
  calidadDocPercent,
  canHumanVerifyIncapacidad,
  computeDiasIncapacidad,
  contarAlertasValidacion,
  formatDiasIncapacidadLabel,
} from '../utils/reviewFormState'
import { UserProfileMenu } from '@/components/UserProfileMenu'
import type { ActionSuccessKind } from '@/features/dashboard/types/dashboardNavigation'
import { DocumentPreviewPanel } from './DocumentPreviewPanel'
import { InconsistenciasReviewBanner } from './InconsistenciasReviewBanner'
import { RejectIncapacityModal, type RejectModalSubmit } from './RejectIncapacityModal'
import { MarcarCobradaDetalleAction } from '@/features/cobro-ante-entidad/components/MarcarCobradaDetalleAction'

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
    solicitarDocumentacion,
    inconsistencias,
    overrideJustificacion,
    setOverrideJustificacion,
    overrideRegistrado,
    registrarOverride,
    submittingOverride,
    overrideError,
    clearOverrideError,
    submitting,
    submitError,
    clearSubmitError,
    patchDetailEstado,
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

  const navigateToDashboardWithSuccess = useCallback(
    (actionSuccess: ActionSuccessKind) => {
      navigate(`/dashboard?success=${actionSuccess}`)
    },
    [navigate],
  )

  const handleConfirmar = useCallback(async () => {
    clearSubmitError()
    const ok = await confirmar()
    if (ok) navigateToDashboardWithSuccess('confirmada')
  }, [clearSubmitError, confirmar, navigateToDashboardWithSuccess])

  const handleRejectModalConfirm = useCallback(
    async (payload: RejectModalSubmit) => {
      clearSubmitError()
      if (payload.type === 'rechazar') {
        const ok = await rechazar(payload.motivo)
        if (ok) {
          setRejectModalOpen(false)
          navigateToDashboardWithSuccess('rechazada')
        }
        return ok
      }
      const ok = await solicitarDocumentacion(payload.documentos, payload.observacion)
      if (ok) {
        setRejectModalOpen(false)
        navigateToDashboardWithSuccess('documentacion_solicitada')
      }
      return ok
    },
    [clearSubmitError, navigateToDashboardWithSuccess, rechazar, solicitarDocumentacion],
  )

  const handleZoomIn = useCallback(() => {
    setZoomPercent((z) => Math.min(200, z + 25))
  }, [])
  const handleZoomOut = useCallback(() => {
    setZoomPercent((z) => Math.max(50, z - 25))
  }, [])

  const formDisabled = puedeVerificar === false || submitting || loadingDetail

  if (!incapacidadId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50/50 px-4">
        <p className="text-center text-sm text-gray-700">
          Falta el identificador del trámite. Abre esta pantalla desde el listado (enlace{' '}
          <strong>Revisar</strong>) con el parámetro{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">id</code>, o desde{' '}
          <strong>Continuar al resumen</strong> tras radicar una incapacidad.
        </p>
        <Link to={backHref} className={buttonClassName('primary')}>
          {puedeVerificar ? 'Ir al dashboard' : 'Ir a mi trámite'}
        </Link>
      </div>
    )
  }

  if (loadingDetail && !detail) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50/50 text-gray-600">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" aria-hidden />
        <p className="text-sm">Cargando trámite…</p>
      </div>
    )
  }

  if (errorDetail) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50/50 px-4">
        <p className="max-w-md text-center text-sm text-danger-text" role="alert">
          {errorDetail}
        </p>
        <Link to={backHref} className={buttonClassName('secondary')}>
          Volver
        </Link>
      </div>
    )
  }

  if (!detail) return null

  const requiereOverridePendiente =
    detail.estado === 'inconsistencia_detectada' &&
    inconsistencias.length > 0 &&
    !overrideRegistrado
  const accionesRevisionDeshabilitadas =
    puedeVerificar === false || submitting || detail.extraccion_ia == null
  const confirmarDeshabilitado = accionesRevisionDeshabilitadas || requiereOverridePendiente

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Link
            to={backHref}
            className={buttonClassName('icon', 'h-9 w-9 shrink-0')}
            aria-label="Volver"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
          </Link>
          <div className="min-w-0 flex flex-col gap-0.5">
            <span className="truncate font-mono text-sm font-semibold text-gray-900">
              {detail.radicado}
            </span>
            <span className="text-xs text-gray-400">Revisión de documento de incapacidad</span>
          </div>
          <StatusBadge estado={detail.estado} className="ml-2 shrink-0" />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-sm text-gray-400 sm:inline">
            {displayNameFromEmail(user?.email)}
          </span>
          <UserProfileMenu
            userName={displayNameFromEmail(user?.email)}
            companyName="Revisión de incapacidades"
            avatarInitials={initialsFromEmail(user?.email, user?.id)}
          />
        </div>
      </header>

      {submitError ? (
        <div
          className="border-b border-danger/20 bg-danger-light px-6 py-2 text-center text-sm text-danger-text"
          role="alert"
        >
          {submitError}
        </div>
      ) : null}

      <InconsistenciasReviewBanner
        items={inconsistencias}
        justificacion={overrideJustificacion}
        onJustificacionChange={setOverrideJustificacion}
        onRegistrarOverride={() => {
          clearOverrideError()
          void registrarOverride()
        }}
        overrideRegistrado={overrideRegistrado}
        submitting={submittingOverride}
        error={overrideError}
        disabled={!puedeVerificar}
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 p-5 lg:grid-cols-2 lg:h-[calc(100vh-8rem)]">
        <DocumentPreviewPanel
          archivoTipo={detail.archivo_tipo}
          objectUrl={archivoObjectUrl}
          loading={loadingArchivo}
          error={archivoError}
          zoomPercent={zoomPercent}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />

        <Card className="flex min-h-0 flex-col overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Datos extraídos por IA</h2>
              <p className="mt-0.5 text-[11px] text-gray-400">Revisados por IA</p>
            </div>
            {confianza === null ? (
              <span className="inline-flex items-center gap-1.5 rounded-badge bg-neutral-light px-2 py-1 text-[10px] font-medium text-neutral-text">
                <Cpu className="h-3.5 w-3.5" aria-hidden />
                Extracción IA
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-badge bg-info-light px-2 py-1 text-[10px] font-medium text-info-text">
                <Cpu className="h-3.5 w-3.5" aria-hidden />
                Confianza: {confianza}%
              </span>
            )}
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5">
            {detail.extraccion_ia ? null : (
              <p className="rounded-lg border border-warning/20 bg-warning-light px-3 py-2 text-sm text-warning-text">
                Aún no hay extracción IA para este trámite. Cuando el proceso termine, los campos se
                llenarán automáticamente.
              </p>
            )}

            <div className="flex flex-col gap-3">
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
                <span className={labelClassName}>
                  Días de incapacidad (calculado si hay fechas)
                </span>
                <div className="flex h-11 items-center justify-between gap-2 rounded-lg border border-primary/20 bg-primary-50 px-3">
                  <span className="text-sm font-semibold text-primary-600 tabular-nums">
                    {diasMostrar}
                  </span>
                  <Calculator className="h-4 w-4 text-primary-600" aria-hidden />
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
          </div>
        </Card>
      </div>

      <footer className="flex min-h-[68px] shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-6 py-3">
        <p className="text-[13px] text-gray-500">
          {requiereOverridePendiente
            ? 'Registra la excepción con justificación para habilitar la confirmación.'
            : alertasCount > 0
              ? `${alertasCount} validación(es) marcada(s) por el motor IA — revisa con cuidado.`
              : 'Revisa los campos antes de confirmar.'}
          {puedeVerificar ? null : ' Solo personal RRHH puede confirmar o rechazar.'}
        </p>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {detail?.estado === 'transcrita' && puedeVerificar ? (
            <MarcarCobradaDetalleAction
              incapacidadId={detail.id}
              radicado={detail.radicado}
              onEstadoActualizado={patchDetailEstado}
            />
          ) : null}
          <button
            type="button"
            disabled={accionesRevisionDeshabilitadas}
            onClick={() => {
              setRejectModalKey((k) => k + 1)
              setRejectModalOpen(true)
            }}
            className={buttonClassName(
              'secondary',
              'border-danger text-danger hover:bg-danger-light px-[22px] py-[11px]',
            )}
          >
            Rechazar con motivo
          </button>
          <button
            type="button"
            disabled={confirmarDeshabilitado}
            onClick={() => {
              handleConfirmar().catch(() => false)
            }}
            className={buttonClassName('primary', 'px-[22px] py-[11px]')}
          >
            {submitting ? 'Guardando…' : 'Confirmar datos'}
          </button>
        </div>
      </footer>

      <RejectIncapacityModal
        key={rejectModalKey}
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleRejectModalConfirm}
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
      <label className={labelClassName}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={inputClassName}
      />
    </div>
  )
}
