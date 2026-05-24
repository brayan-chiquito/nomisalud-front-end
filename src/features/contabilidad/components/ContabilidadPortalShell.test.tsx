import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@/features/theme/context/ThemeContext'
import { ContabilidadPortalShell } from './ContabilidadPortalShell'

vi.mock('@/components/UserProfileMenu', () => ({
  UserProfileMenu: () => <div data-testid="user-menu" />,
}))

describe('ContabilidadPortalShell', () => {
  it('muestra solo pagos y conciliación en el menú', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <ContabilidadPortalShell headerTitle="Conciliación" userName="Conta" userInitials="CO">
            <p>Contenido</p>
          </ContabilidadPortalShell>
        </MemoryRouter>
      </ThemeProvider>,
    )
    expect(screen.getByRole('link', { name: /conciliación/i })).toHaveAttribute(
      'href',
      '/dashboard/conciliacion',
    )
    expect(screen.getByRole('link', { name: /^pagos$/i })).toHaveAttribute(
      'href',
      '/dashboard/pagos',
    )
    expect(screen.queryByRole('link', { name: /incapacidades/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /portal colaborador/i })).not.toBeInTheDocument()
    expect(screen.getByText('Módulo financiero')).toBeInTheDocument()
  })
})
