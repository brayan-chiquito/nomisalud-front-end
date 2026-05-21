import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Loader2,
  Search,
  X,
} from 'lucide-react'
import type { IncapacidadListItem } from '@/features/incapacidades/types/listIncapacidades'
import {
  colaboradorNombreLegible,
  colaboradorTooltipLista,
  entidadDetalleTooltip,
  entidadNombreLegible,
} from '@/features/incapacidades/utils/listIncapacidadItemDisplay'
import { UrgenciaBadge } from '@/components/ui/UrgenciaBadge'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { Card } from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import { useTranscritasCobroList } from '../hooks/useTranscritasCobroList'
import { marcarIncapacidadCobrada } from '../services/marcarCobrada.service'
import { messageFromPatchEstadoError } from '../utils/patchEstadoErrorMessage'
import { MarcarCobradaModal } from './MarcarCobradaModal'

const TIPO_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'pdf', label: 'PDF' },
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
] as const

const selectFrame =
  'flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-2 text-sm text-gray-700 shadow-sm transition-colors duration-150 hover:border-gray-300'

const selectNative =
  'max-w-[160px] cursor-pointer border-0 bg-transparent text-[13px] text-slate-700 outline-none focus:ring-0'

const TABLE_GRID_COLUMNS =
  'minmax(0, 1fr) minmax(0, 1.35fr) minmax(0, 1.2fr) minmax(0, 100px) minmax(0, 112px) minmax(0, 140px)'

function formatFechaCorta(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function pageSizeFromResponse(total: number, pages: number, rowCount: number): number {
  if (pages > 0 && total > 0) return Math.ceil(total / pages)
  return rowCount
}

export function CobroAnteEntidadPanel() {
  const {
    data,
    loading,
    error,
    page,
    setPage,
    tipo,
    setTipo,
    entidadInput,
    setEntidadInput,
    refetch,
  } = useTranscritasCobroList()

  const [modalItem, setModalItem] = useState<IncapacidadListItem | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const [successRadicado, setSuccessRadicado] = useState<string | null>(null)

  const total = data?.total ?? 0
  const totalPages = data?.pages ?? 0
  const items = data?.items ?? []
  const pageSize = data ? pageSizeFromResponse(total, totalPages, items.length) : 0
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = total === 0 ? 0 : Math.min(page * pageSize, total)
  const tipoLabel = TIPO_OPTIONS.find((t) => t.value === tipo)?.label ?? 'Todos'
  const canPrev = page > 1 && !loading
  const canNext = totalPages > 0 && page < totalPages && !loading

  const handleConfirmCobrada = useCallback(
    async (observacion?: string) => {
      if (!modalItem) return false
      setSubmitting(true)
      setModalError(null)
      try {
        await marcarIncapacidadCobrada(modalItem.id, observacion)
        setSuccessRadicado(modalItem.radicado)
        setModalItem(null)
        refetch()
        return true
      } catch (e) {
        setModalError(messageFromPatchEstadoError(e))
        return false
      } finally {
        setSubmitting(false)
      }
    },
    [modalItem, refetch],
  )

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <h2 className="text-lg font-semibold text-gray-900">Marcar como cobrada</h2>
        <p className="mt-1 text-sm text-gray-500">
          Trámites en estado transcrita listos para registrar cobro ante la entidad. Al confirmar,
          pasan a cobrada y podrán incluirse en Registrar pago.
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Flujo manual provisional hasta integración con API externa (EPS/entidad).
        </p>
      </div>

      {successRadicado ? (
        <div
          className="mx-5 mt-4 flex items-start gap-2.5 rounded-xl border border-success/20 bg-success-light px-4 py-3 sm:mx-6"
          role="status"
          aria-live="polite"
        >
          <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />
          <p className="min-w-0 flex-1 text-sm text-success-text">
            El trámite <span className="font-mono font-medium">{successRadicado}</span> quedó en
            estado cobrada. Ya puedes registrar el pago en{' '}
            <Link to="/dashboard/pagos" className="font-medium text-primary underline">
              Pagos
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={() => setSuccessRadicado(null)}
            className={buttonClassName('icon', 'text-success hover:bg-success/10')}
            aria-label="Cerrar aviso"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : null}

      <div className="mb-0 flex flex-wrap items-center gap-2.5 border-b border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
        <label className={selectFrame}>
          <span className="shrink-0 text-slate-600">Tipo:</span>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            disabled={loading}
            className={selectNative}
            aria-label={`Tipo de archivo, actualmente ${tipoLabel}`}
          >
            {TIPO_OPTIONS.map(({ value, label }) => (
              <option key={value || 'all'} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
        </label>

        <div className="relative flex min-w-[200px] flex-1 items-center">
          <Search className="absolute left-3 h-4 w-4 shrink-0 text-gray-400" aria-hidden />
          <input
            type="search"
            value={entidadInput}
            onChange={(e) => setEntidadInput(e.target.value)}
            disabled={loading}
            placeholder="Filtrar por entidad…"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-3 pl-9 text-sm placeholder:text-gray-400 focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none"
            aria-label="Filtrar por nombre de entidad"
          />
        </div>
      </div>

      {error ? (
        <p
          className="mx-5 my-3 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger-text sm:mx-6"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="min-h-0 overflow-x-auto">
        <div className="min-w-[900px]">
          <div
            className="grid h-11 items-center gap-x-2 border-b border-gray-100 bg-gray-50/80 px-5 text-[11px] font-semibold tracking-wider text-gray-400 uppercase"
            style={{ gridTemplateColumns: TABLE_GRID_COLUMNS }}
          >
            <span className="min-w-0">Radicado</span>
            <span className="min-w-0">Colaborador</span>
            <span className="min-w-0">Entidad</span>
            <span className="min-w-0">Urgencia</span>
            <span className="min-w-0">Fecha</span>
            <span className="min-w-0 text-center">Acción</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
              <span className="text-sm">Cargando…</span>
            </div>
          ) : items.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-slate-500">
              No hay trámites en estado transcrita. Aprueba trámites desde verificación (PATCH
              transcrita) antes de marcar cobro.
            </p>
          ) : (
            items.map((row) => {
              const nombreCol = colaboradorNombreLegible(row)
              const colaboradorTitulo = colaboradorTooltipLista(row)
              const entNombre = entidadNombreLegible(row)
              const entidadTxt = entNombre || '—'
              const entidadTip =
                entNombre && entidadDetalleTooltip(row)
                  ? `${entNombre} · ${entidadDetalleTooltip(row)}`
                  : entNombre || undefined
              return (
                <div
                  key={row.id}
                  className={cn(
                    'grid h-14 items-center gap-x-2 border-b border-gray-50 px-5 text-sm transition-colors duration-100 hover:bg-gray-50/60',
                    'bg-white',
                  )}
                  style={{ gridTemplateColumns: TABLE_GRID_COLUMNS }}
                >
                  <span className="min-w-0 truncate" title={row.radicado}>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-600">
                      {row.radicado}
                    </span>
                  </span>
                  <span className="min-w-0 truncate" title={colaboradorTitulo}>
                    <span className="font-medium text-gray-900">{nombreCol || 'Sin nombre'}</span>
                  </span>
                  <span className="min-w-0 truncate text-slate-500" title={entidadTip}>
                    {entidadTxt}
                  </span>
                  <span className="min-w-0">
                    <UrgenciaBadge urgencia={row.urgencia} />
                  </span>
                  <span className="min-w-0 truncate text-slate-500">
                    {formatFechaCorta(row.fecha_recepcion)}
                  </span>
                  <div className="flex min-w-0 items-center justify-center gap-2">
                    <Link
                      to={`/incapacidad/revision-ia?id=${encodeURIComponent(row.id)}`}
                      className="rounded px-2 py-1 text-[12px] font-medium text-blue-600 hover:bg-blue-50 hover:underline"
                    >
                      Ver detalle
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setModalError(null)
                        setModalItem(row)
                      }}
                      className={buttonClassName('primary', 'px-3 py-1.5 text-[12px]')}
                    >
                      Marcar cobrada
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 sm:px-6">
        <p className="text-[13px] text-slate-500">
          Mostrando {start} - {end} de {total} resultados
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-[13px] font-semibold text-white">
            {totalPages === 0 ? 0 : page}
          </span>
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </footer>

      <MarcarCobradaModal
        isOpen={modalItem !== null}
        radicado={modalItem?.radicado ?? ''}
        onClose={() => {
          if (!submitting) setModalItem(null)
        }}
        onConfirm={handleConfirmCobrada}
        isSubmitting={submitting}
        error={modalError}
      />
    </Card>
  )
}
