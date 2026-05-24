import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { awaitMinBusyDuration } from './awaitMinBusyDuration'

describe('awaitMinBusyDuration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('no espera si ya pasó el mínimo', async () => {
    const ac = new AbortController()
    const p = awaitMinBusyDuration(Date.now() - 3000, ac.signal, 2000)
    await vi.runAllTimersAsync()
    await expect(p).resolves.toBeUndefined()
  })

  it('espera el tiempo restante', async () => {
    const ac = new AbortController()
    const started = Date.now()
    const p = awaitMinBusyDuration(started, ac.signal, 2000)
    await vi.advanceTimersByTimeAsync(1999)
    let settled = false
    p.then(() => {
      settled = true
    })
    await vi.advanceTimersByTimeAsync(1)
    await p
    expect(settled).toBe(true)
  })

  it('cancela la espera si el signal aborta', async () => {
    const ac = new AbortController()
    const p = awaitMinBusyDuration(Date.now(), ac.signal, 2000)
    ac.abort()
    await vi.runAllTimersAsync()
    await expect(p).resolves.toBeUndefined()
  })
})
