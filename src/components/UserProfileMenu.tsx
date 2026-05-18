import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { cn } from '@/utils/cn'

export type UserProfileMenuProps = Readonly<{
  userName: string
  companyName: string
  avatarInitials: string
  avatarClassName?: string
}>

/**
 * Menú de perfil (avatar) con cierre de sesión, reutilizable en portal y RRHH.
 */
export function UserProfileMenu({
  userName,
  companyName,
  avatarInitials,
  avatarClassName = 'bg-violet-600',
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

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold text-white hover:opacity-90',
          avatarClassName,
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Menú de perfil de ${userName}`}
      >
        {avatarInitials}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-slate-800">{userName}</p>
            <p className="truncate text-xs text-slate-500">{companyName}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            Cerrar sesión
          </button>
        </div>
      ) : null}
    </div>
  )
}
