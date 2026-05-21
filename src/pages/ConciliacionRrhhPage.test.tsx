import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ConciliacionRrhhPage } from './ConciliacionRrhhPage'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useConciliacion } from '@/features/conciliacion/hooks/useConciliacion'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/features/conciliacion/hooks/useConciliacion', () => ({
  useConciliacion: vi.fn(),
}))

vi.mock('@/hooks/useEntidadSuggestions', () => ({
  useEntidadSuggestions: () => ({ suggestions: [], loading: false }),
}))

describe('ConciliacionRrhhPage', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'u1', email: 'ana@nomisalud.com', role: 'admin' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })
    vi.mocked(useConciliacion).mockReturnValue({
      mes: 5,
      setMes: vi.fn(),
      anio: 2026,
      setAnio: vi.fn(),
      entidadInput: '',
      setEntidadInput: vi.fn(),
      data: null,
      loading: false,
      error: null,
      canQuery: false,
      exporting: false,
      exportError: null,
      exportar: vi.fn(),
    })
  })

  it('renderiza shell RRHH y vista de conciliación', () => {
    render(
      <MemoryRouter>
        <ConciliacionRrhhPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 2, name: /conciliación/i })).toBeInTheDocument()
    expect(screen.getByText('Nomisalud')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /conciliación/i })).toHaveAttribute(
      'href',
      '/dashboard/conciliacion',
    )
  })
})
