import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RegistrarPagoForm } from './RegistrarPagoForm'
import { PagosListPanel } from './PagosListPanel'

/**
 * Vista RRHH: alta de pago + listado (SCRUM-187).
 */
export function PagosRrhhView() {
  const [listRefresh, setListRefresh] = useState(0)

  return (
    <div className="flex flex-col">
      <p className="mb-4 text-sm text-gray-500">
        Solo trámites en estado <strong className="font-medium text-gray-700">cobrada</strong>{' '}
        pueden asociarse a un pago. Si aún están en transcrita, márcalos en{' '}
        <Link
          to="/dashboard/cobro-ante-entidad"
          className="font-medium text-primary hover:underline"
        >
          Cobro ante entidad
        </Link>
        .
      </p>
      <RegistrarPagoForm onRegistroExitoso={() => setListRefresh((n) => n + 1)} />
      <PagosListPanel refreshToken={listRefresh} />
    </div>
  )
}
