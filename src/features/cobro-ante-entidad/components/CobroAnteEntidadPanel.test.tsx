import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CobroAnteEntidadPanel } from './CobroAnteEntidadPanel'
import { listIncapacidades } from '@/features/incapacidades/services/listIncapacidades.service'
import { marcarIncapacidadCobrada } from '../services/marcarCobrada.service'

vi.mock('@/features/incapacidades/services/listIncapacidades.service', () => ({
  listIncapacidades: vi.fn(),
}))

vi.mock('../services/marcarCobrada.service', () => ({
  marcarIncapacidadCobrada: vi.fn(),
}))

vi.mock('@/hooks/useEntidadSuggestions', () => ({
  useEntidadSuggestions: () => ({ suggestions: [], loading: false }),
}))

const item = {
  id: 'id-1',
  radicado: 'IN0001',
  estado: 'transcrita',
  colaborador_id: 'c1',
  archivo_tipo: 'pdf',
  fecha_recepcion: '2025-03-01T12:00:00Z',
  colaborador_nombre: 'Ana Gómez',
  entidad_nombre: 'EPS Sura',
  urgencia: 'verde' as const,
}

describe('CobroAnteEntidadPanel', () => {
  beforeEach(() => {
    vi.mocked(listIncapacidades).mockReset()
    vi.mocked(marcarIncapacidadCobrada).mockReset()
    vi.mocked(listIncapacidades).mockResolvedValue({
      items: [item],
      total: 1,
      pages: 1,
    })
  })

  it('lista transcrita y filtra por estado en la petición', async () => {
    render(
      <MemoryRouter>
        <CobroAnteEntidadPanel />
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.getByText('IN0001')).toBeInTheDocument())
    expect(listIncapacidades).toHaveBeenCalledWith(
      expect.objectContaining({ estado: 'transcrita', page: 1 }),
    )
  })

  it('marca cobrada desde el modal', async () => {
    vi.mocked(marcarIncapacidadCobrada).mockResolvedValue({
      id: 'id-1',
      radicado: 'IN0001',
      estado: 'cobrada',
      estado_anterior: 'transcrita',
    })
    render(
      <MemoryRouter>
        <CobroAnteEntidadPanel />
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.getByText('IN0001')).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /marcar cobrada/i }))
    fireEvent.click(screen.getByRole('button', { name: /confirmar cobro/i }))
    await waitFor(() => expect(marcarIncapacidadCobrada).toHaveBeenCalledWith('id-1', undefined))
    expect(screen.getByRole('status')).toHaveTextContent(/cobrada/i)
  })
})
