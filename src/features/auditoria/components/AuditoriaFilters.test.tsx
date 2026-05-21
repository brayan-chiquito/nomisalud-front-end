import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuditoriaFilters } from './AuditoriaFilters'

describe('AuditoriaFilters', () => {
  it('propaga cambios de filtros', () => {
    const onUserIdChange = vi.fn()
    const onAccionChange = vi.fn()
    const onFechaDesdeChange = vi.fn()
    const onFechaHastaChange = vi.fn()

    render(
      <AuditoriaFilters
        userId=""
        accion=""
        fechaDesde=""
        fechaHasta=""
        loading={false}
        onUserIdChange={onUserIdChange}
        onAccionChange={onAccionChange}
        onFechaDesdeChange={onFechaDesdeChange}
        onFechaHastaChange={onFechaHastaChange}
      />,
    )

    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'uuid-1' } })
    fireEvent.change(screen.getByLabelText(/acción/i), { target: { value: 'POST' } })
    fireEvent.change(screen.getByLabelText(/desde/i), { target: { value: '2026-05-01' } })
    fireEvent.change(screen.getByLabelText(/hasta/i), { target: { value: '2026-05-31' } })

    expect(onUserIdChange).toHaveBeenCalledWith('uuid-1')
    expect(onAccionChange).toHaveBeenCalledWith('POST')
    expect(onFechaDesdeChange).toHaveBeenCalledWith('2026-05-01')
    expect(onFechaHastaChange).toHaveBeenCalledWith('2026-05-31')
  })
})
