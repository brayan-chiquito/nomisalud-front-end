import { useCallback, useState } from 'react'
import axios from 'axios'
import { listPlazosEntidad } from '../services/plazosEntidad.service'
import type { PlazoEntidadItem } from '../types/plazoEntidad'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'

const LOAD_ERROR_FALLBACK = 'No se pudo cargar la configuración de plazos.'

export type UsePlazosEntidadListResult = Readonly<{
  items: readonly PlazoEntidadItem[]
  loading: boolean
  error: string | null
  reload: () => void
}>

export function usePlazosEntidadList(enabled: boolean): UsePlazosEntidadListResult {
  const [items, setItems] = useState<readonly PlazoEntidadItem[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  const load = useCallback(
    async (signal: AbortSignal) => {
      if (!enabled) {
        setLoading(false)
        setItems([])
        setError(null)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const res = await listPlazosEntidad(signal)
        if (!signal.aborted) setItems(res.items)
      } catch (e) {
        if (signal.aborted || axios.isCancel(e)) return
        setItems([])
        setError(messageFromLoadError(e, LOAD_ERROR_FALLBACK))
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    },
    [enabled],
  )

  useAbortableEffect(load, [load, reloadKey])

  return { items, loading, error, reload }
}
