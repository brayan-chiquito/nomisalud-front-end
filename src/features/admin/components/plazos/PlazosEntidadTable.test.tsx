import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { PlazoEntidadItem } from '../../types/plazoEntidad'
import { PlazosEntidadTable } from './PlazosEntidadTable'

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

describe('PlazosEntidadTable', () => {
  it('muestra estado de carga inicial', () => {
    render(<PlazosEntidadTable items={[]} loading onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/cargando plazos/i)).toBeInTheDocument()
  })

  it('muestra vacío cuando no hay ítems', () => {
    render(<PlazosEntidadTable items={[]} loading={false} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/no hay plazos configurados/i)).toBeInTheDocument()
  })

  it('renderiza filas y dispara acciones', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(
      <PlazosEntidadTable items={[plazo]} loading={false} onEdit={onEdit} onDelete={onDelete} />,
    )

    expect(screen.getByText('Salud Total')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /editar plazo de salud total/i }))
    await user.click(screen.getByRole('button', { name: /eliminar plazo de salud total/i }))
    expect(onEdit).toHaveBeenCalledWith(plazo)
    expect(onDelete).toHaveBeenCalledWith(plazo)
  })
})
