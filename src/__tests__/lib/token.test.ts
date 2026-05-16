import { generateOrganizerToken, generateSessionToken } from '@/lib/token'

describe('generateOrganizerToken', () => {
  it('returns a non-empty string', () => {
    expect(generateOrganizerToken().length).toBeGreaterThan(10)
  })
  it('generates unique tokens', () => {
    expect(generateOrganizerToken()).not.toBe(generateOrganizerToken())
  })
})

describe('generateSessionToken', () => {
  it('returns a non-empty string', () => {
    expect(generateSessionToken().length).toBeGreaterThan(10)
  })
  it('generates unique tokens', () => {
    expect(generateSessionToken()).not.toBe(generateSessionToken())
  })
})
