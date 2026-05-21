import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EstadoDistributionChart } from './EstadoDistributionChart'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-chart">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Cell: () => null,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
}))

describe('EstadoDistributionChart', () => {
  it('muestra carga', () => {
    render(<EstadoDistributionChart data={[]} loading />)
    expect(screen.getByText(/cargando gráfico/i)).toBeInTheDocument()
  })

  it('renderiza gráfico con datos', () => {
    render(
      <EstadoDistributionChart
        data={[
          {
            estado: 'transcrita',
            label: 'Transcrita',
            total: 12,
            fill: '#8b5cf6',
          },
        ]}
        loading={false}
      />,
    )
    expect(screen.getByText(/distribución por estado/i)).toBeInTheDocument()
    expect(screen.getByTestId('responsive-chart')).toBeInTheDocument()
  })
})
