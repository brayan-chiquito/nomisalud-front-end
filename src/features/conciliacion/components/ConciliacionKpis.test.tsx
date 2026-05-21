import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConciliacionKpis } from './ConciliacionKpis'
import type { ConciliacionResponse } from '../types/conciliacion'

const mockData: ConciliacionResponse = {
  entidad: 'SIS',
  mes: 5,
  anio: 2026,
  total_cobrado: '0',
  total_pagado: '2000000',
  diferencia: '-2000000',
  cantidad_cobrada_periodo: 0,
  cantidad_pendiente_pago: 0,
  pendientes: [],
  detalle: [],
}

describe('ConciliacionKpis', () => {
  it('no renderiza sin datos ni carga', () => {
    const { container } = render(<ConciliacionKpis data={null} loading={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('muestra skeleton mientras carga sin datos previos', () => {
    const { container } = render(<ConciliacionKpis data={null} loading />)
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(5)
  })

  it('muestra KPIs con montos formateados', () => {
    render(<ConciliacionKpis data={mockData} loading={false} />)
    expect(screen.getByText('Total cobrado')).toBeInTheDocument()
    expect(screen.getByText('Total pagado')).toBeInTheDocument()
    expect(screen.getByText('Diferencia')).toBeInTheDocument()
    expect(screen.getByText('Cobradas en periodo')).toBeInTheDocument()
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(2)
  })
})
