import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConciliacionFilters } from './ConciliacionFilters'

vi.mock('@/hooks/useEntidadSuggestions', () => ({
  useEntidadSuggestions: () => ({ suggestions: ['SIS'], loading: false }),
}))

const baseProps = {
  mes: 5,
  anio: 2026,
  entidadInput: '',
  loading: false,
  exporting: false,
  exportError: null,
  canQuery: false,
  onMesChange: vi.fn(),
  onAnioChange: vi.fn(),
  onEntidadChange: vi.fn(),
  onExportar: vi.fn().mockResolvedValue(undefined),
}

describe('ConciliacionFilters', () => {
  it('muestra aviso cuando canQuery es false', () => {
    render(<ConciliacionFilters {...baseProps} />)
    expect(screen.getByText(/al menos 2 caracteres/i)).toBeInTheDocument()
  })

  it('cambia mes y año', () => {
    const onMesChange = vi.fn()
    const onAnioChange = vi.fn()
    render(
      <ConciliacionFilters {...baseProps} onMesChange={onMesChange} onAnioChange={onAnioChange} />,
    )
    fireEvent.change(screen.getByLabelText(/mes/i), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText(/año/i), { target: { value: '2025' } })
    expect(onMesChange).toHaveBeenCalledWith(3)
    expect(onAnioChange).toHaveBeenCalledWith(2025)
  })

  it('dispara exportar y muestra error de exportación', async () => {
    const onExportar = vi.fn().mockResolvedValue(undefined)
    const { rerender } = render(
      <ConciliacionFilters {...baseProps} canQuery onExportar={onExportar} />,
    )
    fireEvent.click(screen.getByRole('button', { name: /exportar excel/i }))
    expect(onExportar).toHaveBeenCalled()
    rerender(
      <ConciliacionFilters
        {...baseProps}
        canQuery
        exportError="Error al exportar"
        onExportar={onExportar}
      />,
    )
    expect(screen.getByText('Error al exportar')).toBeInTheDocument()
  })

  it('muestra estado exportando', () => {
    render(<ConciliacionFilters {...baseProps} canQuery exporting />)
    expect(screen.getByRole('button', { name: /exportando/i })).toBeDisabled()
  })
})
