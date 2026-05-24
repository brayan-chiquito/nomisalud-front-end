import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@/features/theme/context/ThemeContext'
import { RecepcionPortalShell } from './RecepcionPortalShell'
import { useAuth } from '@/features/auth/context/AuthContext'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const mockUseAuth = vi.mocked(useAuth)

describe('RecepcionPortalShell', () => {
  it('oculta panel RRHH para recepcion pura', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'r1', email: 'recepcion@nomisalud.com', role: 'recepcion' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    render(
      <ThemeProvider>
        <MemoryRouter>
          <RecepcionPortalShell headerTitle="Radicar" userName="Recep" userInitials="RE">
            <p>Contenido</p>
          </RecepcionPortalShell>
        </MemoryRouter>
      </ThemeProvider>,
    )
    expect(screen.getByText('Contenido')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /panel rrhh/i })).not.toBeInTheDocument()
  })

  it('muestra panel RRHH para admin', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'a1', email: 'admin@nomisalud.com', role: 'admin' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/recepcion/radicar']}>
          <RecepcionPortalShell headerTitle="Radicar" userName="Admin" userInitials="AD">
            <p>Contenido</p>
          </RecepcionPortalShell>
        </MemoryRouter>
      </ThemeProvider>,
    )
    expect(screen.getByRole('link', { name: /panel rrhh/i })).toHaveAttribute('href', '/dashboard')
  })
})
