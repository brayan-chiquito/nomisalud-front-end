import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MiCuentaShell } from './MiCuentaShell'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/features/contabilidad/components/ContabilidadPortalShell', () => ({
  ContabilidadPortalShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="conta">{children}</div>
  ),
}))

vi.mock('@/features/collaborator-portal/components/CollaboratorPortalShell', () => ({
  CollaboratorPortalShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="colab">{children}</div>
  ),
}))

vi.mock('@/features/recepcion/components/RecepcionPortalShell', () => ({
  RecepcionPortalShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="recep">{children}</div>
  ),
}))

vi.mock('@/features/dashboard/components/RrhhDashboardShell', () => ({
  RrhhDashboardShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="rrhh">{children}</div>
  ),
}))

import { useAuth } from '@/features/auth/context/AuthContext'

describe('MiCuentaShell', () => {
  it('usa shell de contabilidad', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', email: 'c@test.com', role: 'contabilidad' },
    } as ReturnType<typeof useAuth>)
    render(<MiCuentaShell>Contenido</MiCuentaShell>)
    expect(screen.getByTestId('conta')).toHaveTextContent('Contenido')
  })

  it('usa shell RRHH para admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', email: 'a@test.com', role: 'admin' },
    } as ReturnType<typeof useAuth>)
    render(<MiCuentaShell>Contenido</MiCuentaShell>)
    expect(screen.getByTestId('rrhh')).toBeInTheDocument()
  })

  it('usa shell de colaborador', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', email: 'col@test.com', role: 'colaborador' },
    } as ReturnType<typeof useAuth>)
    render(<MiCuentaShell>Contenido</MiCuentaShell>)
    expect(screen.getByTestId('colab')).toBeInTheDocument()
  })

  it('usa shell de recepción', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', email: 'rec@test.com', role: 'recepcion' },
    } as ReturnType<typeof useAuth>)
    render(<MiCuentaShell>Contenido</MiCuentaShell>)
    expect(screen.getByTestId('recep')).toBeInTheDocument()
  })
})
