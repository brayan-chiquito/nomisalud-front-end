import { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { isContabilidadRole } from '@/features/auth/utils/roleAccess'
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
  const { user } = useAuth()
  const sources = isContabilidadRole(user?.role) ? 'pagos' : 'all'
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
        const names = await fetchEntidadNombreSuggestions(debounced, { signal, sources })
        if (!signal.aborted) setSuggestions(names)
      } catch {
        if (!signal.aborted) setSuggestions([])
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    },
    [debounced, sources],
  )

  return { suggestions, loading }
}
