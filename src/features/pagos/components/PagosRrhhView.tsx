import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { isContabilidadRole } from '@/features/auth/utils/roleAccess'
import { RegistrarPagoForm } from './RegistrarPagoForm'
import { PagosListPanel } from './PagosListPanel'

/**
 * Vista de pagos: alta + historial (SCRUM-187 / SCRUM-206).
 */
export function PagosRrhhView() {
  const { user } = useAuth()
  const [listRefresh, setListRefresh] = useState(0)
  const isContabilidad = isContabilidadRole(user?.role)

  return (
    <div className="flex flex-col">
      {isContabilidad ? (
        <p className="mb-4 text-sm text-gray-500">
          Radicados en <strong className="font-medium text-gray-700">cobrada</strong> pendientes de
          liquidación. El cobro ante la EPS lo gestiona RRHH; aquí registras el pago al colaborador.
        </p>
      ) : (
        <p className="mb-4 text-sm text-gray-500">
          Solo trámites en estado <strong className="font-medium text-gray-700">cobrada</strong> sin
          pago pueden liquidarse aquí. Si aún están en transcrita, márcalos en{' '}
          <Link
            to="/dashboard/cobro-ante-entidad"
            className="font-medium text-primary hover:underline"
          >
            Cobro ante entidad
          </Link>
          .
        </p>
      )}
      <RegistrarPagoForm onRegistroExitoso={() => setListRefresh((n) => n + 1)} />
      <PagosListPanel refreshToken={listRefresh} />
    </div>
  )
}
