import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MarcarCobradaDetalleAction } from './MarcarCobradaDetalleAction'
import { marcarIncapacidadCobrada } from '../services/marcarCobrada.service'

vi.mock('../services/marcarCobrada.service', () => ({
  marcarIncapacidadCobrada: vi.fn(),
}))

describe('MarcarCobradaDetalleAction', () => {
  beforeEach(() => {
    vi.mocked(marcarIncapacidadCobrada).mockReset()
    vi.mocked(marcarIncapacidadCobrada).mockResolvedValue({
      id: 'u1',
      radicado: 'IN01',
      estado: 'cobrada',
      estado_anterior: 'transcrita',
    })
  })

  it('abre modal y confirma cobrada', async () => {
    const onEstado = vi.fn()
    render(
      <MemoryRouter>
        <MarcarCobradaDetalleAction
          incapacidadId="u1"
          radicado="IN01"
          onEstadoActualizado={onEstado}
        />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: /marcar como cobrada/i }))
    fireEvent.click(screen.getByRole('button', { name: /confirmar cobro/i }))
    await waitFor(() => expect(marcarIncapacidadCobrada).toHaveBeenCalledWith('u1', undefined))
    expect(onEstado).toHaveBeenCalledWith('cobrada')
  })
})
