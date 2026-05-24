import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { EntidadAutocompleteInput } from './EntidadAutocompleteInput'

describe('EntidadAutocompleteInput', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('no deshabilita el input y muestra sugerencias al enfocar', () => {
    const onChange = vi.fn()
    render(
      <EntidadAutocompleteInput
        value="sis"
        onChange={onChange}
        suggestions={['SIS', 'EPS Sura']}
      />,
    )
    const input = screen.getByLabelText('Filtrar por entidad')
    expect(input).not.toBeDisabled()
    fireEvent.focus(input)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'SIS' })).toBeInTheDocument()
  })

  it('aplica la sugerencia y cierra el listado al hacer clic', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <EntidadAutocompleteInput value="si" onChange={onChange} suggestions={['SIS']} />,
    )
    fireEvent.focus(screen.getByLabelText('Filtrar por entidad'))
    fireEvent.click(screen.getByRole('button', { name: 'SIS' }))
    expect(onChange).toHaveBeenCalledWith('SIS')
    rerender(<EntidadAutocompleteInput value="SIS" onChange={onChange} suggestions={['SIS']} />)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('muestra sugerencias de nuevo al editar sin blur tras elegir una', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <EntidadAutocompleteInput value="si" onChange={onChange} suggestions={['SIS']} />,
    )
    const input = screen.getByLabelText('Filtrar por entidad')
    fireEvent.focus(input)
    fireEvent.click(screen.getByRole('button', { name: 'SIS' }))

    rerender(<EntidadAutocompleteInput value="SIS" onChange={onChange} suggestions={['SIS']} />)
    fireEvent.change(input, { target: { value: 'si' } })
    rerender(<EntidadAutocompleteInput value="si" onChange={onChange} suggestions={['SIS']} />)

    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('muestra estado de carga en el desplegable mientras carga sugerencias', () => {
    render(
      <EntidadAutocompleteInput
        value="si"
        onChange={vi.fn()}
        suggestions={[]}
        suggestionsLoading
      />,
    )
    fireEvent.focus(screen.getByLabelText('Filtrar por entidad'))
    expect(screen.getByText(/buscando/i)).toBeInTheDocument()
  })

  it('muestra mensaje cuando no hay coincidencias', () => {
    render(<EntidadAutocompleteInput value="xyz" onChange={vi.fn()} suggestions={[]} />)
    fireEvent.focus(screen.getByLabelText('Filtrar por entidad'))
    expect(screen.getByText(/no se encontraron coincidencias/i)).toBeInTheDocument()
  })

  it('cierra el listado al perder foco', () => {
    render(<EntidadAutocompleteInput value="sis" onChange={vi.fn()} suggestions={['SIS']} />)
    const input = screen.getByLabelText('Filtrar por entidad')
    fireEvent.focus(input)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    fireEvent.blur(input)
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
