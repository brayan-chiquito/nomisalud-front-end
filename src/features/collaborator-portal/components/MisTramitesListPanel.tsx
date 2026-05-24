import { Link } from 'react-router-dom'
import { ChevronRight, CirclePlus, Loader2 } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/Card'
import { buttonClassName } from '@/components/ui/buttonStyles'
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
  return (
    <li>
      <Link
        to={`/portal/mi-tramite/${item.id}`}
        className="flex items-center justify-between gap-4 rounded-card border border-gray-200/60 bg-white px-5 py-4 shadow-card transition-colors duration-150 hover:bg-gray-50/80"
      >
        <div className="min-w-0 flex-1 space-y-1">
          <span className="block truncate font-mono text-sm text-gray-700">{item.radicado}</span>
          <p className="text-xs text-gray-400">Actualizado · {formatFechaCorta(item.updated_at)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge estado={item.estado} />
          <ChevronRight className="h-5 w-5 text-gray-400" aria-hidden />
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
    <main className="flex w-full flex-col gap-5">
      <h1 className="text-[22px] font-semibold tracking-tight text-gray-900">Mis trámites</h1>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
          <Loader2 className="h-10 w-10 animate-spin text-primary-600" aria-hidden />
          <p className="text-sm">Cargando trámites…</p>
        </div>
      ) : null}

      {error ? (
        <p
          className="rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger-text"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm font-medium text-gray-700">Aún no tienes trámites radicados.</p>
          <p className="mt-1 text-sm text-gray-400">
            Sube tu primera incapacidad para comenzar el seguimiento.
          </p>
        </Card>
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {items.map((item) => (
            <TramiteListRow key={item.id} item={item} />
          ))}
        </ul>
      ) : null}

      {!loading && pages > 1 ? (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className={buttonClassName('secondary')}
          >
            Anterior
          </button>
          <span className="text-sm text-gray-500">
            Página {page} de {pages}
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => onPageChange(page + 1)}
            className={buttonClassName('secondary')}
          >
            Siguiente
          </button>
        </div>
      ) : null}

      <Link
        to="/portal/radicar-incapacidad"
        className={buttonClassName('primary', 'h-12 w-full gap-2.5 text-[15px] font-semibold')}
      >
        <CirclePlus className="h-[18px] w-[18px]" aria-hidden />
        Radicar nueva incapacidad
      </Link>
    </main>
  )
}
