import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FinanzasPageShell } from './FinanzasPageShell'
import { useAuth } from '@/features/auth/context/AuthContext'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/features/contabilidad/components/ContabilidadPortalShell', () => ({
  ContabilidadPortalShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="shell-contabilidad">{children}</div>
  ),
}))

vi.mock('@/features/dashboard/components/RrhhDashboardShell', () => ({
  RrhhDashboardShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="shell-rrhh">{children}</div>
  ),
}))

const mockUseAuth = vi.mocked(useAuth)

describe('FinanzasPageShell', () => {
  it('usa shell de contabilidad para rol contabilidad', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'conta@test.com', role: 'contabilidad' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    render(
      <MemoryRouter>
        <FinanzasPageShell headerTitle="Pagos" userName="C" userInitials="CO">
          <span>Vista</span>
        </FinanzasPageShell>
      </MemoryRouter>,
    )
    expect(screen.getByTestId('shell-contabilidad')).toBeInTheDocument()
    expect(screen.queryByTestId('shell-rrhh')).not.toBeInTheDocument()
  })

  it('usa shell RRHH para admin', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    render(
      <MemoryRouter>
        <FinanzasPageShell headerTitle="Pagos" userName="A" userInitials="AD">
          <span>Vista</span>
        </FinanzasPageShell>
      </MemoryRouter>,
    )
    expect(screen.getByTestId('shell-rrhh')).toBeInTheDocument()
  })
})
