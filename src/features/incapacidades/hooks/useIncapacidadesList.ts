import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import {
  listIncapacidades,
  type IncapacidadesFilterParams,
} from '../services/listIncapacidades.service'
import type { IncapacidadesListResponse } from '../types/listIncapacidades'
import type { UrgenciaNivel } from '../types/urgencia'
import { ordenarPorUrgenciaDesc } from '../utils/urgencia'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'

const LOAD_ERROR_FALLBACK = 'No se pudo cargar el listado. Intenta de nuevo.'

export type UseIncapacidadesListOptions = Readonly<{
  entidadDebounceMs?: number
  /** Si se define, el listado siempre filtra por este estado (p. ej. `transcrita`). */
  fixedEstado?: string
  /** Expone `refetch()` para recargar sin cambiar filtros. */
  refetchable?: boolean
}>

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
  urgencia: '' | UrgenciaNivel
  setUrgencia: (v: '' | UrgenciaNivel) => void
  soloPagoRetrasado: boolean
  setSoloPagoRetrasado: (v: boolean) => void
  /** Filtros activos (misma lógica que el listado, con entidad ya debounced). */
  exportFilters: IncapacidadesFilterParams
  refetch?: () => void
}>

function normalizeOptions(
  optionsOrDebounceMs: UseIncapacidadesListOptions | number = {},
): UseIncapacidadesListOptions {
  return typeof optionsOrDebounceMs === 'number'
    ? { entidadDebounceMs: optionsOrDebounceMs }
    : optionsOrDebounceMs
}

export function useIncapacidadesList(
  optionsOrDebounceMs: UseIncapacidadesListOptions | number = {},
): UseIncapacidadesListResult {
  const {
    entidadDebounceMs = 350,
    fixedEstado,
    refetchable = false,
  } = normalizeOptions(optionsOrDebounceMs)

  const [page, setPage] = useState(1)
  const [estado, setEstadoState] = useState(fixedEstado ?? '')
  const [tipo, setTipoState] = useState('')
  const [entidadInput, setEntidadInput] = useState('')
  const [entidadDebounced, setEntidadDebounced] = useState('')
  const [urgencia, setUrgenciaState] = useState<'' | UrgenciaNivel>('')
  const [soloPagoRetrasado, setSoloPagoRetrasadoState] = useState(false)
  const [data, setData] = useState<IncapacidadesListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [listVersion, setListVersion] = useState(0)

  const estadoEfectivo = fixedEstado ?? estado

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

  const setEstado = useCallback(
    (v: string) => {
      if (fixedEstado) return
      setEstadoState(v)
      setPage(1)
    },
    [fixedEstado],
  )

  const setTipo = useCallback((v: string) => {
    setTipoState(v)
    setPage(1)
  }, [])

  const setUrgencia = useCallback((v: '' | UrgenciaNivel) => {
    setUrgenciaState(v)
    setPage(1)
  }, [])

  const setSoloPagoRetrasado = useCallback(
    (v: boolean) => {
      setSoloPagoRetrasadoState(v)
      setPage(1)
      if (v && !fixedEstado) setEstadoState('cobrada')
    },
    [fixedEstado],
  )

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
          ...(estadoEfectivo ? { estado: estadoEfectivo } : {}),
          ...(tipo ? { tipo } : {}),
          ...(entidadDebounced ? { entidad: entidadDebounced } : {}),
          ...(urgencia ? { urgencia } : {}),
          ...(soloPagoRetrasado ? { pagoRetrasado: true } : {}),
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
    [page, estadoEfectivo, tipo, entidadDebounced, urgencia, soloPagoRetrasado],
  )

  const effectDeps = refetchable ? [load, listVersion] : [load]
  useAbortableEffect(load, effectDeps)

  const exportFilters = useMemo<IncapacidadesFilterParams>(
    () => ({
      ...(estadoEfectivo ? { estado: estadoEfectivo } : {}),
      ...(tipo ? { tipo } : {}),
      ...(entidadDebounced ? { entidad: entidadDebounced } : {}),
      ...(urgencia ? { urgencia } : {}),
      ...(soloPagoRetrasado ? { pagoRetrasado: true } : {}),
    }),
    [estadoEfectivo, tipo, entidadDebounced, urgencia, soloPagoRetrasado],
  )

  return {
    data,
    loading,
    error,
    page,
    setPage,
    estado: estadoEfectivo,
    setEstado,
    tipo,
    setTipo,
    entidadInput,
    setEntidadInput,
    urgencia,
    setUrgencia,
    soloPagoRetrasado,
    setSoloPagoRetrasado,
    exportFilters,
    ...(refetchable ? { refetch } : {}),
  }
}
