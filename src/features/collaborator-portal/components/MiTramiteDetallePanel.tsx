import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowLeft, FileText, Loader2, Timer } from 'lucide-react'
import {
  estadoBadgeClasses,
  labelEstadoIncapacidad,
} from '@/features/incapacidades/utils/estadoBadge'
import { cn } from '@/utils/cn'
import type { IncapacidadDetalle } from '@/features/incapacity-ai-review/types/incapacidadDetalle'
import { StatusTimeline } from './StatusTimeline'
import { historialToTimelineRecords } from '../utils/historialToTimeline'
import { tramiteDetalleToDisplay } from '../utils/tramiteDetalleDisplay'

export type MiTramiteDetallePanelProps = Readonly<{
  detail: IncapacidadDetalle | null
  loading: boolean
  error: string | null
}>

export function MiTramiteDetallePanel({ detail, loading, error }: MiTramiteDetallePanelProps) {
  const timelineEntries = useMemo(() => {
    if (!detail) return []
    const historial = detail.historial_estados ?? []
    return historialToTimelineRecords(historial, detail.estado)
  }, [detail])

  const display = useMemo(() => (detail ? tramiteDetalleToDisplay(detail) : null), [detail])

  const docPendiente =
    detail?.estado === 'doc_incompleta' &&
    Array.isArray(detail.documentacion_faltante) &&
    detail.documentacion_faltante.length > 0

  if (loading && !detail) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-slate-500">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" aria-hidden />
        <p className="text-sm">Cargando trámite…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col items-center gap-4 px-6 py-16">
        <p className="max-w-md text-center text-red-700" role="alert">
          {error}
        </p>
        <Link
          to="/portal/mi-tramite"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Volver a mis trámites
        </Link>
      </main>
    )
  }

  if (!detail || !display) return null

  const estadoLabel = labelEstadoIncapacidad(detail.estado)

  return (
    <>
      {docPendiente ? (
        <div className="flex items-start gap-3 border-b border-amber-300 bg-amber-50 px-6 py-3.5">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-[13px] font-semibold text-amber-900">
              Documentación pendiente — Requiere atención antes de continuar
            </p>
            <ul className="list-inside list-disc text-xs text-slate-600">
              {detail.documentacion_faltante?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <Link
            to="/portal/radicar-incapacidad"
            className="shrink-0 rounded-lg border border-amber-600 bg-white px-4 py-2 text-[13px] font-semibold text-amber-700 hover:bg-amber-50"
          >
            Cargar documentos
          </Link>
        </div>
      ) : null}

      <main className="flex flex-1 flex-col items-center gap-5 p-6">
        <div className="flex w-full max-w-[680px] items-center gap-3">
          <Link
            to="/portal/mi-tramite"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Volver
          </Link>
          <h1 className="text-lg font-bold text-slate-800">Detalle del trámite</h1>
        </div>

        <section
          className="w-full max-w-[680px] overflow-hidden rounded-2xl bg-white shadow-md"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-start justify-between gap-4 p-6">
            <div>
              <p className="text-[17px] font-bold text-slate-800">{detail.radicado}</p>
              <p className="text-xs text-slate-400">Seguimiento de incapacidad</p>
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold',
                estadoBadgeClasses(detail.estado),
              )}
            >
              <Timer className="h-3.5 w-3.5" aria-hidden />
              {estadoLabel}
            </span>
          </div>
          <div className="h-px w-full bg-slate-100" />
          <div className="grid grid-cols-1 gap-6 px-6 py-5 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-[11px] text-slate-400">Tipo de incapacidad</p>
              <p className="text-sm font-bold text-slate-800">{display.tipoIncapacidad}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-slate-400">Entidad</p>
              <p className="text-sm font-bold text-slate-800">{display.entidadNombre}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-slate-400">Días de incapacidad</p>
              <p className="text-sm font-bold text-blue-600">{display.diasIncapacidad}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-slate-400">Fecha de carga</p>
              <p className="text-sm font-bold text-slate-800">{display.fechaCarga}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2 px-5 pb-5">
            <Link
              to={`/incapacidad/revision-ia?id=${encodeURIComponent(detail.id)}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-4 py-2 text-[13px] font-medium text-blue-600 hover:bg-blue-100"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden />
              Ver documento y datos extraídos
            </Link>
          </div>
        </section>

        <StatusTimeline entries={timelineEntries} />
      </main>
    </>
  )
}
