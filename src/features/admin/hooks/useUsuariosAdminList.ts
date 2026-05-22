import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { listUsuariosAdmin } from '../services/usuariosAdmin.service'
import type { UsuariosAdminListResponse } from '../types/usuarioAdmin'
import { USUARIOS_ADMIN_PAGE_SIZE } from '../utils/usuarioAdminDisplay'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'

const LOAD_ERROR_FALLBACK = 'No se pudo cargar la lista de usuarios. Intenta de nuevo.'
const SEARCH_DEBOUNCE_MS = 350

export type ActivoFilter = '' | 'true' | 'false'

export type UseUsuariosAdminListResult = Readonly<{
  data: UsuariosAdminListResponse | null
  loading: boolean
  error: string | null
  page: number
  setPage: (p: number | ((n: number) => number)) => void
  roleFilter: string
  setRoleFilter: (v: string) => void
  activoFilter: ActivoFilter
  setActivoFilter: (v: ActivoFilter) => void
  search: string
  setSearch: (v: string) => void
  pageSize: number
  reload: () => void
}>

export function useUsuariosAdminList(): UseUsuariosAdminListResult {
  const [page, setPage] = useState(1)
  const [roleFilter, setRoleFilter] = useState('')
  const [activoFilter, setActivoFilter] = useState<ActivoFilter>('')
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const [data, setData] = useState<UsuariosAdminListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const requestSeq = useRef(0)

  useEffect(() => {
    const t = globalThis.setTimeout(() => setSearchDebounced(search.trim()), SEARCH_DEBOUNCE_MS)
    return () => globalThis.clearTimeout(t)
  }, [search])

  const skipFilterPageReset = useRef(true)
  const prevSearchDebounced = useRef<string | undefined>(undefined)
  useEffect(() => {
    if (prevSearchDebounced.current === undefined) {
      prevSearchDebounced.current = searchDebounced
      return
    }
    if (prevSearchDebounced.current !== searchDebounced) {
      prevSearchDebounced.current = searchDebounced
      setPage(1)
    }
  }, [searchDebounced])

  useEffect(() => {
    if (skipFilterPageReset.current) {
      skipFilterPageReset.current = false
      return
    }
    setPage(1)
  }, [roleFilter, activoFilter])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  useAbortableEffect(
    async (signal) => {
      const seq = ++requestSeq.current
      setLoading(true)
      setError(null)
      try {
        let activo: boolean | undefined
        if (activoFilter === 'true') activo = true
        else if (activoFilter === 'false') activo = false
        const res = await listUsuariosAdmin({
          page,
          page_size: USUARIOS_ADMIN_PAGE_SIZE,
          role: roleFilter || undefined,
          activo,
          q: searchDebounced || undefined,
          signal,
        })
        if (!signal.aborted && seq === requestSeq.current) setData(res)
      } catch (e) {
        if (signal.aborted || axios.isCancel(e)) return
        if (seq === requestSeq.current) {
          setData(null)
          setError(messageFromLoadError(e, LOAD_ERROR_FALLBACK))
        }
      } finally {
        if (!signal.aborted && seq === requestSeq.current) setLoading(false)
      }
    },
    [page, roleFilter, activoFilter, searchDebounced, reloadKey],
  )

  return {
    data,
    loading,
    error,
    page,
    setPage,
    roleFilter,
    setRoleFilter,
    activoFilter,
    setActivoFilter,
    search,
    setSearch,
    pageSize: USUARIOS_ADMIN_PAGE_SIZE,
    reload,
  }
}
