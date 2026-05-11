import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { listIncapacidades } from '../services/listIncapacidades.service'
import type { IncapacidadesListResponse } from '../types/listIncapacidades'

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
  return 'No se pudo cargar el listado. Intenta de nuevo.'
}

export type UseIncapacidadesListResult = Readonly<{
  data: IncapacidadesListResponse | null
  loading: boolean
  error: string | null
  page: number
  setPage: (p: number | ((n: number) => number)) => void
  estado: string
  setEstado: (v: string) => void
  tipo: string
  setTipo: (v: string) => void
  entidadInput: string
  setEntidadInput: (v: string) => void
}>

export function useIncapacidadesList(entidadDebounceMs = 350): UseIncapacidadesListResult {
  const [page, setPage] = useState(1)
  const [estado, setEstadoState] = useState('')
  const [tipo, setTipoState] = useState('')
  const [entidadInput, setEntidadInput] = useState('')
  const [entidadDebounced, setEntidadDebounced] = useState('')
  const [data, setData] = useState<IncapacidadesListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const setEstado = useCallback((v: string) => {
    setEstadoState(v)
    setPage(1)
  }, [])

  const setTipo = useCallback((v: string) => {
    setTipoState(v)
    setPage(1)
  }, [])

  const load = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true)
      setError(null)
      try {
        const res = await listIncapacidades({
          page,
          ...(estado ? { estado } : {}),
          ...(tipo ? { tipo } : {}),
          ...(entidadDebounced ? { entidad: entidadDebounced } : {}),
          signal,
        })
        if (!signal.aborted) setData(res)
      } catch (e) {
        if (signal.aborted || axios.isCancel(e)) return
        setData(null)
        setError(messageFromLoadError(e))
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    },
    [page, estado, tipo, entidadDebounced],
  )

  useEffect(() => {
    const ac = new AbortController()
    void load(ac.signal)
    return () => ac.abort()
  }, [load])

  return {
    data,
    loading,
    error,
    page,
    setPage,
    estado,
    setEstado,
    tipo,
    setTipo,
    entidadInput,
    setEntidadInput,
  }
}
