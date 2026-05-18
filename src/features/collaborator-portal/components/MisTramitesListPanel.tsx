import { Link } from 'react-router-dom'
import { ChevronRight, CirclePlus, Loader2 } from 'lucide-react'
import {
  estadoBadgeClasses,
  labelEstadoIncapacidad,
} from '@/features/incapacidades/utils/estadoBadge'
import { cn } from '@/utils/cn'
import type { MisIncapacidadItem } from '../types/misIncapacidades'
import { formatFechaCorta } from '../utils/formatFecha'

export type MisTramitesListPanelProps = Readonly<{
  items: readonly MisIncapacidadItem[]
  loading: boolean
  error: string | null
  page: number
  pages: number
  onPageChange: (page: number) => void
}>

function TramiteListRow({ item }: Readonly<{ item: MisIncapacidadItem }>) {
  const estadoLabel = labelEstadoIncapacidad(item.estado)
  return (
    <li>
      <Link
        to={`/portal/mi-tramite/${item.id}`}
        className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white px-5 py-4 transition-colors hover:border-blue-200 hover:bg-blue-50/40"
      >
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate text-[15px] font-bold text-slate-800">{item.radicado}</p>
          <p className="text-xs text-slate-400">
            Actualizado · {formatFechaCorta(item.updated_at)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              'inline-flex max-w-[140px] truncate rounded-full px-3 py-1 text-xs font-semibold',
              estadoBadgeClasses(item.estado),
            )}
            title={estadoLabel}
          >
            {estadoLabel}
          </span>
          <ChevronRight className="h-5 w-5 text-slate-400" aria-hidden />
        </div>
      </Link>
    </li>
  )
}

export function MisTramitesListPanel({
  items,
  loading,
  error,
  page,
  pages,
  onPageChange,
}: MisTramitesListPanelProps) {
  return (
    <main className="flex flex-1 flex-col items-center gap-5 p-6">
      <h1 className="w-full max-w-[680px] text-xl font-bold text-slate-800">Mis trámites</h1>

      {loading ? (
        <div className="flex w-full max-w-[680px] flex-col items-center gap-3 py-16 text-slate-500">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" aria-hidden />
          <p className="text-sm">Cargando trámites…</p>
        </div>
      ) : null}

      {error ? (
        <p
          className="w-full max-w-[680px] rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <div className="w-full max-w-[680px] rounded-2xl bg-white p-8 text-center shadow-md">
          <p className="text-slate-600">Aún no tienes trámites radicados.</p>
          <p className="mt-1 text-sm text-slate-400">
            Sube tu primera incapacidad para comenzar el seguimiento.
          </p>
        </div>
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <ul className="m-0 flex w-full max-w-[680px] list-none flex-col gap-3 p-0">
          {items.map((item) => (
            <TramiteListRow key={item.id} item={item} />
          ))}
        </ul>
      ) : null}

      {!loading && pages > 1 ? (
        <div className="flex w-full max-w-[680px] items-center justify-center gap-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-sm text-slate-500">
            Página {page} de {pages}
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      ) : null}

      <Link
        to="/portal/radicar-incapacidad"
        className="flex h-12 w-full max-w-[680px] items-center justify-center gap-2.5 rounded-xl bg-blue-600 text-[15px] font-bold text-white hover:opacity-95"
        style={{ boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}
      >
        <CirclePlus className="h-[18px] w-[18px]" aria-hidden />
        Radicar nueva incapacidad
      </Link>
    </main>
  )
}
