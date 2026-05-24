import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { IncapacidadEntidadSearchField } from '@/features/incapacidades/components/IncapacidadEntidadSearchField'
import { useAuth } from '@/features/auth/context/AuthContext'
import {
  FINANCIAL_MODULE_ONLY_MESSAGE,
  messageFromFinancialForbiddenError,
  RADICADOS_DISPONIBLES_API_PATH,
} from '@/features/auth/utils/financialModuleAccess'
import { isContabilidadRole } from '@/features/auth/utils/roleAccess'
import { createPago } from '../services/pagos.service'
import { listRadicadosDisponiblesWithEntidadSearch } from '../utils/radicadosDisponiblesSearch'
import { validatePagoFormFields } from '../utils/validatePagoForm'
import { messageFromHttpError } from '@/features/incapacity-ai-review/utils/httpErrorMessage'
import { messageFromLoadError } from '@/utils/messageFromLoadError'
import { buttonClassName, inputClassName, labelClassName } from '@/components/ui/buttonStyles'
import { Card } from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import type { RadicadoDisponible } from '../types/radicadoDisponible'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'
import { CobradasCheckboxList } from './CobradasCheckboxList'
import { cobradasListFrameClass } from '../utils/cobradasListStyles'
import {
  EMPTY_DISPONIBLES_CONTABILIDAD,
  EMPTY_DISPONIBLES_RRHH,
} from '../utils/radicadoDisponibleDisplay'
import { ListFetchIndicator } from '@/components/ui/ListFetchIndicator'
import { ListPaginationFooter } from '@/components/ui/ListPaginationFooter'
import { pageSizeFromResponse, paginationRange } from '@/utils/pagination'
import { awaitMinBusyDuration } from '@/utils/awaitMinBusyDuration'

const LOAD_DISPONIBLES_ERROR = 'No se pudo cargar los radicados disponibles para liquidar.'

export type RegistrarPagoFormProps = Readonly<{
  onRegistroExitoso?: () => void
}>

/**
 * Formulario para `POST /pagos`: radicados desde `GET /pagos/radicados-disponibles`.
 */
export function RegistrarPagoForm({ onRegistroExitoso }: RegistrarPagoFormProps) {
  const { user } = useAuth()
  const isContabilidad = isContabilidadRole(user?.role)

  const [entidadOrigen, setEntidadOrigen] = useState('')
  const [referencia, setReferencia] = useState('')
  const [monto, setMonto] = useState('')
  const [selectedRadicados, setSelectedRadicados] = useState<ReadonlySet<string>>(new Set())

  const [disponibles, setDisponibles] = useState<RadicadoDisponible[]>([])
  const [disponiblesPage, setDisponiblesPage] = useState(1)
  const [disponiblesPages, setDisponiblesPages] = useState(0)
  const [disponiblesTotal, setDisponiblesTotal] = useState(0)
  const [entidadFiltro, setEntidadFiltro] = useState('')
  const [entidadFiltroDebounced, setEntidadFiltroDebounced] = useState('')
  const [loadingDisponibles, setLoadingDisponibles] = useState(true)
  const [fetchingDisponibles, setFetchingDisponibles] = useState(false)
  const [disponiblesError, setDisponiblesError] = useState<string | null>(null)
  const hasLoadedDisponiblesRef = useRef(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Readonly<Record<string, string>>>({})

  useEffect(() => {
    const t = globalThis.setTimeout(() => setEntidadFiltroDebounced(entidadFiltro.trim()), 350)
    return () => globalThis.clearTimeout(t)
  }, [entidadFiltro])

  useEffect(() => {
    setDisponiblesPage(1)
  }, [entidadFiltroDebounced])

  const resolveLoadError = useCallback(
    (err: unknown): string => {
      const forbidden = messageFromFinancialForbiddenError(
        err,
        user?.role,
        RADICADOS_DISPONIBLES_API_PATH,
      )
      if (forbidden) return forbidden
      if (isContabilidad) return messageFromLoadError(err, FINANCIAL_MODULE_ONLY_MESSAGE)
      return messageFromLoadError(err, LOAD_DISPONIBLES_ERROR)
    },
    [isContabilidad, user?.role],
  )

  const loadDisponibles = useCallback(
    async (signal: AbortSignal) => {
      const busyStartedAt = Date.now()
      if (hasLoadedDisponiblesRef.current) setFetchingDisponibles(true)
      else setLoadingDisponibles(true)
      setDisponiblesError(null)
      try {
        const res = await listRadicadosDisponiblesWithEntidadSearch({
          page: disponiblesPage,
          ...(entidadFiltroDebounced ? { entidad: entidadFiltroDebounced } : {}),
          signal,
        })
        if (!signal.aborted) {
          if (hasLoadedDisponiblesRef.current) await awaitMinBusyDuration(busyStartedAt, signal)
        }
        if (!signal.aborted) {
          hasLoadedDisponiblesRef.current = true
          setDisponibles([...res.items])
          setDisponiblesPages(res.pages)
          setDisponiblesTotal(res.total)
        }
      } catch (err) {
        if (!signal.aborted) {
          hasLoadedDisponiblesRef.current = false
          setDisponibles([])
          setDisponiblesPages(0)
          setDisponiblesTotal(0)
          setDisponiblesError(resolveLoadError(err))
        }
      } finally {
        if (!signal.aborted) {
          setLoadingDisponibles(false)
          setFetchingDisponibles(false)
        }
      }
    },
    [disponiblesPage, entidadFiltroDebounced, resolveLoadError],
  )

  useAbortableEffect(loadDisponibles, [loadDisponibles])

  const reloadDisponibles = useCallback(() => {
    listRadicadosDisponiblesWithEntidadSearch({
      page: disponiblesPage,
      ...(entidadFiltroDebounced ? { entidad: entidadFiltroDebounced } : {}),
    })
      .then((res) => {
        setDisponibles([...res.items])
        setDisponiblesPages(res.pages)
        setDisponiblesTotal(res.total)
        setDisponiblesError(null)
      })
      .catch((err) => {
        setDisponibles([])
        setDisponiblesError(resolveLoadError(err))
      })
  }, [disponiblesPage, entidadFiltroDebounced, resolveLoadError])

  const toggleRadicado = useCallback((radicado: string) => {
    setSelectedRadicados((prev) => {
      const next = new Set(prev)
      if (next.has(radicado)) next.delete(radicado)
      else next.add(radicado)
      return next
    })
    setFieldErrors((fe) => ({ ...fe, radicados: '' }))
  }, [])

  const validate = useCallback((): boolean => {
    const fe = validatePagoFormFields({
      entidadOrigen,
      referencia,
      monto,
      radicadosCount: selectedRadicados.size,
    })
    setFieldErrors(fe)
    return Object.keys(fe).length === 0
  }, [entidadOrigen, referencia, monto, selectedRadicados])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validate()) return
    setSubmitting(true)
    try {
      await createPago({
        entidad_origen: entidadOrigen.trim(),
        referencia: referencia.trim(),
        monto: monto.trim().replace(',', '.'),
        radicados: [...selectedRadicados],
      })
      setEntidadOrigen('')
      setReferencia('')
      setMonto('')
      setSelectedRadicados(new Set())
      setFieldErrors({})
      onRegistroExitoso?.()
      reloadDisponibles()
    } catch (err) {
      setError(messageFromHttpError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const emptyDisponibles = isContabilidad ? EMPTY_DISPONIBLES_CONTABILIDAD : EMPTY_DISPONIBLES_RRHH
  const pageSize = pageSizeFromResponse(disponiblesTotal, disponiblesPages, disponibles.length)
  const { start, end } = paginationRange(disponiblesTotal, disponiblesPage, pageSize)

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-gray-900">Registrar pago</h2>
        <p className="mt-0.5 text-sm text-gray-500">
          Selecciona radicados en estado <strong>cobrada</strong> sin pago registrado. Tras guardar,
          pasan a <strong>pagada</strong>.
        </p>
      </div>

      <form
        onSubmit={(ev) => {
          handleSubmit(ev).catch(() => undefined)
        }}
        className="flex flex-col gap-5 p-5 sm:p-6"
      >
        {error ? (
          <p className="rounded-lg border border-danger/20 bg-danger-light px-3 py-2 text-sm text-danger-text">
            {error}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pago-entidad" className={labelClassName}>
              Entidad origen <span className="text-danger">*</span>
            </label>
            <input
              id="pago-entidad"
              type="text"
              value={entidadOrigen}
              onChange={(ev) => {
                setEntidadOrigen(ev.target.value)
                setFieldErrors((fe) => ({ ...fe, entidad_origen: '' }))
              }}
              disabled={submitting}
              autoComplete="organization"
              placeholder="Ej. NomiSalud"
              className={cn(inputClassName, fieldErrors.entidad_origen ? 'border-danger/40' : '')}
            />
            {fieldErrors.entidad_origen ? (
              <p className="text-xs text-danger">{fieldErrors.entidad_origen}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pago-referencia" className={labelClassName}>
              Referencia <span className="text-danger">*</span>
            </label>
            <input
              id="pago-referencia"
              type="text"
              value={referencia}
              onChange={(ev) => {
                setReferencia(ev.target.value)
                setFieldErrors((fe) => ({ ...fe, referencia: '' }))
              }}
              disabled={submitting}
              placeholder="Ej. LOTE-2026-001"
              className={cn(inputClassName, fieldErrors.referencia ? 'border-danger/40' : '')}
            />
            {fieldErrors.referencia ? (
              <p className="text-xs text-danger">{fieldErrors.referencia}</p>
            ) : null}
          </div>
        </div>

        <div className="flex max-w-md flex-col gap-1.5">
          <label htmlFor="pago-monto" className={labelClassName}>
            Monto <span className="text-danger">*</span>
          </label>
          <input
            id="pago-monto"
            type="text"
            inputMode="decimal"
            value={monto}
            onChange={(ev) => {
              setMonto(ev.target.value)
              setFieldErrors((fe) => ({ ...fe, monto: '' }))
            }}
            disabled={submitting}
            placeholder="Ej. 1500000.50"
            className={cn(inputClassName, fieldErrors.monto ? 'border-danger/40' : '')}
          />
          {fieldErrors.monto ? <p className="text-xs text-danger">{fieldErrors.monto}</p> : null}
        </div>

        <fieldset className="flex flex-col gap-2 border-0 p-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <legend className={labelClassName}>
              Radicados disponibles <span className="text-danger">*</span>
            </legend>
            <IncapacidadEntidadSearchField
              value={entidadFiltro}
              onChange={setEntidadFiltro}
              suggestionSources="radicados-disponibles"
              entidadPlaceholder="Filtrar por entidad…"
              entidadAriaLabel="Filtrar radicados por entidad"
              className="min-w-[180px] max-w-xs flex-1 sm:flex-none"
            />
          </div>

          <ListFetchIndicator
            active={fetchingDisponibles}
            label="Actualizando radicados…"
            className="mx-0 border-x-0"
          />

          {disponiblesError ? (
            <p className="rounded-lg border border-danger/20 bg-danger-light px-3 py-2 text-sm text-danger-text">
              {disponiblesError}
            </p>
          ) : null}

          <div className={cobradasListFrameClass(Boolean(fieldErrors.radicados))}>
            <CobradasCheckboxList
              loading={loadingDisponibles && disponibles.length === 0}
              items={disponibles}
              selectedRadicados={selectedRadicados}
              submitting={submitting}
              emptyMessage={emptyDisponibles}
              onToggle={toggleRadicado}
            />
          </div>

          {disponiblesPages > 1 ? (
            <ListPaginationFooter
              start={start}
              end={end}
              total={disponiblesTotal}
              page={disponiblesPage}
              totalPages={disponiblesPages}
              loading={loadingDisponibles}
              onPrev={() => setDisponiblesPage((p) => Math.max(1, p - 1))}
              onNext={() => setDisponiblesPage((p) => p + 1)}
              pageBadgeClassName="bg-primary"
            />
          ) : null}

          {fieldErrors.radicados ? (
            <p className="text-xs text-danger">{fieldErrors.radicados}</p>
          ) : null}
        </fieldset>

        <div className="flex justify-end border-t border-gray-100 pt-4">
          <button
            type="submit"
            disabled={submitting || (loadingDisponibles && disponibles.length === 0)}
            className={buttonClassName('primary', 'min-w-[160px] gap-2')}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            {submitting ? 'Registrando…' : 'Registrar pago'}
          </button>
        </div>
      </form>
    </Card>
  )
}
