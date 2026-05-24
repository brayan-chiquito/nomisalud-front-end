import { ChevronDown } from 'lucide-react'
import {
  ARCHIVO_TIPO_FILTER_OPTIONS,
  incapacidadSelectFrameClassName,
  incapacidadSelectNativeClassName,
} from '../constants/listFilters'
import type { IncapacidadesFilterParams } from '../services/listIncapacidades.service'
import type { EntidadSuggestionsSource } from '../services/entidadSuggestions.service'
import { IncapacidadEntidadSearchField } from './IncapacidadEntidadSearchField'

export type IncapacidadTipoEntidadFiltersProps = Readonly<{
  tipo: string
  onTipoChange: (value: string) => void
  entidadInput: string
  onEntidadInputChange: (value: string) => void
  entidadPlaceholder?: string
  entidadAriaLabel?: string
  /** Autocompletado alineado al listado (p. ej. solo transcrita). */
  searchListFilters?: IncapacidadesFilterParams
  suggestionSources?: EntidadSuggestionsSource
}>

export function IncapacidadTipoEntidadFilters({
  tipo,
  onTipoChange,
  entidadInput,
  onEntidadInputChange,
  entidadPlaceholder,
  entidadAriaLabel,
  searchListFilters,
  suggestionSources,
}: IncapacidadTipoEntidadFiltersProps) {
  const tipoLabel = ARCHIVO_TIPO_FILTER_OPTIONS.find((t) => t.value === tipo)?.label ?? 'Todos'

  return (
    <div className="mb-0 flex flex-wrap items-center gap-2.5 border-b border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
      <label className={incapacidadSelectFrameClassName}>
        <span className="shrink-0 text-gray-600">Tipo:</span>
        <select
          value={tipo}
          onChange={(e) => onTipoChange(e.target.value)}
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

      <IncapacidadEntidadSearchField
        value={entidadInput}
        onChange={onEntidadInputChange}
        entidadPlaceholder={entidadPlaceholder}
        entidadAriaLabel={entidadAriaLabel}
        listFilters={searchListFilters}
        suggestionSources={suggestionSources}
        className="min-w-[200px] flex-1"
      />
    </div>
  )
}
