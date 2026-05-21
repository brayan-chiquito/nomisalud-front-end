import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { listIncapacidades } from '@/features/incapacidades/services/listIncapacidades.service'
import type { IncapacidadesListResponse } from '@/features/incapacidades/types/listIncapacidades'
import { ordenarPorUrgenciaDesc } from '@/features/incapacidades/utils/urgencia'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'

const LOAD_ERROR_FALLBACK = 'No se pudo cargar el listado. Intenta de nuevo.'

export type UseTranscritasCobroListResult = Readonly<{
  data: IncapacidadesListResponse | null
  loading: boolean
  error: string | null
  page: number
  setPage: (p: number | ((n: number) => number)) => void
  tipo: string
  setTipo: (v: string) => void
  entidadInput: string
  setEntidadInput: (v: string) => void
  refetch: () => void
}>

/** Listado paginado `GET /incapacidades?estado=transcrita` para marcar cobrada. */
export function useTranscritasCobroList(entidadDebounceMs = 350): UseTranscritasCobroListResult {
  const [page, setPage] = useState(1)
  const [tipo, setTipo] = useState('')
  const [entidadInput, setEntidadInput] = useState('')
  const [entidadDebounced, setEntidadDebounced] = useState('')
  const [data, setData] = useState<IncapacidadesListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [listVersion, setListVersion] = useState(0)

  const prevEntidad = useRef<string | undefined>(undefined)
  useEffect(() => {
    const t = globalThis.setTimeout(
      () => setEntidadDebounced(entidadInput.trim()),
      entidadDebounceMs,
    )
    return () => globalThis.clearTimeout(t)
  }, [entidadInput, entidadDebounceMs])

  useEffect(() => {
    if (prevEntidad.current === undefined) {
      prevEntidad.current = entidadDebounced
      return
    }
    if (prevEntidad.current !== entidadDebounced) {
      prevEntidad.current = entidadDebounced
      setPage(1)
    }
  }, [entidadDebounced])

  const setTipoFilter = useCallback((v: string) => {
    setTipo(v)
    setPage(1)
  }, [])

  const refetch = useCallback(() => {
    setListVersion((n) => n + 1)
  }, [])

  const load = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true)
      setError(null)
      try {
        const res = await listIncapacidades({
          page,
          estado: 'transcrita',
          ...(tipo ? { tipo } : {}),
          ...(entidadDebounced ? { entidad: entidadDebounced } : {}),
          signal,
        })
        if (!signal.aborted) {
          setData({
            ...res,
            items: ordenarPorUrgenciaDesc(res.items),
          })
        }
      } catch (e) {
        if (signal.aborted || axios.isCancel(e)) return
        setData(null)
        setError(messageFromLoadError(e, LOAD_ERROR_FALLBACK))
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    },
    [page, tipo, entidadDebounced],
  )

  useAbortableEffect(load, [load, listVersion])

  return {
    data,
    loading,
    error,
    page,
    setPage,
    tipo,
    setTipo: setTipoFilter,
    entidadInput,
    setEntidadInput,
    refetch,
  }
}
