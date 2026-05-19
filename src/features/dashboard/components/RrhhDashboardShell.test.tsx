import type { ReactNode } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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

  it('al pulsar Inicio marca la sección activa', () => {
    renderShell(<div />)
    fireEvent.click(screen.getByRole('link', { name: /^inicio$/i }))
    expect(screen.getByRole('link', { name: /^inicio$/i })).toHaveClass('text-primary')
  })

  it('al pulsar Incapacidades intenta hacer scroll al panel', () => {
    const el = { scrollIntoView: vi.fn() }
    const spy = vi
      .spyOn(document, 'getElementById')
      .mockImplementation((id: string) =>
        id === 'panel-incapacidades' ? (el as unknown as HTMLElement) : null,
      )
    renderShell(<div />)
    fireEvent.click(screen.getByRole('button', { name: /^incapacidades$/i }))
    expect(el.scrollIntoView).toHaveBeenCalled()
    spy.mockRestore()
  })
})
