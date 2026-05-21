import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuditoriaView } from './AuditoriaView'
import { useAuditoriaAccesos } from '../hooks/useAuditoriaAccesos'

vi.mock('../hooks/useAuditoriaAccesos', () => ({
  useAuditoriaAccesos: vi.fn(),
}))

const mockHook = {
  data: null as ReturnType<typeof useAuditoriaAccesos>['data'],
  loading: false,
  error: null as string | null,
  page: 1,
  setPage: vi.fn(),
  userId: '',
  setUserId: vi.fn(),
  accion: '',
  setAccion: vi.fn(),
  fechaDesde: '',
  setFechaDesde: vi.fn(),
  fechaHasta: '',
  setFechaHasta: vi.fn(),
  pageSize: 50,
}

describe('AuditoriaView', () => {
  beforeEach(() => {
    vi.mocked(useAuditoriaAccesos).mockReturnValue({ ...mockHook })
  })

  it('muestra título y filtros', () => {
    render(<AuditoriaView />)
    expect(screen.getByRole('heading', { name: /auditoría de accesos/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/acción/i)).toBeInTheDocument()
    expect(screen.getByText(/50 registros por página/i)).toBeInTheDocument()
  })

  it('muestra filas de la tabla', () => {
    vi.mocked(useAuditoriaAccesos).mockReturnValue({
      ...mockHook,
      data: {
        items: [
          {
            id: '1',
            user_id: 'u1',
            usuario_nombre: 'Coordinador',
            usuario_email: 'c@test.com',
            accion: 'GET /api',
            recurso_id: 'res-1',
            ip: '10.0.0.1',
            timestamp: '2026-05-21T14:30:00Z',
          },
        ],
        total: 1,
        pages: 1,
        page: 1,
        page_size: 50,
      },
    })
    render(<AuditoriaView />)
    expect(screen.getByText('Coordinador')).toBeInTheDocument()
    expect(screen.getByText('GET /api')).toBeInTheDocument()
    expect(screen.getByText(/mostrando 1 - 1 de 1/i)).toBeInTheDocument()
  })
})
