import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCurrentReturnState, useReturnNavigation } from '@/hooks/useReturnNavigation'
import { ArrowLeft, FileText, Loader2 } from 'lucide-react'
import type { IncapacidadDetalle } from '@/features/incapacity-ai-review/types/incapacidadDetalle'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/Card'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { StatusTimeline } from './StatusTimeline'
import { historialToTimelineRecords } from '../utils/historialToTimeline'
import { tramiteDetalleToDisplay } from '../utils/tramiteDetalleDisplay'

export type MiTramiteDetallePanelProps = Readonly<{
  detail: IncapacidadDetalle | null
  loading: boolean
  error: string | null
}>

export function MiTramiteDetallePanel({ detail, loading, error }: MiTramiteDetallePanelProps) {
  const returnState = useCurrentReturnState()
  const { goBack } = useReturnNavigation('/portal/mi-tramite')
  const timelineEntries = useMemo(() => {
    if (!detail) return []
    const historial = detail.historial_estados ?? []
    return historialToTimelineRecords(historial, detail.estado)
  }, [detail])

  const display = useMemo(() => (detail ? tramiteDetalleToDisplay(detail) : null), [detail])

  if (loading && !detail) {
    return (
      <main className="flex flex-col items-center justify-center gap-3 py-24 text-gray-500">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" aria-hidden />
        <p className="text-sm">Cargando trámite…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex flex-col items-center gap-4 py-16">
        <p className="max-w-md text-center text-sm text-danger-text" role="alert">
          {error}
        </p>
        <button type="button" onClick={goBack} className={buttonClassName('secondary')}>
          Volver a mis trámites
        </button>
      </main>
    )
  }

  if (!detail || !display) return null

  return (
    <>
      <main className="flex w-full flex-col gap-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className={buttonClassName('secondary', 'gap-1.5 py-1.5 text-[13px]')}
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Volver
          </button>
          <h1 className="text-[22px] font-semibold tracking-tight text-gray-900">
            Detalle del trámite
          </h1>
        </div>

        <Card className="p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">Radicado</p>
              <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-sm text-gray-700">
                {detail.radicado}
              </span>
              <p className="mt-1 text-xs text-gray-400">Seguimiento de incapacidad</p>
            </div>
            <StatusBadge estado={detail.estado} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">
                Tipo de incapacidad
              </p>
              <p className="text-sm text-gray-700">{display.tipoIncapacidad}</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">Entidad</p>
              <p className="text-sm text-gray-700">{display.entidadNombre}</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">
                Días de incapacidad
              </p>
              <p className="text-2xl font-bold tabular-nums text-gray-900">
                {display.diasIncapacidad}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">
                Fecha de carga
              </p>
              <p className="text-sm text-gray-700">{display.fechaCarga}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
            <Link
              to={`/incapacidad/revision-ia?id=${encodeURIComponent(detail.id)}`}
              state={returnState}
              className={buttonClassName('secondary', 'gap-1.5')}
            >
              <FileText className="h-3.5 w-3.5" aria-hidden />
              Ver documento y datos extraídos
            </Link>
          </div>
        </Card>

        <StatusTimeline entries={timelineEntries} />
      </main>
    </>
  )
}
