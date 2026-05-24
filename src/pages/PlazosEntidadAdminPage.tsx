import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { PlazosEntidadPanel } from '@/features/admin/components/plazos/PlazosEntidadPanel'
import { RrhhDashboardShell } from '@/features/dashboard/components/RrhhDashboardShell'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { useReturnNavigation } from '@/hooks/useReturnNavigation'
import { displayNameFromEmail, initialsFromEmail } from '@/utils/userDisplay'

export function PlazosEntidadAdminPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const { goBack } = useReturnNavigation('/dashboard')

  return (
    <RrhhDashboardShell
      headerTitle="Plazos por entidad"
      userName={displayNameFromEmail(user?.email)}
      userInitials={initialsFromEmail(user?.email, user?.id)}
    >
      <button
        type="button"
        onClick={goBack}
        className={`${buttonClassName('secondary', 'mb-6 gap-2')} inline-flex`}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Volver
      </button>

      {!isAdmin ? (
        <div
          className="rounded-card border border-warning/30 bg-warning-light px-5 py-4 text-sm text-gray-800"
          role="status"
        >
          La configuración de plazos por entidad está restringida al rol{' '}
          <span className="font-medium">administrador</span>. Si necesitas consultar o modificar
          plazos, solicita acceso al equipo de administración.
        </div>
      ) : (
        <PlazosEntidadPanel />
      )}
    </RrhhDashboardShell>
  )
}
