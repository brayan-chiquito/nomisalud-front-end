import { useConciliacion } from '../hooks/useConciliacion'
import { ConciliacionFilters } from './ConciliacionFilters'
import { ConciliacionKpis } from './ConciliacionKpis'
import { ConciliacionTables } from './ConciliacionTables'
import { Card } from '@/components/ui/Card'
import { labelMes } from '../utils/conciliacionDisplay'

/** Vista de conciliación financiera (SCRUM-191). */
export function ConciliacionView() {
  const {
    mes,
    setMes,
    anio,
    setAnio,
    entidadInput,
    setEntidadInput,
    data,
    loading,
    error,
    canQuery,
    exporting,
    exportError,
    exportar,
  } = useConciliacion()

  let periodoLabel: string | null = null
  if (data) periodoLabel = `${labelMes(data.mes)} ${data.anio} · ${data.entidad}`
  else if (canQuery) periodoLabel = `${labelMes(mes)} ${anio}`

  return (
    <Card>
      <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <h2 className="text-lg font-semibold text-gray-900">Conciliación</h2>
        <p className="mt-1 text-sm text-gray-500">
          Compara montos cobrados y pagados por entidad y periodo. Exporta el reporte en Excel para
          contabilidad.
        </p>
        {periodoLabel ? (
          <p className="mt-2 text-xs font-medium text-primary">{periodoLabel}</p>
        ) : null}
      </div>

      <ConciliacionFilters
        mes={mes}
        anio={anio}
        entidadInput={entidadInput}
        loading={loading}
        exporting={exporting}
        exportError={exportError}
        canQuery={canQuery}
        onMesChange={setMes}
        onAnioChange={setAnio}
        onEntidadChange={setEntidadInput}
        onExportar={exportar}
      />

      {error ? (
        <p
          className="mx-5 my-3 rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger-text sm:mx-6"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <ConciliacionKpis data={data} loading={loading && canQuery} />

      <ConciliacionTables
        pendientes={data?.pendientes ?? []}
        detalle={data?.detalle ?? []}
        loading={loading && canQuery}
        hasData={canQuery}
      />
    </Card>
  )
}
