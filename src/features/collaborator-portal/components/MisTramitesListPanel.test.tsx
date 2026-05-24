import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MisTramitesListPanel } from './MisTramitesListPanel'

const baseProps = {
  items: [] as const,
  loading: false,
  error: null as string | null,
  page: 1,
  pages: 1,
  onPageChange: vi.fn(),
}

describe('MisTramitesListPanel', () => {
  it('renderiza radicado, estado y fecha de cada trámite', () => {
    render(
      <MemoryRouter>
        <MisTramitesListPanel
          items={[
            {
              id: 'uuid-1',
              radicado: 'IN-TEST-001',
              estado: 'en_verificacion',
              updated_at: '2025-06-02T14:00:00.000Z',
            },
          ]}
          loading={false}
          error={null}
          page={1}
          pages={1}
          onPageChange={() => undefined}
        />
      </MemoryRouter>,
    )
    expect(screen.getByText('IN-TEST-001')).toBeInTheDocument()
    expect(screen.getByText(/en verificación/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /IN-TEST-001/i })).toHaveAttribute(
      'href',
      '/portal/mi-tramite/uuid-1',
    )
  })

  it('muestra estado de carga', () => {
    render(
      <MemoryRouter>
        <MisTramitesListPanel {...baseProps} loading />
      </MemoryRouter>,
    )
    expect(screen.getByText(/cargando trámites/i)).toBeInTheDocument()
  })

  it('muestra error de la API', () => {
    render(
      <MemoryRouter>
        <MisTramitesListPanel {...baseProps} error="Falló el listado" />
      </MemoryRouter>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Falló el listado')
  })

  it('muestra mensaje cuando no hay trámites', () => {
    render(
      <MemoryRouter>
        <MisTramitesListPanel {...baseProps} />
      </MemoryRouter>,
    )
    expect(screen.getByText(/aún no tienes trámites/i)).toBeInTheDocument()
  })

  it('paginación llama onPageChange', () => {
    const onPageChange = vi.fn()
    render(
      <MemoryRouter>
        <MisTramitesListPanel
          {...baseProps}
          pages={3}
          onPageChange={onPageChange}
          items={[
            {
              id: '1',
              radicado: 'IN-1',
              estado: 'recibida',
              updated_at: '2025-06-01T10:00:00.000Z',
            },
          ]}
        />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
