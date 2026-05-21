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
import { RecepcionRadicarPage } from '@/pages/RecepcionRadicarPage'
import { PlazosEntidadAdminPage } from '@/pages/PlazosEntidadAdminPage'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import {
  FINANZAS_HOME_PATH,
  ROLE_CONTABILIDAD,
  ROLES_MODULO_FINANZAS,
} from '@/features/auth/utils/roleAccess'

/** Roles RRHH/admin con cobro ante entidad (sin contabilidad). */
const ROLES_FINANZAS_RRHH = ['admin', 'auxiliar_rrhh', 'coordinador_rrhh'] as const

const ROLES_RECEPCION_RADICAR = ['recepcion', 'auxiliar_rrhh', 'coordinador_rrhh', 'admin'] as const

const ROLES_PLAZOS_NAV = ['admin', 'coordinador_rrhh'] as const

/** Rutas de documentos/incapacidades prohibidas para contabilidad (SCRUM-201). */
const FORBID_CONTABILIDAD = [ROLE_CONTABILIDAD] as const

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
      <ProtectedRoute forbidRoles={FORBID_CONTABILIDAD} deniedRedirect={FINANZAS_HOME_PATH}>
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
      <ProtectedRoute allowedRoles={[...ROLES_MODULO_FINANZAS]}>
        <PagosRrhhPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/recepcion/radicar',
    element: (
      <ProtectedRoute allowedRoles={[...ROLES_RECEPCION_RADICAR]}>
        <RecepcionRadicarPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/plazos-entidad',
    element: (
      <ProtectedRoute allowedRoles={[...ROLES_PLAZOS_NAV]}>
        <PlazosEntidadAdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/conciliacion',
    element: (
      <ProtectedRoute allowedRoles={[...ROLES_MODULO_FINANZAS]}>
        <ConciliacionRrhhPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/portal/mi-tramite',
    element: (
      <ProtectedRoute forbidRoles={FORBID_CONTABILIDAD} deniedRedirect={FINANZAS_HOME_PATH}>
        <CollaboratorMiTramitePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/portal/mi-tramite/:tramiteId',
    element: (
      <ProtectedRoute forbidRoles={FORBID_CONTABILIDAD} deniedRedirect={FINANZAS_HOME_PATH}>
        <CollaboratorMiTramitePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/portal/radicar-incapacidad',
    element: (
      <ProtectedRoute forbidRoles={FORBID_CONTABILIDAD} deniedRedirect={FINANZAS_HOME_PATH}>
        <CollaboratorRadicarIncapacidadPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/incapacidad/revision-ia',
    element: (
      <ProtectedRoute forbidRoles={FORBID_CONTABILIDAD} deniedRedirect={FINANZAS_HOME_PATH}>
        <IncapacityAiReviewPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
