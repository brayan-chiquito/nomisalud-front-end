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
import {
  incapacidadesSearchFilterParams,
  listIncapacidadesWithTextSearch,
} from '../utils/listIncapacidadSearch'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'
import { awaitMinBusyDuration } from '@/utils/awaitMinBusyDuration'

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
  /** Primera carga sin datos previos (spinner de tabla completa). */
  loading: boolean
  /** Recarga por filtro/búsqueda manteniendo filas visibles. */
  fetching: boolean
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
  /** Filtros de panel (estado, tipo, urgencia…) sin texto de búsqueda — para autocompletado. */
  listFilters: IncapacidadesFilterParams
  /** Filtros activos incluyendo búsqueda debounced (exportación XLSX). */
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
  const [searchDebounced, setSearchDebounced] = useState('')
  const [urgencia, setUrgenciaState] = useState<'' | UrgenciaNivel>('')
  const [soloPagoRetrasado, setSoloPagoRetrasadoState] = useState(false)
  const [data, setData] = useState<IncapacidadesListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [listVersion, setListVersion] = useState(0)
  const hasLoadedOnceRef = useRef(false)

  const estadoEfectivo = fixedEstado ?? estado

  const prevSearch = useRef<string | undefined>(undefined)
  useEffect(() => {
    const t = globalThis.setTimeout(
      () => setSearchDebounced(entidadInput.trim()),
      entidadDebounceMs,
    )
    return () => globalThis.clearTimeout(t)
  }, [entidadInput, entidadDebounceMs])

  useEffect(() => {
    if (prevSearch.current === undefined) {
      prevSearch.current = searchDebounced
      return
    }
    if (prevSearch.current !== searchDebounced) {
      prevSearch.current = searchDebounced
      setPage(1)
    }
  }, [searchDebounced])

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
      const isBackground = hasLoadedOnceRef.current
      const busyStartedAt = Date.now()
      if (isBackground) setFetching(true)
      else setLoading(true)
      setError(null)
      try {
        const base = {
          page,
          ...(estadoEfectivo ? { estado: estadoEfectivo } : {}),
          ...(tipo ? { tipo } : {}),
          ...(urgencia ? { urgencia } : {}),
          ...(soloPagoRetrasado ? { pagoRetrasado: true } : {}),
        }
        const res = searchDebounced
          ? await listIncapacidadesWithTextSearch(base, searchDebounced, signal)
          : await listIncapacidades({ ...base, signal })
        if (!signal.aborted) {
          if (isBackground) await awaitMinBusyDuration(busyStartedAt, signal)
        }
        if (!signal.aborted) {
          hasLoadedOnceRef.current = true
          setData({
            ...res,
            items: ordenarPorUrgenciaDesc(res.items),
          })
        }
      } catch (e) {
        if (signal.aborted || axios.isCancel(e)) return
        hasLoadedOnceRef.current = false
        setData(null)
        setError(messageFromLoadError(e, LOAD_ERROR_FALLBACK))
      } finally {
        if (!signal.aborted) {
          setLoading(false)
          setFetching(false)
        }
      }
    },
    [page, estadoEfectivo, tipo, searchDebounced, urgencia, soloPagoRetrasado],
  )

  const effectDeps = refetchable ? [load, listVersion] : [load]
  useAbortableEffect(load, effectDeps)

  const listFilters = useMemo<IncapacidadesFilterParams>(
    () => ({
      ...(estadoEfectivo ? { estado: estadoEfectivo } : {}),
      ...(tipo ? { tipo } : {}),
      ...(urgencia ? { urgencia } : {}),
      ...(soloPagoRetrasado ? { pagoRetrasado: true } : {}),
    }),
    [estadoEfectivo, tipo, urgencia, soloPagoRetrasado],
  )

  const exportFilters = useMemo<IncapacidadesFilterParams>(
    () => ({
      ...listFilters,
      ...(searchDebounced ? incapacidadesSearchFilterParams(searchDebounced) : {}),
    }),
    [listFilters, searchDebounced],
  )

  return {
    data,
    loading,
    fetching,
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
    listFilters,
    exportFilters,
    ...(refetchable ? { refetch } : {}),
  }
}
