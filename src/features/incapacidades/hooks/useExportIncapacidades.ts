import { useCallback, useState } from 'react'
import { exportIncapacidadesXlsx } from '../services/exportIncapacidades.service'
import type { IncapacidadesFilterParams } from '../services/listIncapacidades.service'
import { messageFromIncapacidadesExportError } from '../utils/incapacidadesExportMessage'

export type UseExportIncapacidadesResult = Readonly<{
  exporting: boolean
  exportError: string | null
  exportar: () => Promise<void>
  clearExportError: () => void
}>

export function useExportIncapacidades(
  getFilters: () => IncapacidadesFilterParams,
): UseExportIncapacidadesResult {
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const clearExportError = useCallback(() => setExportError(null), [])

  const exportar = useCallback(async () => {
    setExportError(null)
    setExporting(true)
    try {
      await exportIncapacidadesXlsx(getFilters())
    } catch (e) {
      setExportError(await messageFromIncapacidadesExportError(e))
    } finally {
      setExporting(false)
    }
  }, [getFilters])

  return { exporting, exportError, exportar, clearExportError }
}
