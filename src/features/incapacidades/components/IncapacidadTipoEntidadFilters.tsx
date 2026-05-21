import { ChevronDown, Search } from 'lucide-react'
import {
  ARCHIVO_TIPO_FILTER_OPTIONS,
  incapacidadSelectFrameClassName,
  incapacidadSelectNativeClassName,
} from '../constants/listFilters'

export type IncapacidadTipoEntidadFiltersProps = Readonly<{
  tipo: string
  onTipoChange: (value: string) => void
  entidadInput: string
  onEntidadInputChange: (value: string) => void
  loading: boolean
  entidadPlaceholder?: string
  entidadAriaLabel?: string
}>

export function IncapacidadTipoEntidadFilters({
  tipo,
  onTipoChange,
  entidadInput,
  onEntidadInputChange,
  loading,
  entidadPlaceholder = 'Filtrar por entidad…',
  entidadAriaLabel = 'Filtrar por nombre de entidad',
}: IncapacidadTipoEntidadFiltersProps) {
  const tipoLabel = ARCHIVO_TIPO_FILTER_OPTIONS.find((t) => t.value === tipo)?.label ?? 'Todos'

  return (
    <div className="mb-0 flex flex-wrap items-center gap-2.5 border-b border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
      <label className={incapacidadSelectFrameClassName}>
        <span className="shrink-0 text-slate-600">Tipo:</span>
        <select
          value={tipo}
          onChange={(e) => onTipoChange(e.target.value)}
          disabled={loading}
          className={incapacidadSelectNativeClassName}
          aria-label={`Tipo de archivo, actualmente ${tipoLabel}`}
        >
          {ARCHIVO_TIPO_FILTER_OPTIONS.map(({ value, label }) => (
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
          onChange={(e) => onEntidadInputChange(e.target.value)}
          disabled={loading}
          placeholder={entidadPlaceholder}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-3 pl-9 text-sm placeholder:text-gray-400 focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none"
          aria-label={entidadAriaLabel}
        />
      </div>
    </div>
  )
}
