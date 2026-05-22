import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UsuariosAdminPanel } from './UsuariosAdminPanel'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'admin-1', email: 'admin@test.com', role: 'admin' } }),
}))

const mockHook = vi.fn()

vi.mock('../../hooks/useUsuariosAdminList', () => ({
  useUsuariosAdminList: () => mockHook(),
}))

describe('UsuariosAdminPanel', () => {
  beforeEach(() => {
    mockHook.mockReturnValue({
      data: {
        items: [
          {
            id: 'u2',
            email: 'col@test.com',
            role: 'colaborador',
            nombre_completo: 'Col Test',
            tipo_documento: null,
            numero_documento: null,
            area: null,
            cargo: null,
            eps_afiliacion: null,
            arl_afiliacion: null,
            activo: true,
            created_at: '2026-01-01T00:00:00Z',
          },
        ],
        total: 1,
        page: 1,
        page_size: 20,
        pages: 1,
      },
      loading: false,
      error: null,
      page: 1,
      setPage: vi.fn(),
      roleFilter: '',
      setRoleFilter: vi.fn(),
      activoFilter: '',
      setActivoFilter: vi.fn(),
      search: '',
      setSearch: vi.fn(),
      pageSize: 20,
      reload: vi.fn(),
    })
  })

  it('renderiza tabla y botón nuevo usuario', () => {
    render(<UsuariosAdminPanel />)
    expect(screen.getByRole('heading', { name: /gestión de usuarios/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nuevo usuario/i })).toBeInTheDocument()
    expect(screen.getByText('col@test.com')).toBeInTheDocument()
  })
})
