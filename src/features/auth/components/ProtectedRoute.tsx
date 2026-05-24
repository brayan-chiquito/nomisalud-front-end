import { Navigate, Outlet } from 'react-router-dom'
import { accessDeniedRedirectForRole } from '../utils/roleAccess'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  allowedRoles?: string[]
  /** Si el rol del usuario está en esta lista, se deniega el acceso (p. ej. contabilidad en rutas de documentos). */
  forbidRoles?: readonly string[]
  /** Destino al denegar; por defecto login o inicio financiero para contabilidad. */
  deniedRedirect?: string
  children?: React.ReactNode
}

export function ProtectedRoute({
  allowedRoles,
  forbidRoles,
  deniedRedirect,
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const denyTo = accessDeniedRedirectForRole(user?.role, deniedRedirect)

  if (forbidRoles && user && forbidRoles.includes(user.role)) {
    return <Navigate to={denyTo} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={denyTo} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
