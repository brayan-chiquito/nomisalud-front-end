import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { AUDITORIA_PAGE_SIZE, listAuditoriaAccesos } from '../services/listAuditoriaAccesos.service'
import type { AuditoriaAccesosListResponse } from '../types/auditoriaAcceso'
import { dateInputToIsoEnd, dateInputToIsoStart } from '../utils/auditoriaDisplay'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'

const LOAD_ERROR_FALLBACK = 'No se pudo cargar el registro de auditoría. Intenta de nuevo.'

export type UseAuditoriaAccesosResult = Readonly<{
  data: AuditoriaAccesosListResponse | null
  loading: boolean
  error: string | null
  page: number
  setPage: (p: number | ((n: number) => number)) => void
  userId: string
  setUserId: (v: string) => void
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
  const [userId, setUserId] = useState('')
  const [accion, setAccion] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [data, setData] = useState<AuditoriaAccesosListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const skipFilterPageReset = useRef(true)
  useEffect(() => {
    if (skipFilterPageReset.current) {
      skipFilterPageReset.current = false
      return
    }
    setPage(1)
  }, [userId, accion, fechaDesde, fechaHasta])

  const load = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true)
      setError(null)
      try {
        const res = await listAuditoriaAccesos({
          page,
          page_size: AUDITORIA_PAGE_SIZE,
          user_id: userId.trim() || undefined,
          accion: accion.trim() || undefined,
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
    [page, userId, accion, fechaDesde, fechaHasta],
  )

  useAbortableEffect(load, [load])

  return {
    data,
    loading,
    error,
    page,
    setPage,
    userId,
    setUserId,
    accion,
    setAccion,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    pageSize: AUDITORIA_PAGE_SIZE,
  }
}
