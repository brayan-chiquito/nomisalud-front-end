import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { getConciliacion, exportConciliacionExcel } from '../services/conciliacion.service'
import type { ConciliacionResponse } from '../types/conciliacion'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'

const LOAD_ERROR = 'No se pudo cargar la conciliación. Verifica los filtros e intenta de nuevo.'
const EXPORT_ERROR = 'No se pudo exportar el reporte. Intenta de nuevo.'

const now = new Date()

export type UseConciliacionResult = Readonly<{
  mes: number
  setMes: (m: number) => void
  anio: number
  setAnio: (a: number) => void
  entidadInput: string
  setEntidadInput: (v: string) => void
  data: ConciliacionResponse | null
  loading: boolean
  error: string | null
  canQuery: boolean
  exporting: boolean
  exportError: string | null
  exportar: () => Promise<void>
}>

export function useConciliacion(entidadDebounceMs = 400): UseConciliacionResult {
  const [mes, setMes] = useState(now.getMonth() + 1)
  const [anio, setAnio] = useState(now.getFullYear())
  const [entidadInput, setEntidadInput] = useState('')
  const [entidadDebounced, setEntidadDebounced] = useState('')
  const [data, setData] = useState<ConciliacionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  useEffect(() => {
    const t = globalThis.setTimeout(
      () => setEntidadDebounced(entidadInput.trim()),
      entidadDebounceMs,
    )
    return () => globalThis.clearTimeout(t)
  }, [entidadInput, entidadDebounceMs])

  const canQuery = entidadDebounced.length >= 2

  const load = useCallback(
    async (signal: AbortSignal) => {
      if (!canQuery) {
        setData(null)
        setError(null)
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const res = await getConciliacion({
          entidad: entidadDebounced,
          mes,
          anio,
          signal,
        })
        if (!signal.aborted) setData(res)
      } catch (e) {
        if (signal.aborted || axios.isCancel(e)) return
        setData(null)
        setError(messageFromLoadError(e, LOAD_ERROR))
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    },
    [canQuery, entidadDebounced, mes, anio],
  )

  useAbortableEffect(load, [load])

  const exportar = useCallback(async () => {
    setExportError(null)
    setExporting(true)
    try {
      await exportConciliacionExcel({
        mes,
        anio,
        ...(entidadDebounced ? { entidad: entidadDebounced } : {}),
      })
    } catch (e) {
      setExportError(messageFromLoadError(e, EXPORT_ERROR))
    } finally {
      setExporting(false)
    }
  }, [mes, anio, entidadDebounced])

  return {
    mes,
    setMes,
    anio,
    setAnio,
    entidadInput,
    setEntidadInput,
    data,
    loading,
    error,
    canQuery,
    exporting,
    exportError,
    exportar,
  }
}
