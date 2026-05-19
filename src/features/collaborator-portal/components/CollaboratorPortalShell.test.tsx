import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { CollaboratorPortalShell } from './CollaboratorPortalShell'

vi.mock('@/assets/logo.png', () => ({ default: 'logo.png' }))

function makeToken(role: string): string {
  const payload = btoa(JSON.stringify({ user_id: '1', email: 'u@test.com', role }))
  return `h.${payload}.s`
}

describe('CollaboratorPortalShell', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra navegación del portal sin enlace RRHH para colaborador', () => {
    localStorage.setItem('access_token', makeToken('colaborador'))
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/portal/mi-tramite']}>
          <CollaboratorPortalShell headerTitle="Mi trámite" userName="Ana" userInitials="AN">
            <p>Contenido</p>
          </CollaboratorPortalShell>
        </MemoryRouter>
      </AuthProvider>,
    )
    expect(screen.getByRole('link', { name: /mi trámite/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /radicar incapacidad/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /panel rrhh/i })).not.toBeInTheDocument()
    expect(screen.getByText('Contenido')).toBeInTheDocument()
  })

  it('marca activa la ruta de radicar', () => {
    localStorage.setItem('access_token', makeToken('colaborador'))
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/portal/radicar-incapacidad']}>
          <CollaboratorPortalShell headerTitle="Radicar" userName="Ana" userInitials="AN">
            <p>Contenido</p>
          </CollaboratorPortalShell>
        </MemoryRouter>
      </AuthProvider>,
    )
    expect(screen.getByRole('link', { name: /radicar incapacidad/i })).toHaveClass('text-primary')
  })

  it('muestra enlace al panel RRHH para admin', () => {
    localStorage.setItem('access_token', makeToken('admin'))
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/portal/mi-tramite']}>
          <CollaboratorPortalShell headerTitle="Mi trámite" userName="Admin" userInitials="AD">
            <p>Contenido</p>
          </CollaboratorPortalShell>
        </MemoryRouter>
      </AuthProvider>,
    )
    expect(screen.getByRole('link', { name: /panel rrhh/i })).toHaveAttribute('href', '/dashboard')
  })
})
