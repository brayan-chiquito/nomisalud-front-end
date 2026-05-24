import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { postLoginPathForRole } from '@/features/auth/utils/postLoginPath'
import { useAuth } from '@/features/auth/context/AuthContext'
import { RecepcionRadicarView } from '@/features/recepcion/components/RecepcionRadicarView'

const ROLES_RECEPCION_RADICAR = ['recepcion', 'auxiliar_rrhh', 'coordinador_rrhh', 'admin'] as const

export function RecepcionRadicarPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.role) return
    if (!ROLES_RECEPCION_RADICAR.includes(user.role as (typeof ROLES_RECEPCION_RADICAR)[number])) {
      navigate(postLoginPathForRole(user.role), { replace: true })
    }
  }, [user?.role, navigate])

  return <RecepcionRadicarView />
}
