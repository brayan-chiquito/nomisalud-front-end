import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { AUDITORIA_PAGE_SIZE, listAuditoriaAccesos } from '../services/listAuditoriaAccesos.service'
import type { AuditoriaAccesosListResponse } from '../types/auditoriaAcceso'
import type { UsuarioAuditoriaOption } from '../utils/auditoriaUsuarioSearch'
import { dateInputToIsoEnd, dateInputToIsoStart } from '../utils/auditoriaDisplay'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { isUuid } from '@/utils/uuid'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'

const LOAD_ERROR_FALLBACK = 'No se pudo cargar el registro de auditoría. Intenta de nuevo.'
const FILTER_DEBOUNCE_MS = 350

export type UseAuditoriaAccesosResult = Readonly<{
  data: AuditoriaAccesosListResponse | null
  loading: boolean
  error: string | null
  filterError: string | null
  page: number
  setPage: (p: number | ((n: number) => number)) => void
  usuario: string
  setUsuario: (v: string) => void
  selectUsuario: (option: UsuarioAuditoriaOption) => void
  accion: string
  setAccion: (v: string) => void
  fechaDesde: string
  setFechaDesde: (v: string) => void
  fechaHasta: string
  setFechaHasta: (v: string) => void
  pageSize: number
}>

export function useAuditoriaAccesos(): UseAuditoriaAccesosResult {
  const [page, setPage] = useState(1)
  const [usuario, setUsuario] = useState('')
  const [pinnedUserId, setPinnedUserId] = useState<string | null>(null)
  const [accion, setAccion] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [usuarioDebounced, setUsuarioDebounced] = useState('')
  const [accionDebounced, setAccionDebounced] = useState('')
  const [data, setData] = useState<AuditoriaAccesosListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterError, setFilterError] = useState<string | null>(null)

  useEffect(() => {
    const t = globalThis.setTimeout(() => setUsuarioDebounced(usuario.trim()), FILTER_DEBOUNCE_MS)
    return () => globalThis.clearTimeout(t)
  }, [usuario])

  useEffect(() => {
    const t = globalThis.setTimeout(() => setAccionDebounced(accion.trim()), FILTER_DEBOUNCE_MS)
    return () => globalThis.clearTimeout(t)
  }, [accion])

  const skipFilterPageReset = useRef(true)
  useEffect(() => {
    if (skipFilterPageReset.current) {
      skipFilterPageReset.current = false
      return
    }
    setPage(1)
  }, [usuarioDebounced, accionDebounced, fechaDesde, fechaHasta])

  const handleSetUsuario = useCallback((value: string) => {
    setUsuario(value)
    setPinnedUserId(null)
  }, [])

  const selectUsuario = useCallback((option: UsuarioAuditoriaOption) => {
    setUsuario(option.email || option.label)
    setPinnedUserId(option.id)
  }, [])

  const load = useCallback(
    async (signal: AbortSignal) => {
      const userTrim = usuarioDebounced
      let userIdParam: string | undefined
      let usuarioQ: string | undefined

      if (userTrim) {
        if (pinnedUserId) {
          userIdParam = pinnedUserId
        } else if (isUuid(userTrim)) {
          userIdParam = userTrim
        } else if (userTrim.length >= 2) {
          usuarioQ = userTrim
        }
      }

      setFilterError(null)
      setLoading(true)
      setError(null)
      try {
        const res = await listAuditoriaAccesos({
          page,
          page_size: AUDITORIA_PAGE_SIZE,
          user_id: userIdParam,
          q: usuarioQ,
          accion: accionDebounced || undefined,
          fecha_desde: dateInputToIsoStart(fechaDesde),
          fecha_hasta: dateInputToIsoEnd(fechaHasta),
          signal,
        })
        if (!signal.aborted) setData(res)
      } catch (e) {
        if (signal.aborted || axios.isCancel(e)) return
        setData(null)
        setError(messageFromLoadError(e, LOAD_ERROR_FALLBACK))
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    },
    [page, usuarioDebounced, pinnedUserId, accionDebounced, fechaDesde, fechaHasta],
  )

  useAbortableEffect(load, [load])

  return {
    data,
    loading,
    error,
    filterError,
    page,
    setPage,
    usuario,
    setUsuario: handleSetUsuario,
    selectUsuario,
    accion,
    setAccion,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    pageSize: AUDITORIA_PAGE_SIZE,
  }
}
