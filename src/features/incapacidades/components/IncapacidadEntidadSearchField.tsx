import { EntidadAutocompleteInput } from '@/components/ui/EntidadAutocompleteInput'
import type { IncapacidadesFilterParams } from '../services/listIncapacidades.service'
import {
  useEntidadSuggestions,
  type UseEntidadSuggestionsConfig,
} from '@/hooks/useEntidadSuggestions'
import type { EntidadSuggestionsSource } from '../services/entidadSuggestions.service'

export type IncapacidadEntidadSearchFieldProps = Readonly<{
  value: string
  onChange: (value: string) => void
  entidadPlaceholder?: string
  entidadAriaLabel?: string
  className?: string
  /** `pagos` histórico; `incapacidades` listado filtrado; `radicados-disponibles` en registrar pago. */
  suggestionSources?: EntidadSuggestionsSource
  /** Filtros del listado (p. ej. `estado: transcrita` en cobro ante entidad). */
  listFilters?: IncapacidadesFilterParams
}>

/**
 * Buscador con autocompletado basado en el listado de incapacidades/pagos (no directorio global de usuarios).
 */
export function IncapacidadEntidadSearchField({
  value,
  onChange,
  entidadPlaceholder = 'Buscar colaborador, correo o entidad…',
  entidadAriaLabel = 'Buscar en el listado',
  className,
  suggestionSources = 'all',
  listFilters,
}: IncapacidadEntidadSearchFieldProps) {
  const suggestionConfig: UseEntidadSuggestionsConfig = {
    sources: suggestionSources,
    listFilters,
  }
  const { suggestions, loading } = useEntidadSuggestions(value, 300, suggestionConfig)

  return (
    <EntidadAutocompleteInput
      value={value}
      onChange={onChange}
      suggestions={suggestions}
      suggestionsLoading={loading}
      placeholder={entidadPlaceholder}
      ariaLabel={entidadAriaLabel}
      className={className}
    />
  )
}
