import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600">Página no encontrada</p>
      <Link to="/" className="text-blue-600 underline hover:text-blue-800">
        Volver al inicio
      </Link>
    </div>
  )
}
