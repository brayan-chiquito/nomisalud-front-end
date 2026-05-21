import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { CollaboratorMiTramitePage } from '@/pages/CollaboratorMiTramitePage'
import { CollaboratorRadicarIncapacidadPage } from '@/pages/CollaboratorRadicarIncapacidadPage'
import { IncapacityAiReviewPage } from '@/pages/IncapacityAiReviewPage'
import { PagosRrhhPage } from '@/pages/PagosRrhhPage'
import { CobroAnteEntidadRrhhPage } from '@/pages/CobroAnteEntidadRrhhPage'
import { ConciliacionRrhhPage } from '@/pages/ConciliacionRrhhPage'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

/** Roles RRHH/admin con acceso a pagos y conciliación (`docs/README.md`). */
const ROLES_FINANZAS_RRHH = ['admin', 'auxiliar_rrhh', 'coordinador_rrhh'] as const

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/cobro-ante-entidad',
    element: (
      <ProtectedRoute allowedRoles={[...ROLES_FINANZAS_RRHH]}>
        <CobroAnteEntidadRrhhPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/pagos',
    element: (
      <ProtectedRoute allowedRoles={[...ROLES_FINANZAS_RRHH]}>
        <PagosRrhhPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/conciliacion',
    element: (
      <ProtectedRoute allowedRoles={[...ROLES_FINANZAS_RRHH]}>
        <ConciliacionRrhhPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/portal/mi-tramite',
    element: (
      <ProtectedRoute>
        <CollaboratorMiTramitePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/portal/mi-tramite/:tramiteId',
    element: (
      <ProtectedRoute>
        <CollaboratorMiTramitePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/portal/radicar-incapacidad',
    element: (
      <ProtectedRoute>
        <CollaboratorRadicarIncapacidadPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/incapacidad/revision-ia',
    element: (
      <ProtectedRoute>
        <IncapacityAiReviewPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
