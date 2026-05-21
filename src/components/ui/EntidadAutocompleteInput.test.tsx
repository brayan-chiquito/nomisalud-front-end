import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EntidadAutocompleteInput } from './EntidadAutocompleteInput'

describe('EntidadAutocompleteInput', () => {
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
})
