import { useCallback, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { listIncapacidades } from '@/features/incapacidades/services/listIncapacidades.service'
import { createPago } from '../services/pagos.service'
import { validatePagoFormFields } from '../utils/validatePagoForm'
import { messageFromHttpError } from '@/features/incapacity-ai-review/utils/httpErrorMessage'
import { buttonClassName, inputClassName, labelClassName } from '@/components/ui/buttonStyles'
import { Card } from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import type { IncapacidadListItem } from '@/features/incapacidades/types/listIncapacidades'
import { useAbortableEffect } from '@/hooks/useAbortableEffect'
import { CobradasCheckboxList } from './CobradasCheckboxList'
import { cobradasListFrameClass } from '../utils/cobradasListStyles'

export type RegistrarPagoFormProps = Readonly<{
  onRegistroExitoso?: () => void
}>

/**
 * Formulario para `POST /pagos`: entidad, referencia, monto y radicados en estado cobrada.
 */
export function RegistrarPagoForm({ onRegistroExitoso }: RegistrarPagoFormProps) {
  const [entidadOrigen, setEntidadOrigen] = useState('')
  const [referencia, setReferencia] = useState('')
  const [monto, setMonto] = useState('')
  const [selectedRadicados, setSelectedRadicados] = useState<ReadonlySet<string>>(new Set())

  const [cobradas, setCobradas] = useState<IncapacidadListItem[]>([])
  const [loadingCobradas, setLoadingCobradas] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Readonly<Record<string, string>>>({})

  const loadCobradas = useCallback(async (signal: AbortSignal) => {
    setLoadingCobradas(true)
    try {
      const res = await listIncapacidades({ page: 1, estado: 'cobrada', signal })
      if (!signal.aborted) setCobradas([...res.items])
    } catch {
      if (!signal.aborted) setCobradas([])
    } finally {
      if (!signal.aborted) setLoadingCobradas(false)
    }
  }, [])

  useAbortableEffect(loadCobradas, [loadCobradas])

  const reloadCobradasAfterSubmit = useCallback(() => {
    listIncapacidades({ page: 1, estado: 'cobrada' })
      .then((res) => setCobradas([...res.items]))
      .catch(() => setCobradas([]))
  }, [])

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
      reloadCobradasAfterSubmit()
    } catch (err) {
      setError(messageFromHttpError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-gray-900">Registrar pago</h2>
        <p className="mt-0.5 text-sm text-gray-500">
          Vincula uno o más radicados en estado <strong>cobrada</strong>. El sistema los pasará a{' '}
          <strong>pagada</strong>.
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
          <legend className={labelClassName}>
            Incapacidades cubiertas (cobrada) <span className="text-danger">*</span>
          </legend>
          <div className={cobradasListFrameClass(Boolean(fieldErrors.radicados))}>
            <CobradasCheckboxList
              loading={loadingCobradas}
              cobradas={cobradas}
              selectedRadicados={selectedRadicados}
              submitting={submitting}
              onToggle={toggleRadicado}
            />
          </div>
          {fieldErrors.radicados ? (
            <p className="text-xs text-danger">{fieldErrors.radicados}</p>
          ) : null}
        </fieldset>

        <div className="flex justify-end border-t border-gray-100 pt-4">
          <button
            type="submit"
            disabled={submitting || loadingCobradas}
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
