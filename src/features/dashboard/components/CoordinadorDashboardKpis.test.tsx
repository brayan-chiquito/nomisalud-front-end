import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CoordinadorDashboardKpis } from './CoordinadorDashboardKpis'

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/features/reportes/hooks/useReportesKpis', () => ({
  useReportesKpis: vi.fn(),
}))

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chart-mock">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Cell: () => null,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
}))

import { useAuth } from '@/features/auth/context/AuthContext'
import { useReportesKpis } from '@/features/reportes/hooks/useReportesKpis'

const sampleData = {
  por_estado: [{ estado: 'transcrita', total: 12 }],
  por_urgencia: [{ urgencia: 'rojo', total: 3 }],
  precision_ocr_promedio: 0.82,
  tasa_clasificacion_ia_correcta: 0.71,
  total_incapacidades: 45,
  generado_en: '2025-06-01T15:30:00Z',
}

describe('CoordinadorDashboardKpis', () => {
  beforeEach(() => {
    vi.mocked(useReportesKpis).mockReturnValue({
      data: sampleData,
      loading: false,
      error: null,
      reload: vi.fn(),
    })
  })

  it('muestra enlace de plazos para admin', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true,
    } as ReturnType<typeof useAuth>)

    render(
      <MemoryRouter>
        <CoordinadorDashboardKpis />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /configuración de plazos/i })).toHaveAttribute(
      'href',
      '/admin/plazos-entidad',
    )
    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getByText('82.0%')).toBeInTheDocument()
    expect(screen.getByText(/distribución por estado/i)).toBeInTheDocument()
  })

  it('no muestra enlace activo de plazos para coordinador', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', email: 'coord@test.com', role: 'coordinador_rrhh' },
      isAuthenticated: true,
    } as ReturnType<typeof useAuth>)

    render(
      <MemoryRouter>
        <CoordinadorDashboardKpis />
      </MemoryRouter>,
    )

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /configuración de plazos/i })).not.toBeInTheDocument()
    expect(screen.getByText(/requiere rol administrador/i)).toBeInTheDocument()
  })

  it('muestra error de carga', async () => {
    vi.mocked(useReportesKpis).mockReturnValue({
      data: null,
      loading: false,
      error: 'No se pudieron cargar los indicadores.',
      reload: vi.fn(),
    })
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true,
    } as ReturnType<typeof useAuth>)

    render(
      <MemoryRouter>
        <CoordinadorDashboardKpis />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/no se pudieron cargar/i)
    })
  })
})
