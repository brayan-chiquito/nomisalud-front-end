import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { UserProfileMenu } from './UserProfileMenu'

const mockLogout = vi.fn()
const mockNavigate = vi.fn()

vi.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => ({ logout: mockLogout }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('UserProfileMenu', () => {
  it('abre el menú y cierra sesión', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <UserProfileMenu userName="Ana" companyName="Portal" avatarInitials="AN" />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /menú de perfil de ana/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await user.click(screen.getByRole('menuitem', { name: /cerrar sesión/i }))
    expect(mockLogout).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('con menuPlacement right abre el menú hacia la derecha', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <UserProfileMenu
          userName="Ana"
          companyName="Recursos Humanos"
          avatarInitials="AN"
          menuPlacement="right"
          showUserInfo
        />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /menú de perfil de ana/i }))
    const menu = screen.getByRole('menu')
    expect(menu).toHaveClass('left-full')
    expect(menu).not.toHaveClass('top-full')
  })
})
