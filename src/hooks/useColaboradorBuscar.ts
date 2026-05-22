import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { buscarColaboradores } from '@/features/recepcion/services/buscarColaboradores.service'
import type { ColaboradorBusquedaItem } from '@/features/recepcion/types/colaboradorBusqueda'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'
import { messageFromLoadError } from '@/utils/messageFromLoadError'

const SEARCH_ERROR_FALLBACK = 'No se pudo buscar colaboradores. Intenta de nuevo.'

export type UseColaboradorBuscarResult = Readonly<{
  items: readonly ColaboradorBusquedaItem[]
  loading: boolean
  /** true mientras el texto del input aún no coincide con la consulta enviada (debounce). */
  isDebouncing: boolean
  error: string | null
}>

export function useColaboradorBuscar(input: string, debounceMs = 300): UseColaboradorBuscarResult {
  const query = input.trim()
  const [debounced, setDebounced] = useState('')
  const [items, setItems] = useState<readonly ColaboradorBusquedaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestSeq = useRef(0)

  useEffect(() => {
    const t = globalThis.setTimeout(() => setDebounced(query), debounceMs)
    return () => globalThis.clearTimeout(t)
  }, [query, debounceMs])

  const isDebouncing = query !== debounced

  useAbortableEffect(
    async (signal) => {
      if (debounced.length < 2) {
        setItems([])
        setError(null)
        setLoading(false)
        return
      }
      const seq = ++requestSeq.current
      setLoading(true)
      setError(null)
      try {
        const found = await buscarColaboradores({ q: debounced, limit: 10, signal })
        if (!signal.aborted && seq === requestSeq.current) setItems(found)
      } catch (e) {
        if (signal.aborted || axios.isCancel(e)) return
        if (seq === requestSeq.current) {
          setItems([])
          setError(messageFromLoadError(e, SEARCH_ERROR_FALLBACK))
        }
      } finally {
        if (!signal.aborted && seq === requestSeq.current) setLoading(false)
      }
    },
    [debounced],
  )

  return { items, loading, isDebouncing, error }
}
