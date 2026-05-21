import { ChevronDown, Download, Loader2 } from 'lucide-react'
import {
  incapacidadSelectFrameClassName,
  incapacidadSelectNativeClassName,
} from '@/features/incapacidades/constants/listFilters'
import { aniosConciliacionOptions, labelMes } from '../utils/conciliacionDisplay'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { EntidadAutocompleteInput } from '@/components/ui/EntidadAutocompleteInput'
import { useEntidadSuggestions } from '@/hooks/useEntidadSuggestions'

const MESES = Array.from({ length: 12 }, (_, i) => i + 1)

export type ConciliacionFiltersProps = Readonly<{
  mes: number
  anio: number
  entidadInput: string
  loading: boolean
  exporting: boolean
  exportError: string | null
  canQuery: boolean
  onMesChange: (mes: number) => void
  onAnioChange: (anio: number) => void
  onEntidadChange: (value: string) => void
  onExportar: () => Promise<void>
}>

export function ConciliacionFilters({
  mes,
  anio,
  entidadInput,
  loading,
  exporting,
  exportError,
  canQuery,
  onMesChange,
  onAnioChange,
  onEntidadChange,
  onExportar,
}: ConciliacionFiltersProps) {
  const anios = aniosConciliacionOptions()
  const { suggestions, loading: suggestionsLoading } = useEntidadSuggestions(entidadInput)

  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
      <div className="flex flex-wrap items-center gap-2.5">
        <label className={incapacidadSelectFrameClassName}>
          <span className="shrink-0 text-slate-600">Mes:</span>
          <select
            value={mes}
            onChange={(e) => onMesChange(Number.parseInt(e.target.value, 10))}
            disabled={loading}
            className={incapacidadSelectNativeClassName}
            aria-label={`Mes, actualmente ${labelMes(mes)}`}
          >
            {MESES.map((m) => (
              <option key={m} value={m}>
                {labelMes(m)}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
        </label>

        <label className={incapacidadSelectFrameClassName}>
          <span className="shrink-0 text-slate-600">Año:</span>
          <select
            value={anio}
            onChange={(e) => onAnioChange(Number.parseInt(e.target.value, 10))}
            disabled={loading}
            className={incapacidadSelectNativeClassName}
            aria-label={`Año, actualmente ${anio}`}
          >
            {anios.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
        </label>

        <EntidadAutocompleteInput
          value={entidadInput}
          onChange={onEntidadChange}
          suggestions={suggestions}
          suggestionsLoading={suggestionsLoading}
          placeholder="Entidad (EPS / origen) — mín. 2 caracteres"
          ariaLabel="Filtrar por entidad"
        />

        <button
          type="button"
          disabled={exporting || loading}
          onClick={() => {
            void onExportar()
          }}
          className={buttonClassName('secondary', 'ml-auto gap-2 shrink-0')}
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Download className="h-4 w-4" aria-hidden />
          )}
          {exporting ? 'Exportando…' : 'Exportar Excel'}
        </button>
      </div>

      {!canQuery ? (
        <p className="text-xs text-gray-500">
          Indica al menos 2 caracteres de entidad para consultar la conciliación del periodo.
        </p>
      ) : null}

      {exportError ? (
        <p className="rounded-lg border border-danger/20 bg-danger-light px-3 py-2 text-sm text-danger-text">
          {exportError}
        </p>
      ) : null}
    </div>
  )
}
