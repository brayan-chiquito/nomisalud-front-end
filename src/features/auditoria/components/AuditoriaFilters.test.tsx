import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuditoriaFilters } from './AuditoriaFilters'

vi.mock('./AuditoriaUsuarioSearchField', () => ({
  AuditoriaUsuarioSearchField: ({
    value,
    onChange,
    onSelectUsuario,
  }: {
    value: string
    onChange: (v: string) => void
    onSelectUsuario: (o: { id: string; email: string; label: string }) => void
  }) => (
    <input
      aria-label="Filtrar por usuario"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() =>
        onSelectUsuario({
          id: 'u1',
          email: 'a@test.com',
          label: 'Ana · a@test.com',
        })
      }
    />
  ),
}))

describe('AuditoriaFilters', () => {
  it('propaga cambios de filtros', () => {
    const onUsuarioChange = vi.fn()
    const onSelectUsuario = vi.fn()
    const onAccionChange = vi.fn()
    const onFechaDesdeChange = vi.fn()
    const onFechaHastaChange = vi.fn()

    render(
      <AuditoriaFilters
        usuario=""
        accion=""
        fechaDesde=""
        fechaHasta=""
        onUsuarioChange={onUsuarioChange}
        onSelectUsuario={onSelectUsuario}
        onAccionChange={onAccionChange}
        onFechaDesdeChange={onFechaDesdeChange}
        onFechaHastaChange={onFechaHastaChange}
      />,
    )

    fireEvent.change(screen.getByLabelText(/filtrar por usuario/i), {
      target: { value: 'admin@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/acción/i), { target: { value: 'POST' } })
    fireEvent.change(screen.getByLabelText(/desde/i), { target: { value: '2026-05-01' } })
    fireEvent.change(screen.getByLabelText(/hasta/i), { target: { value: '2026-05-31' } })

    expect(onUsuarioChange).toHaveBeenCalledWith('admin@test.com')
    expect(onAccionChange).toHaveBeenCalledWith('POST')
    expect(onFechaDesdeChange).toHaveBeenCalledWith('2026-05-01')
    expect(onFechaHastaChange).toHaveBeenCalledWith('2026-05-31')
  })
})
