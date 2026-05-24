import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { ThemeProvider } from '@/features/theme/context/ThemeContext'

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  )
}
