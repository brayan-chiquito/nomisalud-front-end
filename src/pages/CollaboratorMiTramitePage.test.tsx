import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { CollaboratorMiTramitePage } from './CollaboratorMiTramitePage'

vi.mock('@/assets/logo.png', () => ({ default: 'logo.png' }))

const mockUseMisIncapacidades = vi.fn()
const mockUseMiTramiteDetalle = vi.fn()

vi.mock('@/features/collaborator-portal/hooks/useMisIncapacidades', () => ({
  useMisIncapacidades: (enabled: boolean) => mockUseMisIncapacidades(enabled),
}))

vi.mock('@/features/collaborator-portal/hooks/useMiTramiteDetalle', () => ({
  useMiTramiteDetalle: (id: string | undefined) => mockUseMiTramiteDetalle(id),
}))

describe('CollaboratorMiTramitePage', () => {
  beforeEach(() => {
    mockUseMisIncapacidades.mockReset()
    mockUseMiTramiteDetalle.mockReset()
    mockUseMisIncapacidades.mockReturnValue({
      data: { items: [], total: 0, pages: 1 },
      loading: false,
      error: null,
      page: 1,
      setPage: vi.fn(),
      reload: vi.fn(),
    })
    mockUseMiTramiteDetalle.mockReturnValue({
      detail: null,
      loading: false,
      error: null,
    })
  })

  it('renderiza la vista de mis trámites', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <CollaboratorMiTramitePage />
        </MemoryRouter>
      </AuthProvider>,
    )
    expect(screen.getByRole('heading', { name: /mis trámites/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard')
  })
})
