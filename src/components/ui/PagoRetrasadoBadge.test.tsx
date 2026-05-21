import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PagoRetrasadoBadge } from './PagoRetrasadoBadge'

describe('PagoRetrasadoBadge', () => {
  it('renderiza etiqueta de alerta', () => {
    render(<PagoRetrasadoBadge />)
    expect(screen.getByText('Pago retrasado')).toBeInTheDocument()
  })
})
