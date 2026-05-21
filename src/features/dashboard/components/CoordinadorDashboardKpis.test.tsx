import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CoordinadorDashboardKpis } from './CoordinadorDashboardKpis'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/features/dashboard/services/coordinatorKpis.service', () => ({
  fetchCoordinatorKpis: vi.fn(),
}))

import { useAuth } from '@/features/auth/context/AuthContext'
import { fetchCoordinatorKpis } from '@/features/dashboard/services/coordinatorKpis.service'

describe('CoordinadorDashboardKpis', () => {
  beforeEach(() => {
    vi.mocked(fetchCoordinatorKpis).mockReset()
    vi.mocked(fetchCoordinatorKpis).mockResolvedValue({
      precisionExtraccionPct: 95,
      tasaClasificacionPct: 88,
      pendientesVerificacion: 4,
      inconsistenciasIa: 1,
      pagosRetrasados: 2,
    })
  })

  it('muestra enlace de plazos para admin', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true,
    } as ReturnType<typeof useAuth>)

    render(
      <MemoryRouter>
        <CoordinadorDashboardKpis />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /configuración de plazos/i })).toHaveAttribute(
        'href',
        '/admin/plazos-entidad',
      )
    })
    expect(screen.getByText('95%')).toBeInTheDocument()
  })

  it('no muestra enlace activo de plazos para coordinador', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', email: 'coord@test.com', role: 'coordinador_rrhh' },
      isAuthenticated: true,
    } as ReturnType<typeof useAuth>)

    render(
      <MemoryRouter>
        <CoordinadorDashboardKpis />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument()
    })
    expect(screen.queryByRole('link', { name: /configuración de plazos/i })).not.toBeInTheDocument()
  })
})
