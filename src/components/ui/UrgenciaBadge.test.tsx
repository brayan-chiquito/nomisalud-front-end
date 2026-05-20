import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UrgenciaBadge } from './UrgenciaBadge'

describe('UrgenciaBadge', () => {
  it('muestra estilo y texto para rojo', () => {
    render(<UrgenciaBadge urgencia="rojo" />)
    expect(screen.getByText('Urgente')).toBeInTheDocument()
    expect(screen.getByTitle('Urgente')).toHaveClass('text-danger-text')
  })

  it('muestra amarillo y verde', () => {
    const { rerender } = render(<UrgenciaBadge urgencia="amarillo" />)
    expect(screen.getByText('Alerta')).toBeInTheDocument()
    rerender(<UrgenciaBadge urgencia="verde" />)
    expect(screen.getByText('En plazo')).toBeInTheDocument()
  })

  it('muestra sin dato cuando la urgencia es desconocida', () => {
    render(<UrgenciaBadge urgencia="otro" />)
    expect(screen.getByText('Sin dato')).toBeInTheDocument()
  })
})
