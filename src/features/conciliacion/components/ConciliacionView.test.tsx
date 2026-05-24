import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConciliacionView } from './ConciliacionView'
import { useConciliacion } from '../hooks/useConciliacion'

vi.mock('../hooks/useConciliacion', () => ({
  useConciliacion: vi.fn(),
}))

vi.mock('@/hooks/useEntidadSuggestions', () => ({
  useEntidadSuggestions: () => ({ suggestions: ['SIS'], loading: false }),
}))

const mockHook = {
  mes: 5,
  setMes: vi.fn(),
  anio: 2026,
  setAnio: vi.fn(),
  entidadInput: 'SIS',
  setEntidadInput: vi.fn(),
  data: null as ReturnType<typeof useConciliacion>['data'],
  loading: false,
  error: null as string | null,
  canQuery: true,
  exporting: false,
  exportError: null as string | null,
  exportar: vi.fn(),
}

describe('ConciliacionView', () => {
  beforeEach(() => {
    vi.mocked(useConciliacion).mockReturnValue({ ...mockHook })
  })

  it('muestra título y periodo con canQuery', () => {
    render(<ConciliacionView />)
    expect(screen.getByRole('heading', { name: /conciliación/i })).toBeInTheDocument()
    expect(screen.getByText(/mayo 2026/i)).toBeInTheDocument()
  })

  it('muestra periodo con entidad cuando hay data', () => {
    vi.mocked(useConciliacion).mockReturnValue({
      ...mockHook,
      data: {
        entidad: 'SIS',
        mes: 5,
        anio: 2026,
        total_cobrado: '0',
        total_pagado: '100',
        diferencia: '-100',
        cantidad_cobrada_periodo: 0,
        cantidad_pendiente_pago: 0,
        pendientes: [],
        detalle: [],
      },
    })
    render(<ConciliacionView />)
    expect(screen.getByText(/mayo 2026 · sis/i)).toBeInTheDocument()
  })

  it('muestra alerta de error de carga', () => {
    vi.mocked(useConciliacion).mockReturnValue({
      ...mockHook,
      error: 'No se pudo cargar',
    })
    render(<ConciliacionView />)
    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo cargar')
  })
})
