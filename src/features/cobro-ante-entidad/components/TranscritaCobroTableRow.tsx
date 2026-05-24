import { Link } from 'react-router-dom'
import { useCurrentReturnState } from '@/hooks/useReturnNavigation'
import type { IncapacidadListItem } from '@/features/incapacidades/types/listIncapacidades'
import {
  colaboradorNombreLegible,
  colaboradorTooltipLista,
  entidadCeldaLista,
} from '@/features/incapacidades/utils/listIncapacidadItemDisplay'
import { formatFechaCorta } from '@/features/collaborator-portal/utils/formatFecha'
import { UrgenciaBadge } from '@/components/ui/UrgenciaBadge'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { cn } from '@/utils/cn'

export type TranscritaCobroTableRowProps = Readonly<{
  row: IncapacidadListItem
  gridTemplateColumns: string
  onMarcarCobrada: (row: IncapacidadListItem) => void
}>

export function TranscritaCobroTableRow({
  row,
  gridTemplateColumns,
  onMarcarCobrada,
}: TranscritaCobroTableRowProps) {
  const returnState = useCurrentReturnState()
  const nombreCol = colaboradorNombreLegible(row)
  const colaboradorTitulo = colaboradorTooltipLista(row)
  const entidad = entidadCeldaLista(row)

  return (
    <div
      className={cn(
        'grid h-14 items-center gap-x-2 border-b border-gray-50 px-5 text-sm transition-colors duration-100 hover:bg-gray-50/60',
        'bg-white',
      )}
      style={{ gridTemplateColumns }}
    >
      <span className="min-w-0 truncate" title={row.radicado}>
        <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-600">
          {row.radicado}
        </span>
      </span>
      <span className="min-w-0 truncate" title={colaboradorTitulo}>
        <span className="font-medium text-gray-900">{nombreCol || 'Sin nombre'}</span>
      </span>
      <span className="min-w-0 truncate text-slate-500" title={entidad.title}>
        {entidad.texto}
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
          state={returnState}
          className="rounded px-2 py-1 text-[12px] font-medium text-blue-600 hover:bg-blue-50 hover:underline"
        >
          Ver detalle
        </Link>
        <button
          type="button"
          onClick={() => onMarcarCobrada(row)}
          className={buttonClassName('primary', 'px-3 py-1.5 text-[12px]')}
        >
          Marcar cobrada
        </button>
      </div>
    </div>
  )
}
