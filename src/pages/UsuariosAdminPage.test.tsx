import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UsuariosAdminPage } from './UsuariosAdminPage'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'a1', email: 'admin@test.com', role: 'admin' } }),
}))

vi.mock('@/features/dashboard/components/RrhhDashboardShell', () => ({
  RrhhDashboardShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/features/admin/components/usuarios/UsuariosAdminPanel', () => ({
  UsuariosAdminPanel: () => <div>Panel usuarios</div>,
}))

describe('UsuariosAdminPage', () => {
  it('renderiza panel de usuarios', () => {
    render(<UsuariosAdminPage />)
    expect(screen.getByText(/panel usuarios/i)).toBeInTheDocument()
  })
})
