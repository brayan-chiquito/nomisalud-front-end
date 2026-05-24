import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { PlazoEntidadItem } from '../../types/plazoEntidad'
import { PlazoEntidadDeleteModal } from './PlazoEntidadDeleteModal'

vi.mock('../../services/plazosEntidad.service', () => ({
  deletePlazoEntidad: vi.fn(),
}))

import { deletePlazoEntidad } from '../../services/plazosEntidad.service'

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

describe('PlazoEntidadDeleteModal', () => {
  beforeEach(() => {
    vi.mocked(deletePlazoEntidad).mockReset()
  })

  it('elimina plazo confirmado', async () => {
    vi.mocked(deletePlazoEntidad).mockResolvedValue(undefined)
    const onSuccess = vi.fn()
    const user = userEvent.setup()

    render(<PlazoEntidadDeleteModal plazo={plazo} onClose={vi.fn()} onSuccess={onSuccess} />)

    expect(screen.getByText(/salud total/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^eliminar$/i }))

    await waitFor(() => expect(deletePlazoEntidad).toHaveBeenCalledWith('p1'))
    expect(onSuccess).toHaveBeenCalled()
  })
})
