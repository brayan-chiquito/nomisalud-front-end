/** Tiempo mínimo visible del indicador «Actualizando…» en listados filtrados. */
export const MIN_LIST_FETCH_VISIBLE_MS = 1000

/**
 * Espera el tiempo restante para cumplir `minMs` desde `startedAt`.
 * Si `signal` se aborta, termina de inmediato.
 */
export async function awaitMinBusyDuration(
  startedAt: number,
  signal: AbortSignal,
  minMs = MIN_LIST_FETCH_VISIBLE_MS,
): Promise<void> {
  const remain = minMs - (Date.now() - startedAt)
  if (remain <= 0) return

  await new Promise<void>((resolve) => {
    const done = () => {
      clearTimeout(timer)
      signal.removeEventListener('abort', onAbort)
      resolve()
    }
    const onAbort = () => done()
    const timer = globalThis.setTimeout(done, remain)
    signal.addEventListener('abort', onAbort, { once: true })
  })
}
