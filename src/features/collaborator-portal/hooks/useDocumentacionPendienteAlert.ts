import { useCallback, useEffect, useMemo, useState } from 'react'
import { getIncapacidadDetalle } from '@/features/incapacity-ai-review/services/incapacidadReview.service'
import type { IncapacidadDetalle } from '@/features/incapacity-ai-review/types/incapacidadDetalle'
import type { MisIncapacidadItem } from '../types/misIncapacidades'
import {
  documentacionPendienteFromDetalle,
  type DocumentacionPendienteData,
} from '../utils/documentacionPendiente'

export type UseDocumentacionPendienteAlertResult = Readonly<{
  data: DocumentacionPendienteData | null
  loading: boolean
}>

/**
 * Resuelve datos del banner: usa el detalle en pantalla o carga el primer trámite en `doc_incompleta` del listado.
 */
export function useDocumentacionPendienteAlert(
  tramiteDetalle: IncapacidadDetalle | null | undefined,
  listItems: readonly MisIncapacidadItem[],
  enabled: boolean,
): UseDocumentacionPendienteAlertResult {
  const [fetchedDetail, setFetchedDetail] = useState<IncapacidadDetalle | null>(null)
  const [loading, setLoading] = useState(false)

  const fromRoute = useMemo(
    () => documentacionPendienteFromDetalle(tramiteDetalle),
    [tramiteDetalle],
  )

  const tramiteIdParaFetch = useMemo(() => {
    if (!enabled || fromRoute || tramiteDetalle) return null
    const hit = listItems.find((it) => it.estado === 'doc_incompleta')
    return hit?.id ?? null
  }, [enabled, fromRoute, tramiteDetalle, listItems])

  const load = useCallback(async (id: string, signal: AbortSignal) => {
    setLoading(true)
    setFetchedDetail(null)
    try {
      const d = await getIncapacidadDetalle(id, signal)
      if (!signal.aborted) setFetchedDetail(d)
    } catch {
      if (!signal.aborted) setFetchedDetail(null)
    } finally {
      if (!signal.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!tramiteIdParaFetch) return
    const ac = new AbortController()
    load(tramiteIdParaFetch, ac.signal).catch(() => {
      /* errores gestionados dentro de load */
    })
    return () => ac.abort()
  }, [tramiteIdParaFetch, load])

  const data = useMemo(() => {
    if (fromRoute) return fromRoute
    if (!tramiteIdParaFetch) return null
    return documentacionPendienteFromDetalle(fetchedDetail)
  }, [fromRoute, tramiteIdParaFetch, fetchedDetail])

  return { data, loading: Boolean(tramiteIdParaFetch) && loading && !data }
}
