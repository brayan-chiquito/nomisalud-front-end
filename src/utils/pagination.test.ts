import { describe, it, expect } from 'vitest'
import { pageSizeFromResponse, paginationRange } from './pagination'

describe('pagination', () => {
  it('pageSizeFromResponse calcula desde total y pages', () => {
    expect(pageSizeFromResponse(20, 2, 10)).toBe(10)
  })

  it('pageSizeFromResponse usa rowCount si pages es 0', () => {
    expect(pageSizeFromResponse(0, 0, 5)).toBe(5)
  })

  it('paginationRange con total 0', () => {
    expect(paginationRange(0, 1, 10)).toEqual({ start: 0, end: 0 })
  })

  it('paginationRange página 2', () => {
    expect(paginationRange(25, 2, 10)).toEqual({ start: 11, end: 20 })
  })
})
