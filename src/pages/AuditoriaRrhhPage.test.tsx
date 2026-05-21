import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuditoriaRrhhPage } from './AuditoriaRrhhPage'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: '1', email: 'coord@test.com', role: 'coordinador_rrhh' },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  })),
}))

vi.mock('@/features/auditoria/components/AuditoriaView', () => ({
  AuditoriaView: () => <div data-testid="auditoria-view" />,
}))

vi.mock('@/features/dashboard/components/RrhhDashboardShell', () => ({
  RrhhDashboardShell: ({
    children,
    headerTitle,
  }: {
    children: React.ReactNode
    headerTitle: string
  }) => (
    <div>
      <h1>{headerTitle}</h1>
      {children}
    </div>
  ),
}))

describe('AuditoriaRrhhPage', () => {
  it('renderiza vista de auditoría en shell RRHH', () => {
    render(
      <MemoryRouter>
        <AuditoriaRrhhPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: /auditoría/i })).toBeInTheDocument()
    expect(screen.getByTestId('auditoria-view')).toBeInTheDocument()
  })
})
