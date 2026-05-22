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
    expect(screen.getByText(/no se encontraron colaboradores activos/i)).toBeInTheDocument()
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument()
    expect(input).toHaveFocus()
  })

  it('muestra carga mientras hay debounce pendiente', async () => {
    const user = userEvent.setup()
    render(
      <ColaboradorAutocompleteInput
        value="juan"
        onChange={vi.fn()}
        suggestions={[]}
        suggestionsLoading={false}
        isDebouncing
        onSelect={vi.fn()}
      />,
    )
    await user.click(screen.getByLabelText(/buscar colaborador/i))
    expect(screen.getByText(/buscando colaboradores/i)).toBeInTheDocument()
  })

  it('muestra error de búsqueda', async () => {
    const user = userEvent.setup()
    render(
      <ColaboradorAutocompleteInput
        value="juan"
        onChange={vi.fn()}
        suggestions={[]}
        searchError="Sin permiso"
        onSelect={vi.fn()}
      />,
    )
    await user.click(screen.getByLabelText(/buscar colaborador/i))
    expect(screen.getByText('Sin permiso')).toBeInTheDocument()
  })

  it('muestra estado de carga en el desplegable', async () => {
    const user = userEvent.setup()
    render(
      <ColaboradorAutocompleteInput
        value="ab"
        onChange={vi.fn()}
        suggestions={[]}
        suggestionsLoading
        onSelect={vi.fn()}
      />,
    )
    await user.click(screen.getByLabelText(/buscar colaborador/i))
    expect(screen.getByText(/buscando colaboradores/i)).toBeInTheDocument()
  })

  it('omite email en subtítulo si no viene', async () => {
    const user = userEvent.setup()
    const sinEmail = { ...item, email: '' }
    render(
      <ColaboradorAutocompleteInput
        value="ped"
        onChange={vi.fn()}
        suggestions={[sinEmail]}
        onSelect={vi.fn()}
      />,
    )
    await user.click(screen.getByLabelText(/buscar colaborador/i))
    expect(screen.getByText(/CC 999/)).toBeInTheDocument()
    expect(screen.queryByText(/@/)).not.toBeInTheDocument()
  })

  it('actualiza el valor al escribir', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <ColaboradorAutocompleteInput
        value=""
        onChange={onChange}
        suggestions={[]}
        onSelect={vi.fn()}
      />,
    )
    await user.type(screen.getByLabelText(/buscar colaborador/i), 'pe')
    expect(onChange).toHaveBeenCalled()
  })
})
