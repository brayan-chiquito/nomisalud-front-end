import { useAuditoriaAccesos } from '../hooks/useAuditoriaAccesos'
import { AuditoriaFilters } from './AuditoriaFilters'
import { AuditoriaTable } from './AuditoriaTable'
import { Card } from '@/components/ui/Card'

/** Vista de auditoría de accesos (SCRUM-205). */
export function AuditoriaView() {
  const {
    data,
    loading,
    error,
    page,
    setPage,
    userId,
    setUserId,
    accion,
    setAccion,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    pageSize,
  } = useAuditoriaAccesos()

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = data?.pages ?? 0

  return (
    <Card>
      <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <h2 className="text-lg font-semibold text-gray-900">Auditoría de accesos</h2>
        <p className="mt-1 text-sm text-gray-500">
          Historial de acciones registradas en el sistema. Solo lectura.
        </p>
      </div>

      <AuditoriaFilters
        userId={userId}
        accion={accion}
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        loading={loading}
        onUserIdChange={setUserId}
        onAccionChange={setAccion}
        onFechaDesdeChange={setFechaDesde}
        onFechaHastaChange={setFechaHasta}
      />

      {error ? (
        <p
          className="mx-5 my-3 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger-text sm:mx-6"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <section className="flex min-h-[420px] flex-col">
        <AuditoriaTable
          items={items}
          loading={loading}
          page={page}
          total={total}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </section>
    </Card>
  )
}
