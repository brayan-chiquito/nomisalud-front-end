import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useConciliacion } from './useConciliacion'
import { exportConciliacionExcel, getConciliacion } from '../services/conciliacion.service'

vi.mock('../services/conciliacion.service', () => ({
  getConciliacion: vi.fn(),
  exportConciliacionExcel: vi.fn(),
}))

const mockResponse = {
  entidad: 'NomiSalud',
  mes: 5,
  anio: 2024,
  total_cobrado: '1000',
  total_pagado: '800',
  diferencia: '200',
  cantidad_cobrada_periodo: 2,
  cantidad_pendiente_pago: 1,
  pendientes: [],
  detalle: [],
}

describe('useConciliacion', () => {
  beforeEach(() => {
    vi.mocked(getConciliacion).mockReset()
    vi.mocked(getConciliacion).mockResolvedValue(mockResponse)
  })

  it('no consulta sin entidad suficiente', async () => {
    const { result } = renderHook(() => useConciliacion(0))
    expect(result.current.canQuery).toBe(false)
    expect(getConciliacion).not.toHaveBeenCalled()
  })

  it('consulta al debounce de entidad', async () => {
    const { result } = renderHook(() => useConciliacion(0))
    act(() => result.current.setEntidadInput('EPS Sura'))
    await waitFor(() => expect(result.current.canQuery).toBe(true))
    await waitFor(() => expect(result.current.data?.entidad).toBe('NomiSalud'))
    expect(getConciliacion).toHaveBeenCalled()
  })

  it('expone error si falla la carga', async () => {
    vi.mocked(getConciliacion).mockRejectedValue(new Error('fallo'))
    const { result } = renderHook(() => useConciliacion(0))
    act(() => result.current.setEntidadInput('EPS'))
    await waitFor(() => expect(result.current.error).toBeTruthy())
    expect(result.current.data).toBeNull()
  })

  it('exportar descarga excel y limpia exporting', async () => {
    vi.mocked(exportConciliacionExcel).mockResolvedValue({ filename: 'a.xlsx' })
    const { result } = renderHook(() => useConciliacion(0))
    act(() => result.current.setEntidadInput('EPS'))
    await waitFor(() => expect(result.current.canQuery).toBe(true))
    await act(async () => {
      await result.current.exportar()
    })
    expect(exportConciliacionExcel).toHaveBeenCalled()
    expect(result.current.exporting).toBe(false)
    expect(result.current.exportError).toBeNull()
  })

  it('exportar guarda mensaje si falla', async () => {
    vi.mocked(exportConciliacionExcel).mockRejectedValue(new Error('export fail'))
    const { result } = renderHook(() => useConciliacion(0))
    act(() => result.current.setEntidadInput('EPS'))
    await waitFor(() => expect(result.current.canQuery).toBe(true))
    await act(async () => {
      await result.current.exportar()
    })
    expect(result.current.exportError).toBeTruthy()
    expect(result.current.exporting).toBe(false)
  })
})
