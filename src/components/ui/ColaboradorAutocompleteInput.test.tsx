import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ColaboradorAutocompleteInput } from './ColaboradorAutocompleteInput'

const item = {
  id: 'id-1',
  nombre_completo: 'Pedro Gómez',
  numero_documento: '999',
  email: 'p@test.com',
}

describe('ColaboradorAutocompleteInput', () => {
  it('notifica selección con el ítem completo', async () => {
    const onSelect = vi.fn()
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(
      <ColaboradorAutocompleteInput
        value="ped"
        onChange={onChange}
        suggestions={[item]}
        onSelect={onSelect}
      />,
    )

    await user.click(screen.getByLabelText(/buscar colaborador/i))
    await user.click(screen.getByRole('button', { name: /pedro gómez/i }))
    expect(onSelect).toHaveBeenCalledWith(item)
    expect(onChange).toHaveBeenCalledWith('Pedro Gómez')
  })

  it('muestra mensaje vacío sin cerrar el desplegable', async () => {
    const user = userEvent.setup()
    render(
      <ColaboradorAutocompleteInput
        value="xyz"
        onChange={vi.fn()}
        suggestions={[]}
        suggestionsLoading={false}
        onSelect={vi.fn()}
      />,
    )
    const input = screen.getByLabelText(/buscar colaborador/i)
    await user.click(input)
    expect(screen.getByText(/no se encontraron colaboradores/i)).toBeInTheDocument()
    expect(input).toHaveFocus()
  })
})
