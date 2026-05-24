import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'

const mockUseAuth = vi.fn()

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>,
  )
}

describe('NotFoundPage', () => {
  it('muestra el código 404', () => {
    mockUseAuth.mockReturnValue({ user: null, isAuthenticated: false })
    renderPage()
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('muestra el mensaje de página no encontrada', () => {
    mockUseAuth.mockReturnValue({ user: null, isAuthenticated: false })
    renderPage()
    expect(screen.getByText(/página no encontrada/i)).toBeInTheDocument()
  })

  it('muestra enlace al inicio cuando no hay sesión', () => {
    mockUseAuth.mockReturnValue({ user: null, isAuthenticated: false })
    renderPage()
    expect(screen.getByRole('link', { name: /volver al inicio/i })).toHaveAttribute('href', '/')
  })

  it('muestra menú de perfil y enlace al dashboard con sesión activa', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', email: 'ana@nomisalud.com', role: 'admin' },
      isAuthenticated: true,
    })
    renderPage()
    expect(screen.getByRole('button', { name: /menú de perfil/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ir al dashboard/i })).toHaveAttribute(
      'href',
      '/dashboard',
    )
  })
})
