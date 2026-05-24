import { useState } from 'react'

/** Conserva el número de filas visible mientras `fetching` para no encoger la tabla de golpe. */
export function useStableTableRowCount(itemCount: number, fetching: boolean): number {
  const [stableCount, setStableCount] = useState(itemCount)

  if (!fetching) {
    if (stableCount !== itemCount) {
      setStableCount(itemCount)
    }
    return itemCount
  }

  return Math.max(stableCount, itemCount)
}
