import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { InconsistenciasReviewBanner } from './InconsistenciasReviewBanner'

const items = [{ tipo: 'Fechas', descripcion: 'Fin anterior al inicio' }] as const

describe('InconsistenciasReviewBanner', () => {
  it('no renderiza sin hallazgos', () => {
    const { container } = render(
      <InconsistenciasReviewBanner
        items={[]}
        justificacion=""
        onJustificacionChange={() => undefined}
        onRegistrarOverride={() => undefined}
        overrideRegistrado={false}
      />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('lista tipo y descripción de cada inconsistencia', () => {
    render(
      <InconsistenciasReviewBanner
        items={items}
        justificacion=""
        onJustificacionChange={() => undefined}
        onRegistrarOverride={() => undefined}
        overrideRegistrado={false}
      />,
    )
    expect(screen.getByText('Fechas')).toBeInTheDocument()
    expect(screen.getByText('Fin anterior al inicio')).toBeInTheDocument()
  })

  it('registra override al enviar justificación', () => {
    const onRegistrar = vi.fn()
    const onChange = vi.fn()
    render(
      <InconsistenciasReviewBanner
        items={items}
        justificacion="Revisión manual aprobada por RRHH"
        onJustificacionChange={onChange}
        onRegistrarOverride={onRegistrar}
        overrideRegistrado={false}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /registrar excepción/i }))
    expect(onRegistrar).toHaveBeenCalled()
  })
})
