import { useEffect, useState } from 'react'
import { buscarColaboradores } from '@/features/recepcion/services/buscarColaboradores.service'
import type { ColaboradorBusquedaItem } from '@/features/recepcion/types/colaboradorBusqueda'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'

export type UseColaboradorBuscarResult = Readonly<{
  items: readonly ColaboradorBusquedaItem[]
  loading: boolean
}>

export function useColaboradorBuscar(input: string, debounceMs = 300): UseColaboradorBuscarResult {
  const [debounced, setDebounced] = useState('')
  const [items, setItems] = useState<readonly ColaboradorBusquedaItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const t = globalThis.setTimeout(() => setDebounced(input.trim()), debounceMs)
    return () => globalThis.clearTimeout(t)
  }, [input, debounceMs])

  useAbortableEffect(
    async (signal) => {
      if (debounced.length < 2) {
        setItems([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const found = await buscarColaboradores({ q: debounced, limit: 10, signal })
        if (!signal.aborted) setItems(found)
      } catch {
        if (!signal.aborted) setItems([])
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    },
    [debounced],
  )

  return { items, loading }
}
