import { Link } from 'react-router-dom'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
} from 'lucide-react'
import { useIncapacidadesList } from '@/features/incapacidades/hooks/useIncapacidadesList'
import { INCAPACIDAD_ESTADOS_FILTRO } from '@/features/incapacidades/constants/estadosIncapacidad'
import { URGENCIA_FILTRO_OPTIONS } from '@/features/incapacidades/types/urgencia'
import { PagoRetrasadoBadge } from '@/components/ui/PagoRetrasadoBadge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { UrgenciaBadge } from '@/components/ui/UrgenciaBadge'
import { buttonClassName } from '@/components/ui/buttonStyles'
import {
  colaboradorNombreLegible,
  colaboradorTooltipLista,
  entidadDetalleTooltip,
  entidadNombreLegible,
  tipoArchivoLegible,
} from '@/features/incapacidades/utils/listIncapacidadItemDisplay'
import { debeMostrarPagoRetrasado } from '@/features/incapacidades/utils/pagoRetrasadoDisplay'
import { cn } from '@/utils/cn'

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
  'minmax(0, 1fr) minmax(0, 1.35fr) minmax(0, 88px) minmax(0, 112px) minmax(0, 100px) minmax(0, 132px) minmax(0, 88px) minmax(0, 72px)'

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

export function RrhhIncapacidadesPanel() {
  const {
    data,
    loading,
    error,
    page,
    setPage,
    estado,
    setEstado,
    tipo,
    setTipo,
    entidadInput,
    setEntidadInput,
    urgencia,
    setUrgencia,
    soloPagoRetrasado,
    setSoloPagoRetrasado,
  } = useIncapacidadesList()

  const total = data?.total ?? 0
  const totalPages = data?.pages ?? 0
  const items = data?.items ?? []
  const pageSize = data ? pageSizeFromResponse(total, totalPages, items.length) : 0
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = total === 0 ? 0 : Math.min(page * pageSize, total)

  const estadoLabel = estado
    ? (INCAPACIDAD_ESTADOS_FILTRO.find((e) => e.value === estado)?.label ?? estado)
    : 'Todos'
  const tipoLabel = TIPO_OPTIONS.find((t) => t.value === tipo)?.label ?? 'Todos'
  const urgenciaLabel = URGENCIA_FILTRO_OPTIONS.find((u) => u.value === urgencia)?.label ?? 'Todas'

  const canPrev = page > 1 && !loading
  const canNext = totalPages > 0 && page < totalPages && !loading

  return (
    <section
      id="panel-incapacidades"
      className="flex min-h-[420px] flex-col overflow-hidden rounded-card border border-gray-200/60 bg-white shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-5 sm:px-6">
        <h2 className="text-[22px] font-semibold tracking-tight text-gray-900">Incapacidades</h2>
        <Link to="/portal/radicar-incapacidad" className={buttonClassName('primary', 'gap-2')}>
          <Plus className="h-4 w-4" aria-hidden />
          Nueva incapacidad
        </Link>
      </div>

      <div className="mb-0 flex flex-wrap items-center gap-2.5 border-b border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
        <label className={selectFrame}>
          <span className="shrink-0 text-slate-600">Estado:</span>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            disabled={loading}
            className={selectNative}
            aria-label={`Estado, actualmente ${estadoLabel}`}
          >
            <option value="">Todos</option>
            {INCAPACIDAD_ESTADOS_FILTRO.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
        </label>

        <label className={selectFrame}>
          <span className="shrink-0 text-slate-600">Urgencia:</span>
          <select
            value={urgencia}
            onChange={(e) => setUrgencia(e.target.value as '' | 'verde' | 'amarillo' | 'rojo')}
            disabled={loading}
            className={selectNative}
            aria-label={`Urgencia, actualmente ${urgenciaLabel}`}
          >
            {URGENCIA_FILTRO_OPTIONS.map(({ value, label }) => (
              <option key={value || 'all'} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
        </label>

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

        <button
          type="button"
          disabled={loading}
          aria-pressed={soloPagoRetrasado}
          onClick={() => setSoloPagoRetrasado(!soloPagoRetrasado)}
          className={cn(
            'flex h-[38px] shrink-0 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors duration-150',
            soloPagoRetrasado
              ? 'border-warning/40 bg-warning-light text-warning-text'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50',
          )}
        >
          Pago retrasado
        </button>

        <div className="relative flex min-w-[200px] flex-1 items-center">
          <Search className="absolute left-3 h-4 w-4 shrink-0 text-gray-400" aria-hidden />
          <input
            type="search"
            value={entidadInput}
            onChange={(e) => setEntidadInput(e.target.value)}
            disabled={loading}
            placeholder="Buscar colaborador..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-3 pl-9 text-sm transition-all duration-150 placeholder:text-gray-400 focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none"
            title="Filtra por texto en el nombre de entidad (EPS/ARL) según datos extraídos por la API"
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

      <div className="min-h-0 flex-1 overflow-x-auto">
        <div className="min-w-[1060px]">
          <div
            className="grid h-11 items-center gap-x-2 border-b border-gray-100 bg-gray-50/80 px-5 text-[11px] font-semibold tracking-wider text-gray-400 uppercase"
            style={{ gridTemplateColumns: TABLE_GRID_COLUMNS }}
          >
            <span className="min-w-0">Radicado</span>
            <span className="min-w-0">Colaborador</span>
            <span className="min-w-0">Tipo</span>
            <span className="min-w-0">Entidad</span>
            <span className="min-w-0">Urgencia</span>
            <span className="min-w-0">Estado</span>
            <span className="min-w-0">Fecha</span>
            <span className="min-w-0 text-center">Acciones</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
              <span className="text-sm">Cargando…</span>
            </div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">
              No hay trámites con los filtros seleccionados.
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
                    'group grid h-14 items-center gap-x-2 border-b border-gray-50 px-5 text-sm transition-colors duration-100 hover:bg-gray-50/60',
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
                    <span className="text-sm font-medium text-gray-900">
                      {nombreCol || 'Sin nombre'}
                    </span>
                  </span>
                  <span
                    className="min-w-0 truncate text-slate-500"
                    title={`Documento: ${tipoArchivoLegible(row)}`}
                  >
                    {tipoArchivoLegible(row)}
                  </span>
                  <span className="min-w-0 truncate text-slate-500" title={entidadTip}>
                    {entidadTxt}
                  </span>
                  <span className="min-w-0">
                    <UrgenciaBadge urgencia={row.urgencia} />
                  </span>
                  <span className="flex min-w-0 flex-wrap items-center gap-1">
                    <StatusBadge estado={row.estado} />
                    {debeMostrarPagoRetrasado(row) ? <PagoRetrasadoBadge /> : null}
                  </span>
                  <span className="min-w-0 truncate text-slate-500">
                    {formatFechaCorta(row.fecha_recepcion)}
                  </span>
                  <div className="flex min-w-0 items-center justify-center gap-1">
                    <Link
                      to={`/incapacidad/revision-ia?id=${encodeURIComponent(row.id)}`}
                      className="rounded px-2 py-1 text-[12px] font-medium text-blue-600 hover:bg-blue-50 hover:underline"
                    >
                      Revisar
                    </Link>
                    <button
                      type="button"
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      aria-label="Más acciones"
                    >
                      <MoreHorizontal className="h-4 w-4" />
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
    </section>
  )
}
