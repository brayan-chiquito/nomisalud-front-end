import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@/features/theme/context/ThemeContext'
import { PlazosEntidadAdminPage } from './PlazosEntidadAdminPage'
import { useAuth } from '@/features/auth/context/AuthContext'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/features/admin/hooks/usePlazosEntidadList', () => ({
  usePlazosEntidadList: vi.fn(),
}))

import { usePlazosEntidadList } from '@/features/admin/hooks/usePlazosEntidadList'

const mockUseAuth = vi.mocked(useAuth)
const mockUsePlazosEntidadList = vi.mocked(usePlazosEntidadList)

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

function renderPage() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <PlazosEntidadAdminPage />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('PlazosEntidadAdminPage', () => {
  beforeEach(() => {
    mockUsePlazosEntidadList.mockReturnValue({
      items: [],
      loading: false,
      error: null,
      reload: vi.fn(),
    })
  })

  it('muestra aviso para coordinador sin panel CRUD', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'c1', email: 'coord@nomisalud.com', role: 'coordinador_rrhh' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    renderPage()
    expect(screen.getByRole('status')).toHaveTextContent(/restringida al rol/i)
    expect(screen.queryByRole('button', { name: /nuevo plazo/i })).not.toBeInTheDocument()
  })

  it('muestra panel CRUD para admin', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'a1', email: 'admin@nomisalud.com', role: 'admin' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    mockUsePlazosEntidadList.mockReturnValue({
      items: [plazo],
      loading: false,
      error: null,
      reload: vi.fn(),
    })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Salud Total')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: /nuevo plazo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /editar plazo de salud total/i })).toBeInTheDocument()
  })

  it('abre modal de creación', async () => {
    const user = userEvent.setup()
    mockUseAuth.mockReturnValue({
      user: { id: 'a1', email: 'admin@nomisalud.com', role: 'admin' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    renderPage()
    await user.click(screen.getByRole('button', { name: /nuevo plazo/i }))
    expect(screen.getByRole('heading', { name: /nuevo plazo por entidad/i })).toBeInTheDocument()
  })
})
