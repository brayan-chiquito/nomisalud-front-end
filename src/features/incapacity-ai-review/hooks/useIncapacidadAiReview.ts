import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { IncapacidadDetalle } from '../types/incapacidadDetalle'
import {
  getIncapacidadDetalle,
  fetchIncapacidadArchivoBlob,
  patchIncapacidadEstado,
  registrarDocumentacionFaltante,
  verificarIncapacidad,
} from '../services/incapacidadReview.service'
import {
  datosExtraidosToForm,
  emptyReviewForm,
  mergeFormIntoDatosExtraidos,
  type ReviewFormFields,
} from '../utils/reviewFormState'
import { messageFromHttpError } from '../utils/httpErrorMessage'
import {
  inconsistenciasFromDetalle,
  overridePermiteContinuar,
  requiereOverrideAntesDeContinuar,
  type InconsistenciaItem,
} from '../utils/inconsistencias'

function archivoEsVisualizable(tipo: string | undefined): boolean {
  const t = tipo?.trim().toLowerCase() ?? ''
  return t === 'pdf' || t === 'jpg' || t === 'jpeg' || t === 'png'
}

export type UseIncapacidadAiReviewResult = Readonly<{
  detail: IncapacidadDetalle | null
  loadingDetail: boolean
  errorDetail: string | null
  archivoObjectUrl: string | null
  loadingArchivo: boolean
  archivoError: string | null
  form: ReviewFormFields
  setFormField: <K extends keyof ReviewFormFields>(key: K, value: ReviewFormFields[K]) => void
  confirmar: () => Promise<boolean>
  rechazar: (motivo: string) => Promise<boolean>
  solicitarDocumentacion: (documentos: readonly string[], observacion?: string) => Promise<boolean>
  inconsistencias: readonly InconsistenciaItem[]
  overrideJustificacion: string
  setOverrideJustificacion: (value: string) => void
  overrideRegistrado: boolean
  registrarOverride: () => Promise<boolean>
  submittingOverride: boolean
  overrideError: string | null
  clearOverrideError: () => void
  submitting: boolean
  submitError: string | null
  clearSubmitError: () => void
  /** Actualiza `estado` en detalle tras PATCH manual (p. ej. marcar cobrada). */
  patchDetailEstado: (estado: string) => void
}>

export function useIncapacidadAiReview(incapacidadId: string | null): UseIncapacidadAiReviewResult {
  const [detail, setDetail] = useState<IncapacidadDetalle | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const [archivoObjectUrl, setArchivoObjectUrl] = useState<string | null>(null)
  const [loadingArchivo, setLoadingArchivo] = useState(false)
  const [archivoError, setArchivoError] = useState<string | null>(null)
  const [form, setForm] = useState<ReviewFormFields>(() => emptyReviewForm())
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [overrideJustificacion, setOverrideJustificacion] = useState('')
  const [overrideLocalOk, setOverrideLocalOk] = useState(false)
  const [submittingOverride, setSubmittingOverride] = useState(false)
  const [overrideError, setOverrideError] = useState<string | null>(null)

  const blobUrlRef = useRef<string | null>(null)

  const revokeBlob = useCallback(() => {
    const u = blobUrlRef.current
    if (u) {
      URL.revokeObjectURL(u)
      blobUrlRef.current = null
    }
    setArchivoObjectUrl(null)
  }, [])

  const setFormField = useCallback(
    <K extends keyof ReviewFormFields>(key: K, value: ReviewFormFields[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  useEffect(() => {
    if (!incapacidadId) {
      setDetail(null)
      setErrorDetail(null)
      setForm(emptyReviewForm())
      revokeBlob()
      return
    }

    const ac = new AbortController()
    setLoadingDetail(true)
    setErrorDetail(null)
    setDetail(null)
    setForm(emptyReviewForm())
    setOverrideJustificacion('')
    setOverrideLocalOk(false)
    setOverrideError(null)
    revokeBlob()
    setArchivoError(null)

    void getIncapacidadDetalle(incapacidadId, ac.signal)
      .then((d) => {
        if (ac.signal.aborted) return
        setDetail(d)
        const raw = d.extraccion_ia?.datos_extraidos
        setForm(datosExtraidosToForm(raw ?? undefined))
        setOverrideJustificacion('')
        setOverrideLocalOk(overridePermiteContinuar(d.estado, false))
      })
      .catch((e) => {
        if (ac.signal.aborted) return
        setDetail(null)
        setForm(emptyReviewForm())
        setErrorDetail(messageFromHttpError(e))
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoadingDetail(false)
      })

    return () => ac.abort()
  }, [incapacidadId, revokeBlob])

  useEffect(() => {
    if (!incapacidadId || !detail || !archivoEsVisualizable(detail.archivo_tipo)) {
      setLoadingArchivo(false)
      return
    }

    const ac = new AbortController()
    setLoadingArchivo(true)
    setArchivoError(null)

    void fetchIncapacidadArchivoBlob(incapacidadId, ac.signal)
      .then((blob) => {
        if (ac.signal.aborted) return
        revokeBlob()
        const url = URL.createObjectURL(blob)
        blobUrlRef.current = url
        setArchivoObjectUrl(url)
      })
      .catch((e) => {
        if (ac.signal.aborted) return
        setArchivoError(messageFromHttpError(e))
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoadingArchivo(false)
      })

    return () => ac.abort()
  }, [incapacidadId, detail, revokeBlob])

  useEffect(
    () => () => {
      const u = blobUrlRef.current
      if (u) URL.revokeObjectURL(u)
      blobUrlRef.current = null
    },
    [],
  )

  const clearSubmitError = useCallback(() => setSubmitError(null), [])
  const clearOverrideError = useCallback(() => setOverrideError(null), [])

  const inconsistencias = useMemo(
    () => inconsistenciasFromDetalle(detail?.inconsistencias, detail?.extraccion_ia?.validaciones),
    [detail?.inconsistencias, detail?.extraccion_ia?.validaciones],
  )

  const overrideRegistrado = useMemo(
    () => overridePermiteContinuar(detail?.estado ?? '', overrideLocalOk),
    [detail?.estado, overrideLocalOk],
  )

  const registrarOverride = useCallback(async (): Promise<boolean> => {
    if (!incapacidadId) return false
    const trimmed = overrideJustificacion.trim()
    if (trimmed.length < 10) {
      setOverrideError('La justificación debe tener al menos 10 caracteres.')
      return false
    }
    if (detail?.estado !== 'inconsistencia_detectada') {
      setOverrideError(
        'Solo se puede registrar excepción cuando el trámite está en Inconsistencia detectada.',
      )
      return false
    }
    setSubmittingOverride(true)
    setOverrideError(null)
    try {
      const patched = await patchIncapacidadEstado(incapacidadId, {
        estado: 'en_verificacion',
        observacion: trimmed,
      })
      setOverrideLocalOk(true)
      setDetail((prev) => (prev ? { ...prev, estado: patched.estado } : prev))
      return true
    } catch (e) {
      setOverrideError(messageFromHttpError(e))
      return false
    } finally {
      setSubmittingOverride(false)
    }
  }, [incapacidadId, overrideJustificacion, detail?.estado])

  const confirmar = useCallback(async (): Promise<boolean> => {
    if (!incapacidadId || !detail?.extraccion_ia) {
      setSubmitError('No hay datos de extracción para confirmar.')
      return false
    }
    if (requiereOverrideAntesDeContinuar(detail.estado, inconsistencias) && !overrideRegistrado) {
      setSubmitError('Registra la excepción con una justificación antes de confirmar los datos.')
      return false
    }
    const datos = mergeFormIntoDatosExtraidos(detail.extraccion_ia.datos_extraidos ?? null, form)
    setSubmitting(true)
    setSubmitError(null)
    try {
      const verificado = await verificarIncapacidad(incapacidadId, {
        accion: 'confirmar',
        datos_extraidos: datos,
      })
      // PUT verificar con `confirmar` deja el trámite en `en_verificacion` (docs API).
      // Para avanzar el flujo visible (listado/KPIs), se requiere PATCH a `transcrita`.
      if (verificado.estado !== 'transcrita') {
        await patchIncapacidadEstado(incapacidadId, {
          estado: 'transcrita',
          observacion: 'Datos confirmados en revisión IA',
        })
      }
      return true
    } catch (e) {
      setSubmitError(messageFromHttpError(e))
      return false
    } finally {
      setSubmitting(false)
    }
  }, [incapacidadId, detail, form, inconsistencias, overrideRegistrado])

  const rechazar = useCallback(
    async (motivo: string): Promise<boolean> => {
      if (!incapacidadId) return false
      if (!detail?.extraccion_ia) {
        setSubmitError('No hay extracción IA asociada a este trámite.')
        return false
      }
      const trimmed = motivo.trim()
      if (!trimmed) {
        setSubmitError('El motivo de rechazo es obligatorio.')
        return false
      }
      setSubmitting(true)
      setSubmitError(null)
      try {
        await verificarIncapacidad(incapacidadId, {
          accion: 'rechazar',
          motivo_rechazo: trimmed,
        })
        return true
      } catch (e) {
        setSubmitError(messageFromHttpError(e))
        return false
      } finally {
        setSubmitting(false)
      }
    },
    [incapacidadId, detail?.extraccion_ia],
  )

  const solicitarDocumentacion = useCallback(
    async (documentos: readonly string[], observacion?: string): Promise<boolean> => {
      if (!incapacidadId) return false
      const normalized = documentos.map((d) => d.trim()).filter(Boolean)
      if (normalized.length === 0) {
        setSubmitError('Indica al menos un documento faltante.')
        return false
      }
      setSubmitting(true)
      setSubmitError(null)
      try {
        await registrarDocumentacionFaltante(incapacidadId, {
          documentos: normalized,
          observacion: observacion?.trim() || undefined,
        })
        return true
      } catch (e) {
        setSubmitError(messageFromHttpError(e))
        return false
      } finally {
        setSubmitting(false)
      }
    },
    [incapacidadId],
  )

  const patchDetailEstado = useCallback((estado: string) => {
    setDetail((prev) => (prev ? { ...prev, estado } : prev))
  }, [])

  return {
    detail,
    loadingDetail,
    errorDetail,
    archivoObjectUrl,
    loadingArchivo,
    archivoError,
    form,
    setFormField,
    confirmar,
    rechazar,
    solicitarDocumentacion,
    inconsistencias,
    overrideJustificacion,
    setOverrideJustificacion,
    overrideRegistrado,
    registrarOverride,
    submittingOverride,
    overrideError,
    clearOverrideError,
    submitting,
    submitError,
    clearSubmitError,
    patchDetailEstado,
  }
}
