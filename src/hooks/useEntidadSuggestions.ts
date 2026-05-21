import { useEffect, useState } from 'react'
import { fetchEntidadNombreSuggestions } from '@/features/incapacidades/services/entidadSuggestions.service'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'

export type UseEntidadSuggestionsResult = Readonly<{
  suggestions: readonly string[]
  loading: boolean
}>

export function useEntidadSuggestions(
  input: string,
  debounceMs = 300,
): UseEntidadSuggestionsResult {
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
        const names = await fetchEntidadNombreSuggestions(debounced, signal)
        if (!signal.aborted) setSuggestions(names)
      } catch {
        if (!signal.aborted) setSuggestions([])
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    },
    [debounced],
  )

  return { suggestions, loading }
}
