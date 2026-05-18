import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { listMisIncapacidades } from '../services/listMisIncapacidades.service'
import type { MisIncapacidadesResponse } from '../types/misIncapacidades'

function messageFromLoadError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const d = error.response?.data
    if (d && typeof d === 'object' && 'detail' in d) {
      const detail = (d as { detail: unknown }).detail
      if (typeof detail === 'string') return detail
    }
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return 'No se pudieron cargar tus trámites. Intenta de nuevo.'
}

export type UseMisIncapacidadesResult = Readonly<{
  data: MisIncapacidadesResponse | null
  loading: boolean
  error: string | null
  page: number
  setPage: (p: number | ((prev: number) => number)) => void
  reload: () => void
}>

export function useMisIncapacidades(enabled = true): UseMisIncapacidadesResult {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<MisIncapacidadesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const reload = useCallback(() => setReloadToken((n) => n + 1), [])

  const load = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true)
      setError(null)
      try {
        const res = await listMisIncapacidades({ page, signal })
        if (!signal.aborted) setData(res)
      } catch (e) {
        if (signal.aborted || axios.isCancel(e)) return
        setData(null)
        setError(messageFromLoadError(e))
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    },
    [page],
  )

  useEffect(() => {
    if (!enabled) return
    const ac = new AbortController()
    void load(ac.signal)
    return () => ac.abort()
  }, [load, enabled, reloadToken])

  return {
    data,
    loading: enabled && loading,
    error,
    page,
    setPage,
    reload,
  }
}
