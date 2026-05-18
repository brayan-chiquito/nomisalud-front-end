import { useCallback, useEffect, useState } from 'react'
import { getIncapacidadDetalle } from '@/features/incapacity-ai-review/services/incapacidadReview.service'
import type { IncapacidadDetalle } from '@/features/incapacity-ai-review/types/incapacidadDetalle'
import { messageFromHttpError } from '@/features/incapacity-ai-review/utils/httpErrorMessage'

export type UseMiTramiteDetalleResult = Readonly<{
  detail: IncapacidadDetalle | null
  loading: boolean
  error: string | null
}>

export function useMiTramiteDetalle(tramiteId: string | undefined): UseMiTramiteDetalleResult {
  const [detail, setDetail] = useState<IncapacidadDetalle | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (id: string, signal: AbortSignal) => {
    setLoading(true)
    setError(null)
    setDetail(null)
    try {
      const d = await getIncapacidadDetalle(id, signal)
      if (!signal.aborted) setDetail(d)
    } catch (e) {
      if (signal.aborted) return
      setDetail(null)
      setError(messageFromHttpError(e))
    } finally {
      if (!signal.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!tramiteId) return
    const ac = new AbortController()
    load(tramiteId, ac.signal).catch(() => {
      /* errores gestionados dentro de load */
    })
    return () => ac.abort()
  }, [tramiteId, load])

  if (!tramiteId) {
    return { detail: null, loading: false, error: null }
  }

  return { detail, loading, error }
}
