import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsuariosAdminFilters } from './UsuariosAdminFilters'

describe('UsuariosAdminFilters', () => {
  it('notifica cambios de búsqueda y filtros', async () => {
    const onSearch = vi.fn()
    const onRole = vi.fn()
    const onActivo = vi.fn()
    const user = userEvent.setup()

    render(
      <UsuariosAdminFilters
        roleFilter=""
        activoFilter=""
        search=""
        onRoleChange={onRole}
        onActivoChange={onActivo}
        onSearchChange={onSearch}
      />,
    )

    await user.type(screen.getByLabelText(/^buscar$/i), 'ana')
    expect(onSearch).toHaveBeenCalled()
    await user.selectOptions(screen.getByLabelText(/^rol$/i), 'admin')
    expect(onRole).toHaveBeenCalledWith('admin')
    await user.selectOptions(screen.getByLabelText(/^estado$/i), 'true')
    expect(onActivo).toHaveBeenCalledWith('true')
  })
})
