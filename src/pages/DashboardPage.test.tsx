import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DashboardPage } from './DashboardPage'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'u1', email: 'ana.garcia@nomisalud.com', role: 'admin' },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  })),
}))

vi.mock('@/features/incapacidades/services/listIncapacidades.service', () => ({
  listIncapacidades: vi.fn(),
}))

vi.mock('@/features/incapacidades/services/incapacidadKpis.service', () => ({
  fetchIncapacidadKpis: vi.fn(),
}))

import { fetchIncapacidadKpis } from '@/features/incapacidades/services/incapacidadKpis.service'
import { listIncapacidades } from '@/features/incapacidades/services/listIncapacidades.service'

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.mocked(listIncapacidades).mockResolvedValue({ items: [], total: 0, pages: 0 })
    vi.mocked(fetchIncapacidadKpis).mockResolvedValue({
      totalRecibidas: 0,
      enVerificacion: 0,
      transcribiendo: 0,
      pagadas: 0,
    })
  })

  it('muestra el layout RRHH y el título del dashboard', async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: /dashboard rrhh/i })).toBeInTheDocument()
    expect(screen.getByText('Nomisalud')).toBeInTheDocument()
    await waitFor(() => expect(fetchIncapacidadKpis).toHaveBeenCalled())
  })

  it('muestra nombre derivado del correo en la cabecera', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )
    expect(screen.getByText(/ana garcia/i)).toBeInTheDocument()
  })
})
