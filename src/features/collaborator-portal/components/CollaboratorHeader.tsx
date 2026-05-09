import logo from '@/assets/logo.png'

export type CollaboratorHeaderProps = Readonly<{
  userName: string
  companyName: string
  avatarInitials: string
}>

/**
 * Cabecera compartida del portal colaborador (logo + usuario).
 * Las props pueden enlazarse después a `useAuth()` o a una query de perfil.
 */
export function CollaboratorHeader({
  userName,
  companyName,
  avatarInitials,
}: CollaboratorHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-2.5">
        <img src={logo} alt="Nomisalud" className="h-[30px] w-[30px] object-contain" />
        <span className="text-[15px] font-bold text-slate-800">Nomisalud</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-sm font-semibold text-slate-800">{userName}</span>
          <span className="text-xs text-slate-500">{companyName}</span>
        </div>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-[13px] font-semibold text-white"
          aria-hidden
        >
          {avatarInitials}
        </div>
        {/* Menú de usuario (cerrar sesión, preferencias) cuando exista diseño */}
      </div>
    </header>
  )
}
