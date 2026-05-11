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
import {
  estadoBadgeClasses,
  labelEstadoIncapacidad,
} from '@/features/incapacidades/utils/estadoBadge'
import {
  colaboradorNombreLegible,
  colaboradorTooltipLista,
  entidadDetalleTooltip,
  entidadNombreLegible,
  tipoArchivoLegible,
} from '@/features/incapacidades/utils/listIncapacidadItemDisplay'
import { cn } from '@/utils/cn'

const TIPO_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'pdf', label: 'PDF' },
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
] as const

const selectFrame =
  'flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-2 text-[13px] text-slate-700 shadow-sm hover:border-slate-300'

const selectNative =
  'max-w-[160px] cursor-pointer border-0 bg-transparent text-[13px] text-slate-700 outline-none focus:ring-0'

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

  const canPrev = page > 1 && !loading
  const canNext = totalPages > 0 && page < totalPages && !loading

  return (
    <section
      id="panel-incapacidades"
      className="flex min-h-[420px] flex-col overflow-hidden rounded-xl border border-slate-100/80 bg-white shadow-[0_1px_6px_rgba(0,0,0,0.06)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
        <h2 className="text-base font-semibold text-slate-900">Incapacidades</h2>
        <Link
          to="/portal/radicar-incapacidad"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Nueva incapacidad
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-100 px-5 py-4 sm:px-6">
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

        <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
          <input
            type="search"
            value={entidadInput}
            onChange={(e) => setEntidadInput(e.target.value)}
            disabled={loading}
            placeholder="Buscar colaborador..."
            className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            title="Filtra por texto en el nombre de entidad (EPS/ARL) según datos extraídos por la API"
          />
        </div>
      </div>

      {error ? (
        <p
          className="mx-5 my-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="min-h-0 flex-1 overflow-x-auto">
        <div className="min-w-[960px]">
          <div
            className="grid h-10 items-center gap-x-2 border-b border-slate-200 bg-slate-50 px-6 text-xs font-semibold uppercase tracking-wide text-slate-500"
            style={{
              gridTemplateColumns:
                'minmax(0, 1fr) minmax(0, 1.35fr) minmax(0, 100px) minmax(0, 120px) minmax(0, 140px) minmax(0, 92px) minmax(0, 72px)',
            }}
          >
            <span className="min-w-0">Radicado</span>
            <span className="min-w-0">Colaborador</span>
            <span className="min-w-0">Tipo</span>
            <span className="min-w-0">Entidad</span>
            <span className="min-w-0">Estado</span>
            <span className="min-w-0">Fecha</span>
            <span className="min-w-0 text-center">Acciones</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" aria-hidden />
              <span className="text-sm">Cargando…</span>
            </div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">
              No hay trámites con los filtros seleccionados.
            </p>
          ) : (
            items.map((row, i) => {
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
                    'grid items-center gap-x-2 border-b border-slate-100 px-6 py-3.5 text-[13px]',
                    i % 2 === 1 ? 'bg-[#FAFAFA]' : 'bg-white',
                  )}
                  style={{
                    gridTemplateColumns:
                      'minmax(0, 1fr) minmax(0, 1.35fr) minmax(0, 100px) minmax(0, 120px) minmax(0, 140px) minmax(0, 92px) minmax(0, 72px)',
                  }}
                >
                  <span className="min-w-0 truncate font-medium text-blue-600" title={row.radicado}>
                    {row.radicado}
                  </span>
                  <span className="min-w-0 truncate text-slate-900" title={colaboradorTitulo}>
                    {nombreCol || 'Sin nombre'}
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
                    <span
                      className={cn(
                        'inline-flex max-w-full truncate rounded-full px-2.5 py-1 text-xs font-medium',
                        estadoBadgeClasses(row.estado),
                      )}
                      title={labelEstadoIncapacidad(row.estado)}
                    >
                      {labelEstadoIncapacidad(row.estado)}
                    </span>
                  </span>
                  <span className="min-w-0 truncate text-slate-500">
                    {formatFechaCorta(row.fecha_recepcion)}
                  </span>
                  <div className="flex min-w-0 justify-center">
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
