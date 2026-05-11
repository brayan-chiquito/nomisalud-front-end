import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RrhhDashboardShell } from './RrhhDashboardShell'

describe('RrhhDashboardShell', () => {
  it('renderiza cabecera, sidebar y contenido', () => {
    render(
      <MemoryRouter>
        <RrhhDashboardShell headerTitle="Dashboard RRHH" userName="Ana" userInitials="AG">
          <div>Contenido</div>
        </RrhhDashboardShell>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: /dashboard rrhh/i })).toBeInTheDocument()
    expect(screen.getByText('Nomisalud')).toBeInTheDocument()
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('AG')).toBeInTheDocument()
    expect(screen.getByText('Contenido')).toBeInTheDocument()
  })

  it('al pulsar Incapacidades intenta hacer scroll al panel', () => {
    const el = { scrollIntoView: vi.fn() }
    const spy = vi
      .spyOn(document, 'getElementById')
      .mockImplementation((id: string) =>
        id === 'panel-incapacidades' ? (el as unknown as HTMLElement) : null,
      )
    render(
      <MemoryRouter>
        <RrhhDashboardShell headerTitle="T" userName="U" userInitials="U">
          <div />
        </RrhhDashboardShell>
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: /^incapacidades$/i }))
    expect(el.scrollIntoView).toHaveBeenCalled()
    spy.mockRestore()
  })
})
