import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { PlazoEntidadItem } from '../../types/plazoEntidad'
import { PlazoEntidadEditModal } from './PlazoEntidadEditModal'

vi.mock('../../services/plazosEntidad.service', () => ({
  updatePlazoEntidad: vi.fn(),
}))

import { updatePlazoEntidad } from '../../services/plazosEntidad.service'

const plazo: PlazoEntidadItem = {
  id: 'p1',
  entidad_nombre: 'Salud Total',
  tipo_incapacidad: 'general',
  valor_limite: 15,
  unidad_limite: 'dias',
  dias_limite: 15,
  dias_alerta: 3,
  dias_promedio_pago: 30,
}

describe('PlazoEntidadEditModal', () => {
  beforeEach(() => {
    vi.mocked(updatePlazoEntidad).mockReset()
  })

  it('actualiza plazo cuando hay cambios', async () => {
    vi.mocked(updatePlazoEntidad).mockResolvedValue({ ...plazo, entidad_nombre: 'EPS Sura' })
    const onSuccess = vi.fn()
    const user = userEvent.setup()

    render(<PlazoEntidadEditModal plazo={plazo} onClose={vi.fn()} onSuccess={onSuccess} />)

    await user.clear(screen.getByLabelText(/^entidad/i))
    await user.type(screen.getByLabelText(/^entidad/i), 'EPS Sura')
    await user.click(screen.getByRole('button', { name: /guardar cambios/i }))

    await waitFor(() =>
      expect(updatePlazoEntidad).toHaveBeenCalledWith('p1', { entidad_nombre: 'EPS Sura' }),
    )
    expect(onSuccess).toHaveBeenCalled()
  })

  it('muestra error si no hay cambios', async () => {
    const user = userEvent.setup()
    render(<PlazoEntidadEditModal plazo={plazo} onClose={vi.fn()} onSuccess={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /guardar cambios/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/no hay cambios/i)
    expect(updatePlazoEntidad).not.toHaveBeenCalled()
  })
})
