import { useState } from 'react'
import { Plus, Settings2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { buttonClassName } from '@/components/ui/buttonStyles'
import { usePlazosEntidadList } from '../../hooks/usePlazosEntidadList'
import type { PlazoEntidadItem } from '../../types/plazoEntidad'
import { PlazoEntidadCreateModal } from './PlazoEntidadCreateModal'
import { PlazoEntidadDeleteModal } from './PlazoEntidadDeleteModal'
import { PlazoEntidadEditModal } from './PlazoEntidadEditModal'
import { PlazosEntidadTable } from './PlazosEntidadTable'

/** Panel CRUD de plazos por entidad (solo admin). */
export function PlazosEntidadPanel() {
  const { items, loading, error, reload } = usePlazosEntidadList(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editPlazo, setEditPlazo] = useState<PlazoEntidadItem | null>(null)
  const [deletePlazo, setDeletePlazo] = useState<PlazoEntidadItem | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleMutationSuccess = (message: string) => {
    setSuccessMsg(message)
    reload()
    globalThis.setTimeout(() => setSuccessMsg(null), 4000)
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Settings2 className="h-5 w-5 text-primary" aria-hidden />
            Plazos por entidad
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configura plazos límite, alertas y días promedio de pago por EPS/ARL y tipo de
            incapacidad.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className={buttonClassName('primary', 'gap-2')}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Nuevo plazo
        </button>
      </div>

      {successMsg ? (
        <output className="mx-5 mt-3 block w-auto rounded-lg border border-success/20 bg-success-light px-4 py-2 text-sm text-success-text sm:mx-6">
          {successMsg}
        </output>
      ) : null}

      {error ? (
        <p
          className="mx-5 my-3 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger-text sm:mx-6"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <PlazosEntidadTable
        items={items}
        loading={loading}
        onEdit={setEditPlazo}
        onDelete={setDeletePlazo}
      />

      <PlazoEntidadCreateModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => handleMutationSuccess('Plazo creado correctamente.')}
      />
      <PlazoEntidadEditModal
        plazo={editPlazo}
        onClose={() => setEditPlazo(null)}
        onSuccess={() => handleMutationSuccess('Plazo actualizado.')}
      />
      <PlazoEntidadDeleteModal
        plazo={deletePlazo}
        onClose={() => setDeletePlazo(null)}
        onSuccess={() => handleMutationSuccess('Plazo eliminado.')}
      />
    </Card>
  )
}
