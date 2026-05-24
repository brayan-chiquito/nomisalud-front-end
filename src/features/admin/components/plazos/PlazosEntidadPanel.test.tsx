import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlazosEntidadPanel } from './PlazosEntidadPanel'

vi.mock('../../hooks/usePlazosEntidadList', () => ({
  usePlazosEntidadList: vi.fn(),
}))

vi.mock('../../services/plazosEntidad.service', () => ({
  createPlazoEntidad: vi.fn(),
  updatePlazoEntidad: vi.fn(),
  deletePlazoEntidad: vi.fn(),
}))

import { usePlazosEntidadList } from '../../hooks/usePlazosEntidadList'
import {
  createPlazoEntidad,
  deletePlazoEntidad,
  updatePlazoEntidad,
} from '../../services/plazosEntidad.service'

const plazo = {
  id: 'p1',
  entidad_nombre: 'Salud Total',
  tipo_incapacidad: 'general',
  valor_limite: 15,
  unidad_limite: 'dias',
  dias_limite: 15,
  dias_alerta: 3,
  dias_promedio_pago: 30,
}

describe('PlazosEntidadPanel', () => {
  const reload = vi.fn()

  beforeEach(() => {
    reload.mockReset()
    vi.mocked(usePlazosEntidadList).mockReturnValue({
      items: [plazo],
      loading: false,
      error: null,
      reload,
    })
    vi.mocked(createPlazoEntidad).mockResolvedValue(plazo)
    vi.mocked(updatePlazoEntidad).mockResolvedValue(plazo)
    vi.mocked(deletePlazoEntidad).mockResolvedValue(undefined)
  })

  it('muestra error de listado', () => {
    vi.mocked(usePlazosEntidadList).mockReturnValue({
      items: [],
      loading: false,
      error: 'Fallo de red',
      reload,
    })
    render(<PlazosEntidadPanel />)
    expect(screen.getByRole('alert')).toHaveTextContent('Fallo de red')
  })

  it('muestra mensaje de éxito tras crear plazo', async () => {
    const user = userEvent.setup()
    render(<PlazosEntidadPanel />)

    await user.click(screen.getByRole('button', { name: /nuevo plazo/i }))
    await user.type(screen.getByLabelText(/^entidad/i), 'Nueva EPS')
    await user.type(screen.getByLabelText(/plazo límite/i), '10')
    await user.type(screen.getByLabelText(/días de alerta/i), '2')
    await user.click(screen.getByRole('button', { name: /crear plazo/i }))

    await waitFor(() => expect(createPlazoEntidad).toHaveBeenCalled())
    expect(screen.getByText(/plazo creado correctamente/i)).toBeInTheDocument()
    expect(reload).toHaveBeenCalled()
  })

  it('muestra mensaje de éxito tras editar plazo', async () => {
    const user = userEvent.setup()
    render(<PlazosEntidadPanel />)

    await user.click(screen.getByRole('button', { name: /editar plazo de salud total/i }))
    await user.clear(screen.getByLabelText(/^entidad/i))
    await user.type(screen.getByLabelText(/^entidad/i), 'EPS Sura')
    await user.click(screen.getByRole('button', { name: /guardar cambios/i }))

    await waitFor(() => expect(updatePlazoEntidad).toHaveBeenCalled())
    expect(screen.getByText(/plazo actualizado/i)).toBeInTheDocument()
  })

  it('muestra mensaje de éxito tras eliminar plazo', async () => {
    const user = userEvent.setup()
    render(<PlazosEntidadPanel />)

    await user.click(screen.getByRole('button', { name: /eliminar plazo de salud total/i }))
    await user.click(screen.getByRole('button', { name: /^eliminar$/i }))

    await waitFor(() => expect(deletePlazoEntidad).toHaveBeenCalledWith('p1'))
    expect(screen.getByText(/plazo eliminado/i)).toBeInTheDocument()
  })
})
