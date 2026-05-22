import type { ReactNode } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { RrhhDashboardShell } from './RrhhDashboardShell'

vi.mock('@/features/auth/context/AuthContext', async () => {
  const actual = await vi.importActual<typeof import('@/features/auth/context/AuthContext')>(
    '@/features/auth/context/AuthContext',
  )
  return { ...actual, useAuth: vi.fn() }
})

const mockUseAuth = vi.mocked(useAuth)

function renderShell(children: ReactNode, role = 'admin') {
  mockUseAuth.mockReturnValue({
    user: { id: 'u1', email: 'ana@nomisalud.com', role },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  })
  return render(
    <MemoryRouter>
      <RrhhDashboardShell headerTitle="Dashboard RRHH" userName="Ana" userInitials="AG">
        {children}
      </RrhhDashboardShell>
    </MemoryRouter>,
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

  it('muestra enlace a plazos por entidad para coordinador', () => {
    renderShell(<div />, 'coordinador_rrhh')
    expect(screen.getByRole('link', { name: /plazos por entidad/i })).toHaveAttribute(
      'href',
      '/admin/plazos-entidad',
    )
  })

  it('oculta plazos por entidad para auxiliar', () => {
    renderShell(<div />, 'auxiliar_rrhh')
    expect(screen.queryByRole('link', { name: /plazos por entidad/i })).not.toBeInTheDocument()
  })

  it('muestra enlace a auditoría para coordinador', () => {
    renderShell(<div />, 'coordinador_rrhh')
    expect(screen.getByRole('link', { name: /^auditoría$/i })).toHaveAttribute(
      'href',
      '/dashboard/auditoria',
    )
  })

  it('no muestra auditoría para auxiliar', () => {
    renderShell(<div />, 'auxiliar_rrhh')
    expect(screen.queryByRole('link', { name: /^auditoría$/i })).not.toBeInTheDocument()
  })

  it('muestra enlace a usuarios solo para admin', () => {
    renderShell(<div />, 'admin')
    expect(screen.getByRole('link', { name: /^usuarios$/i })).toHaveAttribute(
      'href',
      '/admin/usuarios',
    )
  })

  it('usuarios permanece deshabilitado para coordinador', () => {
    renderShell(<div />, 'coordinador_rrhh')
    expect(screen.queryByRole('link', { name: /^usuarios$/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^usuarios$/i })).toBeDisabled()
  })
})
