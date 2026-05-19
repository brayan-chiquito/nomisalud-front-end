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

  it('muestra éxito cuando override ya está registrado', () => {
    render(
      <InconsistenciasReviewBanner
        items={items}
        justificacion=""
        onJustificacionChange={() => undefined}
        onRegistrarOverride={() => undefined}
        overrideRegistrado
      />,
    )
    expect(screen.getByText(/excepción registrada/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /registrar excepción/i })).not.toBeInTheDocument()
  })

  it('muestra error y deshabilita envío con justificación corta', () => {
    render(
      <InconsistenciasReviewBanner
        items={items}
        justificacion="corta"
        onJustificacionChange={() => undefined}
        onRegistrarOverride={() => undefined}
        overrideRegistrado={false}
        error="No se pudo registrar"
      />,
    )
    expect(screen.getByText('No se pudo registrar')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrar excepción/i })).toBeDisabled()
  })

  it('notifica cambios en la justificación', () => {
    const onChange = vi.fn()
    render(
      <InconsistenciasReviewBanner
        items={items}
        justificacion=""
        onJustificacionChange={onChange}
        onRegistrarOverride={() => undefined}
        overrideRegistrado={false}
      />,
    )
    fireEvent.change(screen.getByLabelText(/justificación de la excepción/i), {
      target: { value: 'Texto de prueba largo' },
    })
    expect(onChange).toHaveBeenCalledWith('Texto de prueba largo')
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
