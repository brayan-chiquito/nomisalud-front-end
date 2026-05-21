import { useCallback, useState } from 'react'
import axios from 'axios'
import { fetchReportesKpis } from '../services/reportesKpis.service'
import type { ReportesKpisResponse } from '../types/reportesKpis'
import {
  REPORTES_KPIS_FORBIDDEN_ERROR,
  REPORTES_KPIS_LOAD_ERROR,
} from '../utils/reportesKpisDisplay'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'

export type UseReportesKpisResult = Readonly<{
  data: ReportesKpisResponse | null
  loading: boolean
  error: string | null
  reload: () => void
}>

function messageFromReportesKpisError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 403) return REPORTES_KPIS_FORBIDDEN_ERROR
    if (status === 401) return 'Sesión expirada. Inicia sesión de nuevo.'
  }
  return messageFromLoadError(error, REPORTES_KPIS_LOAD_ERROR)
}

export function useReportesKpis(): UseReportesKpisResult {
  const [data, setData] = useState<ReportesKpisResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const reload = useCallback(() => setReloadToken((n) => n + 1), [])

  const load = useCallback(async (signal: AbortSignal) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchReportesKpis(signal)
      if (!signal.aborted) setData(res)
    } catch (e) {
      if (signal.aborted || axios.isCancel(e)) return
      setData(null)
      setError(messageFromReportesKpisError(e))
    } finally {
      if (!signal.aborted) setLoading(false)
    }
  }, [])

  useAbortableEffect(load, [load, reloadToken])

  return { data, loading, error, reload }
}
