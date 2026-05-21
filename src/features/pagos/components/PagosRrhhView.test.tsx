import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PagosRrhhView } from './PagosRrhhView'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('./RegistrarPagoForm', () => ({
  RegistrarPagoForm: () => <div data-testid="registrar-pago" />,
}))

vi.mock('./PagosListPanel', () => ({
  PagosListPanel: () => <div data-testid="historial-pagos" />,
}))

import { useAuth } from '@/features/auth/context/AuthContext'

describe('PagosRrhhView', () => {
  it('oculta enlace a cobro ante entidad para contabilidad', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', email: 'conta@test.com', role: 'contabilidad' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    render(
      <MemoryRouter>
        <PagosRrhhView />
      </MemoryRouter>,
    )
    expect(screen.queryByRole('link', { name: /cobro ante entidad/i })).not.toBeInTheDocument()
    expect(screen.getByText(/el cobro ante la eps/i)).toBeInTheDocument()
  })

  it('muestra enlace a cobro ante entidad para admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    render(
      <MemoryRouter>
        <PagosRrhhView />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /cobro ante entidad/i })).toBeInTheDocument()
  })
})
