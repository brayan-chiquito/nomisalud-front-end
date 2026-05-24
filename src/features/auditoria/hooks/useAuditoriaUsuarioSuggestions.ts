import { useAuth } from '@/features/auth/context/AuthContext'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'
import { useEffect, useState } from 'react'
import { buscarUsuariosAuditoria } from '../services/buscarUsuariosAuditoria.service'
import type { UsuarioAuditoriaOption } from '../utils/auditoriaUsuarioSearch'

const DEBOUNCE_MS = 300

export type UseAuditoriaUsuarioSuggestionsResult = Readonly<{
  suggestions: readonly UsuarioAuditoriaOption[]
  loading: boolean
}>

export function useAuditoriaUsuarioSuggestions(
  input: string,
): UseAuditoriaUsuarioSuggestionsResult {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [debounced, setDebounced] = useState('')
  const [suggestions, setSuggestions] = useState<readonly UsuarioAuditoriaOption[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const t = globalThis.setTimeout(() => setDebounced(input.trim()), DEBOUNCE_MS)
    return () => globalThis.clearTimeout(t)
  }, [input])

  useAbortableEffect(
    async (signal) => {
      if (debounced.length < 2) {
        setSuggestions([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const items = await buscarUsuariosAuditoria({
          q: debounced,
          includeAdminDirectory: isAdmin,
          signal,
        })
        if (!signal.aborted) setSuggestions(items)
      } catch {
        if (!signal.aborted) setSuggestions([])
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    },
    [debounced, isAdmin],
  )

  return { suggestions, loading }
}
