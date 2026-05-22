import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsuariosAdminPanel } from './UsuariosAdminPanel'
import type { UsuarioAdmin } from '../../types/usuarioAdmin'

vi.mock('../../services/usuariosAdmin.service', () => ({
  createUsuarioAdmin: vi.fn(),
  updateUsuarioAdmin: vi.fn(),
  deactivateUsuarioAdmin: vi.fn(),
  resetUsuarioAdminPassword: vi.fn(),
}))

import {
  createUsuarioAdmin,
  updateUsuarioAdmin,
  deactivateUsuarioAdmin,
  resetUsuarioAdminPassword,
} from '../../services/usuariosAdmin.service'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'admin-1', email: 'admin@test.com', role: 'admin' } }),
}))

const mockHook = vi.fn()

vi.mock('../../hooks/useUsuariosAdminList', () => ({
  useUsuariosAdminList: () => mockHook(),
}))

const usuarioRow: UsuarioAdmin = {
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
}

const defaultHook = () => ({
  data: {
    items: [usuarioRow],
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

describe('UsuariosAdminPanel', () => {
  beforeEach(() => {
    mockHook.mockReturnValue(defaultHook())
    vi.mocked(createUsuarioAdmin).mockReset()
    vi.mocked(updateUsuarioAdmin).mockReset()
    vi.mocked(deactivateUsuarioAdmin).mockReset()
    vi.mocked(resetUsuarioAdminPassword).mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renderiza tabla y botón nuevo usuario', () => {
    render(<UsuariosAdminPanel />)
    expect(screen.getByRole('heading', { name: /gestión de usuarios/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nuevo usuario/i })).toBeInTheDocument()
    expect(screen.getByText('col@test.com')).toBeInTheDocument()
  })

  it('muestra error de carga del listado', () => {
    mockHook.mockReturnValue({
      ...defaultHook(),
      data: null,
      error: 'Sin permiso',
      loading: false,
    })
    render(<UsuariosAdminPanel />)
    expect(screen.getByRole('alert')).toHaveTextContent('Sin permiso')
  })

  it('abre modal de creación', async () => {
    const user = userEvent.setup()
    render(<UsuariosAdminPanel />)
    await user.click(screen.getByRole('button', { name: /nuevo usuario/i }))
    expect(screen.getByRole('heading', { name: /nuevo usuario/i })).toBeInTheDocument()
  })

  it('abre modales de editar, desactivar y restablecer contraseña', async () => {
    const user = userEvent.setup()
    render(<UsuariosAdminPanel />)

    await user.click(screen.getByRole('button', { name: /editar col@test.com/i }))
    expect(screen.getByRole('heading', { name: /editar usuario/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /cerrar/i }))
    await user.click(
      screen.getByRole('button', { name: /restablecer contraseña de col@test.com/i }),
    )
    expect(screen.getByRole('heading', { name: /restablecer contraseña/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /cerrar/i }))
    await user.click(screen.getByRole('button', { name: /desactivar col@test.com/i }))
    expect(screen.getByRole('heading', { name: /desactivar usuario/i })).toBeInTheDocument()
  })

  it('muestra mensaje de éxito y recarga tras crear usuario', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const reload = vi.fn()
    mockHook.mockReturnValue({ ...defaultHook(), reload })
    vi.mocked(createUsuarioAdmin).mockResolvedValue({
      ...usuarioRow,
      email: 'nuevo@test.com',
    })

    const user = userEvent.setup()
    render(<UsuariosAdminPanel />)

    await user.click(screen.getByRole('button', { name: /nuevo usuario/i }))
    await user.type(screen.getByLabelText(/correo electrónico/i), 'nuevo@test.com')
    await user.type(screen.getByLabelText(/^contraseña$/i), 'password123')
    await user.click(screen.getByRole('button', { name: /crear usuario/i }))

    await waitFor(() => {
      expect(screen.getByText(/usuario creado correctamente/i)).toBeInTheDocument()
    })
    expect(reload).toHaveBeenCalled()
    expect(createUsuarioAdmin).toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000)
    })
    await waitFor(() => {
      expect(screen.queryByText(/usuario creado correctamente/i)).not.toBeInTheDocument()
    })
  })

  it('muestra éxito tras actualizar usuario', async () => {
    const reload = vi.fn()
    mockHook.mockReturnValue({ ...defaultHook(), reload })
    vi.mocked(updateUsuarioAdmin).mockResolvedValue(usuarioRow)

    const user = userEvent.setup()
    render(<UsuariosAdminPanel />)

    await user.click(screen.getByRole('button', { name: /editar col@test.com/i }))
    await user.click(screen.getByRole('button', { name: /guardar cambios/i }))

    await waitFor(() => {
      expect(screen.getByText(/usuario actualizado/i)).toBeInTheDocument()
    })
    expect(reload).toHaveBeenCalled()
  })
})
