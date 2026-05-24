import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { isContabilidadRole } from '@/features/auth/utils/roleAccess'
import type { IncapacidadesFilterParams } from '@/features/incapacidades/services/listIncapacidades.service'
import {
  fetchEntidadNombreSuggestions,
  type EntidadSuggestionsSource,
} from '@/features/incapacidades/services/entidadSuggestions.service'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'

export type UseEntidadSuggestionsConfig = Readonly<{
  sources?: EntidadSuggestionsSource
  listFilters?: IncapacidadesFilterParams
}>

export type UseEntidadSuggestionsResult = Readonly<{
  suggestions: readonly string[]
  loading: boolean
}>

function normalizeConfig(
  config?: EntidadSuggestionsSource | UseEntidadSuggestionsConfig,
): UseEntidadSuggestionsConfig {
  if (typeof config === 'string') return { sources: config }
  return config ?? {}
}

export function useEntidadSuggestions(
  input: string,
  debounceMs = 300,
  config?: EntidadSuggestionsSource | UseEntidadSuggestionsConfig,
): UseEntidadSuggestionsResult {
  const { user } = useAuth()
  const { sources: sourcesOverride, listFilters } = normalizeConfig(config)
  const sources = sourcesOverride ?? (isContabilidadRole(user?.role) ? 'pagos' : 'all')

  const listFiltersKey = useMemo(() => JSON.stringify(listFilters ?? {}), [listFilters])

  const [debounced, setDebounced] = useState('')
  const [suggestions, setSuggestions] = useState<readonly string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const t = globalThis.setTimeout(() => setDebounced(input.trim()), debounceMs)
    return () => globalThis.clearTimeout(t)
  }, [input, debounceMs])

  useAbortableEffect(
    async (signal) => {
      if (debounced.length < 2) {
        setSuggestions([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const names = await fetchEntidadNombreSuggestions(debounced, {
          signal,
          sources,
          listFilters,
        })
        if (!signal.aborted) setSuggestions(names)
      } catch {
        /* Mantener sugerencias previas si la petición falla o se cancela. */
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    },
    [debounced, sources, listFiltersKey],
  )

  return { suggestions, loading }
}
