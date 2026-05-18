import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CollaboratorHeader } from './CollaboratorHeader'

vi.mock('@/assets/logo.png', () => ({ default: 'logo.png' }))

describe('CollaboratorHeader', () => {
  it('muestra enlace al dashboard por defecto', () => {
    render(
      <MemoryRouter>
        <CollaboratorHeader userName="Ana" companyName="Portal" avatarInitials="AN" />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard')
  })

  it('oculta el enlace al dashboard cuando showDashboardLink es false', () => {
    render(
      <MemoryRouter>
        <CollaboratorHeader
          userName="Ana"
          companyName="Portal"
          avatarInitials="AN"
          showDashboardLink={false}
        />
      </MemoryRouter>,
    )
    expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument()
  })
})
