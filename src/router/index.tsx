import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { CollaboratorMiTramitePage } from '@/pages/CollaboratorMiTramitePage'
import { CollaboratorRadicarIncapacidadPage } from '@/pages/CollaboratorRadicarIncapacidadPage'
import { IncapacityAiReviewPage } from '@/pages/IncapacityAiReviewPage'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

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
    path: '/portal/mi-tramite',
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
