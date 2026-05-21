import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { listIncapacidades } from '@/features/incapacidades/services/listIncapacidades.service'
import { createPago } from '../services/pagos.service'
import { buttonClassName, inputClassName, labelClassName } from '@/components/ui/buttonStyles'
import { Card } from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import type { IncapacidadListItem } from '@/features/incapacidades/types/listIncapacidades'

function mensajeError(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const d = e.response?.data
    if (d && typeof d === 'object' && 'detail' in d) {
      const detail = (d as { detail: unknown }).detail
      if (typeof detail === 'string') return detail
    }
    if (e.message) return e.message
  }
  if (e instanceof Error) return e.message
  return 'No se pudo registrar el pago.'
}

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

  useEffect(() => {
    const ac = new AbortController()
    setLoadingCobradas(true)
    void listIncapacidades({ page: 1, estado: 'cobrada', signal: ac.signal })
      .then((res) => {
        if (!ac.signal.aborted) setCobradas([...res.items])
      })
      .catch(() => {
        if (!ac.signal.aborted) setCobradas([])
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoadingCobradas(false)
      })
    return () => ac.abort()
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
    const fe: Record<string, string> = {}
    if (!entidadOrigen.trim()) fe.entidad_origen = 'Indica la entidad origen del pago.'
    if (!referencia.trim()) fe.referencia = 'Indica el número o código de referencia.'
    const montoTrim = monto.trim()
    if (!montoTrim) {
      fe.monto = 'Indica el monto.'
    } else {
      const n = Number.parseFloat(montoTrim.replace(',', '.'))
      if (!Number.isFinite(n) || n <= 0) fe.monto = 'El monto debe ser un número mayor que cero.'
    }
    if (selectedRadicados.size === 0) {
      fe.radicados = 'Selecciona al menos una incapacidad en estado cobrada.'
    }
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
      void listIncapacidades({ page: 1, estado: 'cobrada' }).then((res) =>
        setCobradas([...res.items]),
      )
    } catch (err) {
      setError(mensajeError(err))
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

      <form onSubmit={(ev) => void handleSubmit(ev)} className="flex flex-col gap-5 p-5 sm:p-6">
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

        <div className="flex flex-col gap-2">
          <span className={labelClassName}>
            Incapacidades cubiertas (cobrada) <span className="text-danger">*</span>
          </span>
          <div
            className={cn(
              'max-h-48 overflow-y-auto rounded-lg border bg-gray-50/80',
              fieldErrors.radicados ? 'border-danger/30' : 'border-gray-200',
            )}
            role="group"
            aria-label="Seleccionar radicados en estado cobrada"
          >
            {loadingCobradas ? (
              <div className="flex items-center gap-2 px-3 py-4 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
                Cargando trámites cobrados…
              </div>
            ) : cobradas.length === 0 ? (
              <p className="px-3 py-4 text-sm text-gray-500">
                No hay incapacidades en estado cobrada. Marca trámites como cobrada desde el flujo
                de estados antes de registrar el pago.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {cobradas.map((row) => (
                  <li key={row.id} className="flex items-start gap-3 px-3 py-2.5 hover:bg-white/80">
                    <input
                      type="checkbox"
                      id={`rad-${row.radicado}`}
                      checked={selectedRadicados.has(row.radicado)}
                      onChange={() => toggleRadicado(row.radicado)}
                      disabled={submitting}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30"
                    />
                    <label
                      htmlFor={`rad-${row.radicado}`}
                      className="min-w-0 flex-1 cursor-pointer"
                    >
                      <span className="font-mono text-xs text-gray-800">{row.radicado}</span>
                      {row.colaborador_email ? (
                        <span className="mt-0.5 block text-xs text-gray-500">
                          {row.colaborador_email}
                        </span>
                      ) : null}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {fieldErrors.radicados ? (
            <p className="text-xs text-danger">{fieldErrors.radicados}</p>
          ) : null}
        </div>

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
