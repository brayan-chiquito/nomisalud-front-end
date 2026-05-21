import type { ReactNode } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { RrhhDashboardShell } from './RrhhDashboardShell'

function renderShell(children: ReactNode) {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <RrhhDashboardShell headerTitle="Dashboard RRHH" userName="Ana" userInitials="AG">
          {children}
        </RrhhDashboardShell>
      </MemoryRouter>
    </AuthProvider>,
  )
}

describe('RrhhDashboardShell', () => {
  it('renderiza cabecera, sidebar y contenido', () => {
    renderShell(<div>Contenido</div>)
    expect(screen.getByRole('heading', { name: /dashboard rrhh/i })).toBeInTheDocument()
    expect(screen.getByText('Nomisalud')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /menú de perfil de ana/i })).toHaveTextContent('AG')
    expect(screen.getByText('Recursos Humanos')).toBeInTheDocument()
    expect(screen.getByText('Contenido')).toBeInTheDocument()
  })

  it('muestra enlace al portal colaborador', () => {
    renderShell(<div />)
    expect(screen.getByRole('link', { name: /portal colaborador/i })).toHaveAttribute(
      'href',
      '/portal/mi-tramite',
    )
  })

  it('muestra enlace al módulo de cobro ante entidad', () => {
    renderShell(<div />)
    expect(screen.getByRole('link', { name: /cobro ante entidad/i })).toHaveAttribute(
      'href',
      '/dashboard/cobro-ante-entidad',
    )
  })

  it('muestra enlace al módulo de pagos', () => {
    renderShell(<div />)
    expect(screen.getByRole('link', { name: /^pagos$/i })).toHaveAttribute(
      'href',
      '/dashboard/pagos',
    )
  })

  it('muestra enlace a conciliación', () => {
    renderShell(<div />)
    expect(screen.getByRole('link', { name: /conciliación/i })).toHaveAttribute(
      'href',
      '/dashboard/conciliacion',
    )
  })

  it('enlace Incapacidades apunta al listado en el dashboard', () => {
    renderShell(<div />)
    expect(screen.getByRole('link', { name: /^incapacidades$/i })).toHaveAttribute(
      'href',
      '/dashboard#panel-incapacidades',
    )
  })
})
