import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { RrhhDashboardKpis } from './RrhhDashboardKpis'

vi.mock('@/features/incapacidades/services/incapacidadKpis.service', () => ({
  fetchIncapacidadKpis: vi.fn(),
}))

import { fetchIncapacidadKpis } from '@/features/incapacidades/services/incapacidadKpis.service'

describe('RrhhDashboardKpis', () => {
  beforeEach(() => {
    vi.mocked(fetchIncapacidadKpis).mockReset()
  })

  it('muestra los totales cuando la API responde', async () => {
    vi.mocked(fetchIncapacidadKpis).mockResolvedValue({
      totalRecibidas: 10,
      enVerificacion: 2,
      transcribiendo: 3,
      pagadas: 4,
    })
    render(<RrhhDashboardKpis />)
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
    expect(screen.getByText('Total recibidas')).toBeInTheDocument()
  })
})
