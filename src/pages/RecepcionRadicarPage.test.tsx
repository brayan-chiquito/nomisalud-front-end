import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RecepcionRadicarPage } from './RecepcionRadicarPage'
import { useAuth } from '@/features/auth/context/AuthContext'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/features/recepcion/components/RecepcionRadicarView', () => ({
  RecepcionRadicarView: () => <div data-testid="recepcion-view">Vista recepción</div>,
}))

const mockUseAuth = vi.mocked(useAuth)

describe('RecepcionRadicarPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renderiza la vista para rol recepcion', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'r1', email: 'recepcion@nomisalud.com', role: 'recepcion' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    render(
      <MemoryRouter>
        <RecepcionRadicarPage />
      </MemoryRouter>,
    )
    expect(screen.getByTestId('recepcion-view')).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('redirige colaborador al portal', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'c1', email: 'col@nomisalud.com', role: 'colaborador' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    render(
      <MemoryRouter>
        <RecepcionRadicarPage />
      </MemoryRouter>,
    )
    expect(mockNavigate).toHaveBeenCalledWith('/portal/mi-tramite', { replace: true })
  })

  it('no redirige si aún no hay rol de usuario', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    })
    render(
      <MemoryRouter>
        <RecepcionRadicarPage />
      </MemoryRouter>,
    )
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
