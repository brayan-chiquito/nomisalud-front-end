import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import { ROUTES_MI_CUENTA } from '@/features/auth/utils/roleAccess'
import { useAuth } from '@/features/auth/context/AuthContext'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { cn } from '@/utils/cn'

export type UserProfileMenuPlacement = 'below' | 'right'

export type UserProfileMenuProps = Readonly<{
  userName: string
  companyName: string
  avatarInitials: string
  avatarClassName?: string
  /** `below`: bajo el avatar (cabecera). `right`: hacia la derecha (sidebar inferior). */
  menuPlacement?: UserProfileMenuPlacement
  /** Muestra nombre y empresa junto al avatar (recomendado en sidebar). */
  showUserInfo?: boolean
}>

/**
 * Menú de perfil (avatar) con cierre de sesión, reutilizable en portal y RRHH.
 */
export function UserProfileMenu({
  userName,
  companyName,
  avatarInitials,
  avatarClassName = 'bg-primary/10 text-primary',
  menuPlacement = 'below',
  showUserInfo = false,
}: UserProfileMenuProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleLogout = useCallback(() => {
    setOpen(false)
    logout()
    navigate('/login')
  }, [logout, navigate])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const menuPositionClass =
    menuPlacement === 'right'
      ? 'left-full bottom-0 ml-2 top-auto right-auto'
      : 'top-full right-0 mt-2'

  return (
    <div ref={containerRef} className={cn('relative', showUserInfo && 'w-full')}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'transition-all duration-150 hover:opacity-90',
          showUserInfo
            ? 'flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-gray-100'
            : 'flex h-9 w-9 items-center justify-center rounded-full',
          !showUserInfo && avatarClassName,
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Menú de perfil de ${userName}`}
      >
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
            showUserInfo && avatarClassName,
          )}
        >
          {avatarInitials}
        </span>
        {showUserInfo ? (
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-medium text-gray-900">{userName}</span>
            <span className="block truncate text-[10px] text-gray-400">{companyName}</span>
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          className={cn(
            'absolute z-[100] w-56 overflow-hidden rounded-card border border-gray-200/60 bg-white py-1 shadow-card',
            menuPositionClass,
          )}
        >
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-medium text-gray-900">{userName}</p>
            <p className="truncate text-xs text-gray-400">{companyName}</p>
          </div>
          <Link
            to={ROUTES_MI_CUENTA}
            role="menuitem"
            onClick={() => setOpen(false)}
            className={buttonClassName('ghost', 'w-full justify-start rounded-none px-4 py-2.5')}
          >
            <User className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
            Mi cuenta
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className={buttonClassName('ghost', 'w-full justify-start rounded-none px-4 py-2.5')}
          >
            <LogOut className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
            Cerrar sesión
          </button>
        </div>
      ) : null}
    </div>
  )
}
