import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { PagosListPanel } from './PagosListPanel'
import { listPagos } from '../services/pagos.service'

vi.mock('../services/pagos.service', () => ({
  listPagos: vi.fn(),
  listPagosWithTextSearch: vi.fn(),
}))

vi.mock('@/hooks/useEntidadSuggestions', () => ({
  useEntidadSuggestions: () => ({ suggestions: [], loading: false }),
}))

describe('PagosListPanel', () => {
  beforeEach(() => {
    vi.mocked(listPagos).mockReset()
    vi.mocked(listPagos).mockResolvedValue({
      items: [
        {
          id: 'p1',
          entidad_origen: 'EPS',
          referencia: 'REF-1',
          monto: '1000',
          estado: 'completado',
          fecha_operacion: '2025-01-15T10:00:00Z',
        },
      ],
      total: 1,
      pages: 1,
    })
  })

  it('muestra filas del histórico', async () => {
    render(<PagosListPanel />)
    await waitFor(() => expect(screen.getByText('EPS')).toBeInTheDocument())
    expect(screen.getByText('REF-1')).toBeInTheDocument()
  })
})
