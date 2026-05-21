import { useEffect } from 'react'

/** Ejecuta una tarea async cancelable al montar o cuando cambian las dependencias. */
export function useAbortableEffect(
  task: (signal: AbortSignal) => Promise<void>,
  deps: readonly unknown[],
): void {
  useEffect(() => {
    const ac = new AbortController()
    task(ac.signal).catch(() => undefined)
    return () => ac.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps provistas por el llamador
  }, deps)
}
