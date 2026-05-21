import { describe, it, expect } from 'vitest'
import { displayNameFromEmail, initialsFromEmail } from './userDisplay'

describe('userDisplay', () => {
  it('displayNameFromEmail formatea local del correo', () => {
    expect(displayNameFromEmail('ana.maria@nomisalud.com')).toBe('Ana Maria')
  })

  it('displayNameFromEmail devuelve Usuario sin email', () => {
    expect(displayNameFromEmail(undefined)).toBe('Usuario')
  })

  it('initialsFromEmail usa correo o id', () => {
    expect(initialsFromEmail('ana@x.com', 'uuid')).toBe('AN')
    expect(initialsFromEmail(undefined, 'ab12')).toBe('AB')
    expect(initialsFromEmail(undefined, undefined)).toBe('NS')
  })
})
