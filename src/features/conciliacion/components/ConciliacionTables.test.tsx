import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConciliacionTables } from './ConciliacionTables'

const pendiente = {
  id: 'p1',
  radicado: 'IN0001',
  colaborador_nombre: 'Ana Gómez',
  entidad_nombre: 'SIS',
  incapacidad_tipo_extraido: 'general',
  fecha_recepcion: '2026-05-01T10:00:00Z',
  fecha_cobrada: '2026-05-10T10:00:00Z',
}

const detalle = {
  id: 'd1',
  radicado: 'IN0002',
  estado: 'pagada',
  colaborador_nombre: 'Juan Pérez',
  entidad_nombre: 'SIS',
  incapacidad_tipo_extraido: 'accidente',
  fecha_recepcion: '2026-05-02T10:00:00Z',
  monto_pagado: '500000',
  referencia_pago: 'LOTE-1',
  liquidado: true,
}

describe('ConciliacionTables', () => {
  it('no renderiza sin hasData ni loading', () => {
    const { container } = render(
      <ConciliacionTables pendientes={[]} detalle={[]} loading={false} hasData={false} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('muestra mensajes vacíos con hasData', () => {
    render(<ConciliacionTables pendientes={[]} detalle={[]} loading={false} hasData />)
    expect(screen.getByText(/no hay pendientes de liquidación/i)).toBeInTheDocument()
    expect(screen.getByText(/no hay detalle para el periodo/i)).toBeInTheDocument()
  })

  it('renderiza filas de pendientes y detalle', () => {
    render(
      <ConciliacionTables pendientes={[pendiente]} detalle={[detalle]} loading={false} hasData />,
    )
    expect(screen.getByText('IN0001')).toBeInTheDocument()
    expect(screen.getByText('IN0002')).toBeInTheDocument()
    expect(screen.getByText('Sí')).toBeInTheDocument()
  })
})
