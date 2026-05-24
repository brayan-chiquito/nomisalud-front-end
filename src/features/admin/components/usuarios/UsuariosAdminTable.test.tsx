import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsuariosAdminTable } from './UsuariosAdminTable'

const row = {
  id: 'u2',
  email: 'col@test.com',
  role: 'colaborador' as const,
  nombre_completo: 'Col Test',
  tipo_documento: null,
  numero_documento: null,
  area: null,
  cargo: null,
  eps_afiliacion: null,
  arl_afiliacion: null,
  activo: true,
  created_at: '2026-01-01T00:00:00Z',
}

describe('UsuariosAdminTable', () => {
  it('dispara acciones de fila', async () => {
    const onEdit = vi.fn()
    const onDeactivate = vi.fn()
    const onResetPassword = vi.fn()
    const user = userEvent.setup()

    render(
      <UsuariosAdminTable
        items={[row]}
        loading={false}
        page={1}
        total={1}
        totalPages={1}
        pageSize={20}
        currentUserId="admin-1"
        onPageChange={vi.fn()}
        onEdit={onEdit}
        onDeactivate={onDeactivate}
        onResetPassword={onResetPassword}
      />,
    )

    await user.click(screen.getByRole('button', { name: /editar col@test.com/i }))
    expect(onEdit).toHaveBeenCalledWith(row)
    await user.click(screen.getByRole('button', { name: /restablecer contraseña/i }))
    expect(onResetPassword).toHaveBeenCalledWith(row)
  })

  it('deshabilita desactivar para el usuario actual', () => {
    render(
      <UsuariosAdminTable
        items={[{ ...row, id: 'admin-1', email: 'admin@test.com' }]}
        loading={false}
        page={1}
        total={1}
        totalPages={1}
        pageSize={20}
        currentUserId="admin-1"
        onPageChange={vi.fn()}
        onEdit={vi.fn()}
        onDeactivate={vi.fn()}
        onResetPassword={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: /desactivar admin@test.com/i })).toBeDisabled()
  })

  it('muestra carga inicial y vacío sin resultados', () => {
    const { rerender } = render(
      <UsuariosAdminTable
        items={[]}
        loading
        page={1}
        total={0}
        totalPages={0}
        pageSize={20}
        onPageChange={vi.fn()}
        onEdit={vi.fn()}
        onDeactivate={vi.fn()}
        onResetPassword={vi.fn()}
      />,
    )
    expect(screen.getByText(/cargando usuarios/i)).toBeInTheDocument()

    rerender(
      <UsuariosAdminTable
        items={[]}
        loading={false}
        page={1}
        total={0}
        totalPages={0}
        pageSize={20}
        onPageChange={vi.fn()}
        onEdit={vi.fn()}
        onDeactivate={vi.fn()}
        onResetPassword={vi.fn()}
      />,
    )
    expect(screen.getByText(/no hay usuarios que coincidan/i)).toBeInTheDocument()
  })

  it('desactiva fila inactiva y pagina', async () => {
    const onDeactivate = vi.fn()
    const onPageChange = vi.fn()
    const user = userEvent.setup()
    const inactive = { ...row, activo: false }

    render(
      <UsuariosAdminTable
        items={[inactive]}
        loading={false}
        page={1}
        total={25}
        totalPages={2}
        pageSize={20}
        onPageChange={onPageChange}
        onEdit={vi.fn()}
        onDeactivate={onDeactivate}
        onResetPassword={vi.fn()}
      />,
    )

    expect(screen.getByText('Inactivo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /desactivar col@test.com/i })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: /página siguiente/i }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
