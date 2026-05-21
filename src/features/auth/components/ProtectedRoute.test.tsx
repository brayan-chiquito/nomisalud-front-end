import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { FINANZAS_HOME_PATH } from '../utils/roleAccess'
import { useAuth } from '../context/AuthContext'
import type { AuthContextValue } from '../context/AuthContext'
import type { AuthUser } from '../types'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const mockUseAuth = vi.mocked(useAuth)

const adminUser: AuthUser = { id: '1', email: 'admin@test.com', role: 'admin' }
const colaboradorUser: AuthUser = { id: '2', email: 'colab@test.com', role: 'colaborador' }
const contabilidadUser: AuthUser = {
  id: '3',
  email: 'contabilidad@nomisalud.com',
  role: 'contabilidad',
}

function authValue(overrides: Partial<AuthContextValue>): AuthContextValue {
  return {
    user: null,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  }
}

function renderProtectedRoute(
  children: React.ReactNode,
  options: {
    allowedRoles?: string[]
    forbidRoles?: readonly string[]
    deniedRedirect?: string
    initialPath?: string
  } = {},
) {
  const { allowedRoles, forbidRoles, deniedRedirect, initialPath = '/ruta-protegida' } = options
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>Página de login</div>} />
        <Route path={FINANZAS_HOME_PATH} element={<div>Inicio financiero</div>} />
        <Route
          path="/ruta-protegida"
          element={
            <ProtectedRoute
              allowedRoles={allowedRoles}
              forbidRoles={forbidRoles}
              deniedRedirect={deniedRedirect}
            >
              {children}
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockUseAuth.mockReset()
  })

  describe('usuario no autenticado', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue(authValue({ isAuthenticated: false, user: null }))
    })

    it('redirige a /login cuando no hay sesión', () => {
      renderProtectedRoute(<div>Contenido restringido</div>)
      expect(screen.getByText('Página de login')).toBeInTheDocument()
      expect(screen.queryByText('Contenido restringido')).not.toBeInTheDocument()
    })
  })

  describe('usuario autenticado sin restricción de roles', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue(authValue({ isAuthenticated: true, user: adminUser }))
    })

    it('renderiza los children cuando el usuario está autenticado', () => {
      renderProtectedRoute(<div>Contenido restringido</div>)
      expect(screen.getByText('Contenido restringido')).toBeInTheDocument()
    })

    it('renderiza los children cuando no se especifican allowedRoles', () => {
      renderProtectedRoute(<div>Sin restricción de rol</div>, {})
      expect(screen.getByText('Sin restricción de rol')).toBeInTheDocument()
    })
  })

  describe('restricción por roles', () => {
    it('renderiza los children cuando el rol del usuario está en allowedRoles', () => {
      mockUseAuth.mockReturnValue(authValue({ isAuthenticated: true, user: adminUser }))
      renderProtectedRoute(<div>Solo admin</div>, { allowedRoles: ['admin', 'coordinador_rrhh'] })
      expect(screen.getByText('Solo admin')).toBeInTheDocument()
    })

    it('redirige a /login cuando el rol no está en allowedRoles', () => {
      mockUseAuth.mockReturnValue(authValue({ isAuthenticated: true, user: colaboradorUser }))
      renderProtectedRoute(<div>Solo admin</div>, { allowedRoles: ['admin'] })
      expect(screen.getByText('Página de login')).toBeInTheDocument()
      expect(screen.queryByText('Solo admin')).not.toBeInTheDocument()
    })

    it('redirige contabilidad al inicio financiero si el rol está prohibido', () => {
      mockUseAuth.mockReturnValue(authValue({ isAuthenticated: true, user: contabilidadUser }))
      renderProtectedRoute(<div>Dashboard RRHH</div>, {
        forbidRoles: ['contabilidad'],
        deniedRedirect: FINANZAS_HOME_PATH,
      })
      expect(screen.getByText('Inicio financiero')).toBeInTheDocument()
      expect(screen.queryByText('Dashboard RRHH')).not.toBeInTheDocument()
    })

    it('redirige contabilidad al inicio financiero si no está en allowedRoles', () => {
      mockUseAuth.mockReturnValue(authValue({ isAuthenticated: true, user: contabilidadUser }))
      renderProtectedRoute(<div>Solo cobro</div>, { allowedRoles: ['admin', 'auxiliar_rrhh'] })
      expect(screen.getByText('Inicio financiero')).toBeInTheDocument()
    })

    it('renderiza children cuando allowedRoles tiene varios roles y el usuario tiene uno de ellos', () => {
      mockUseAuth.mockReturnValue(authValue({ isAuthenticated: true, user: colaboradorUser }))
      renderProtectedRoute(<div>Acceso múltiple</div>, {
        allowedRoles: ['colaborador', 'auxiliar_rrhh', 'coordinador_rrhh', 'admin'],
      })
      expect(screen.getByText('Acceso múltiple')).toBeInTheDocument()
    })
  })

  describe('modo Outlet (sin children)', () => {
    it('renderiza el Outlet cuando no se pasan children', () => {
      mockUseAuth.mockReturnValue(authValue({ isAuthenticated: true, user: adminUser }))
      render(
        <MemoryRouter initialEntries={['/ruta-protegida']}>
          <Routes>
            <Route path="/login" element={<div>Login</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/ruta-protegida" element={<div>Contenido del Outlet</div>} />
            </Route>
          </Routes>
        </MemoryRouter>,
      )
      expect(screen.getByText('Contenido del Outlet')).toBeInTheDocument()
    })
  })
})
