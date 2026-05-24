import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlazoEntidadCreateModal } from './PlazoEntidadCreateModal'

vi.mock('../../services/plazosEntidad.service', () => ({
  createPlazoEntidad: vi.fn(),
}))

import { createPlazoEntidad } from '../../services/plazosEntidad.service'

describe('PlazoEntidadCreateModal', () => {
  beforeEach(() => {
    vi.mocked(createPlazoEntidad).mockReset()
  })

  it('crea plazo con datos válidos', async () => {
    vi.mocked(createPlazoEntidad).mockResolvedValue({
      id: 'n1',
      entidad_nombre: 'Nueva EPS',
      tipo_incapacidad: 'general',
      valor_limite: 10,
      unidad_limite: 'dias',
      dias_limite: 10,
      dias_alerta: 2,
      dias_promedio_pago: null,
    })
    const onSuccess = vi.fn()
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<PlazoEntidadCreateModal isOpen onClose={onClose} onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText(/^entidad/i), 'Nueva EPS')
    await user.clear(screen.getByLabelText(/plazo límite/i))
    await user.type(screen.getByLabelText(/plazo límite/i), '10')
    await user.clear(screen.getByLabelText(/días de alerta/i))
    await user.type(screen.getByLabelText(/días de alerta/i), '2')
    await user.click(screen.getByRole('button', { name: /crear plazo/i }))

    await waitFor(() => expect(createPlazoEntidad).toHaveBeenCalled())
    expect(onSuccess).toHaveBeenCalled()
  })

  it('muestra error de validación local', async () => {
    const user = userEvent.setup()
    render(<PlazoEntidadCreateModal isOpen onClose={vi.fn()} onSuccess={vi.fn()} />)

    await user.type(screen.getByLabelText(/^entidad/i), '   ')
    await user.type(screen.getByLabelText(/plazo límite/i), '10')
    await user.type(screen.getByLabelText(/días de alerta/i), '2')
    await user.click(screen.getByRole('button', { name: /crear plazo/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/nombre de la entidad/i)
    expect(createPlazoEntidad).not.toHaveBeenCalled()
  })
})
