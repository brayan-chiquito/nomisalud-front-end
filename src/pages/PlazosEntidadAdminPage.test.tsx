import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PlazosEntidadAdminPage } from './PlazosEntidadAdminPage'
import { useAuth } from '@/features/auth/context/AuthContext'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/features/admin/services/plazosEntidad.service', () => ({
  listPlazosEntidad: vi.fn(),
}))

import { listPlazosEntidad } from '@/features/admin/services/plazosEntidad.service'

const mockUseAuth = vi.mocked(useAuth)

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

describe('PlazosEntidadAdminPage', () => {
  beforeEach(() => {
    vi.mocked(listPlazosEntidad).mockReset()
  })

  it('muestra aviso para coordinador sin cargar plazos', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'c1', email: 'coord@nomisalud.com', role: 'coordinador_rrhh' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    render(
      <MemoryRouter>
        <PlazosEntidadAdminPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('status')).toHaveTextContent(/restringida al rol/i)
    expect(listPlazosEntidad).not.toHaveBeenCalled()
  })

  it('lista plazos para admin', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'a1', email: 'admin@nomisalud.com', role: 'admin' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    vi.mocked(listPlazosEntidad).mockResolvedValue({ items: [plazo], total: 1 })
    render(
      <MemoryRouter>
        <PlazosEntidadAdminPage />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByText('Salud Total')).toBeInTheDocument()
    })
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('muestra tabla vacía cuando no hay plazos', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'a1', email: 'admin@nomisalud.com', role: 'admin' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    vi.mocked(listPlazosEntidad).mockResolvedValue({ items: [], total: 0 })
    render(
      <MemoryRouter>
        <PlazosEntidadAdminPage />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByText(/no hay plazos configurados/i)).toBeInTheDocument()
    })
  })

  it('muestra error si falla la carga', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'a1', email: 'admin@nomisalud.com', role: 'admin' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    vi.mocked(listPlazosEntidad).mockRejectedValue(new Error('Sin permisos'))
    render(
      <MemoryRouter>
        <PlazosEntidadAdminPage />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Sin permisos')
    })
  })

  it('muestra guion cuando dias_promedio_pago es null', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'a1', email: 'admin@nomisalud.com', role: 'admin' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    vi.mocked(listPlazosEntidad).mockResolvedValue({
      items: [{ ...plazo, dias_promedio_pago: null }],
      total: 1,
    })
    render(
      <MemoryRouter>
        <PlazosEntidadAdminPage />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByText('—')).toBeInTheDocument()
    })
  })
})
