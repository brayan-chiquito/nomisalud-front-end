import type { ComponentProps } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { CollaboratorHeader } from './CollaboratorHeader'

vi.mock('@/assets/logo.png', () => ({ default: 'logo.png' }))

function renderHeader(props: ComponentProps<typeof CollaboratorHeader>) {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <CollaboratorHeader {...props} />
      </MemoryRouter>
    </AuthProvider>,
  )
}

describe('CollaboratorHeader', () => {
  it('muestra enlace al dashboard por defecto', () => {
    renderHeader({ userName: 'Ana', companyName: 'Portal', avatarInitials: 'AN' })
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard')
  })

  it('oculta el enlace al dashboard cuando showDashboardLink es false', () => {
    renderHeader({
      userName: 'Ana',
      companyName: 'Portal',
      avatarInitials: 'AN',
      showDashboardLink: false,
    })
    expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument()
  })

  it('muestra menú de perfil con opción de cerrar sesión', () => {
    renderHeader({ userName: 'Ana', companyName: 'Portal', avatarInitials: 'AN' })
    expect(screen.getByRole('button', { name: /menú de perfil de ana/i })).toBeInTheDocument()
  })
})
