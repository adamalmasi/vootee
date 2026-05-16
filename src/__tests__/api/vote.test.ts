/**
 * @jest-environment node
 */
import { POST } from '@/app/api/polls/[id]/vote/route'
import { NextRequest } from 'next/server'

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn().mockReturnValue(null),
    set: jest.fn(),
  })),
}))

const mockInsert = jest.fn().mockResolvedValue({ error: null })
const mockLimit = jest.fn().mockResolvedValue({ data: [] })
const mockSelectEqEq = jest.fn(() => ({ limit: mockLimit }))
const mockSelectEq = jest.fn(() => ({ eq: mockSelectEqEq }))
const mockSelect = jest.fn(() => ({ eq: mockSelectEq }))

jest.mock('@/lib/supabase/server', () => ({
  createServerClient: () => ({
    from: (table: string) => {
      if (table === 'votes') {
        return { insert: mockInsert, select: mockSelect }
      }
      return { insert: mockInsert, select: mockSelect }
    },
  }),
}))

const params = Promise.resolve({ id: 'poll-123' })

function makeRequest(body: object) {
  return new NextRequest('http://localhost/api/polls/poll-123/vote', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/polls/[id]/vote', () => {
  beforeEach(() => {
    mockLimit.mockResolvedValue({ data: [] })
    mockInsert.mockResolvedValue({ error: null })
  })

  it('returns 400 when voter_name is missing', async () => {
    const res = await POST(makeRequest({ slot_ids: ['s1'] }), { params })
    expect(res.status).toBe(400)
  })

  it('returns 400 when slot_ids is empty', async () => {
    const res = await POST(makeRequest({ voter_name: 'Anna', slot_ids: [] }), { params })
    expect(res.status).toBe(400)
  })

  it('returns 201 on valid vote', async () => {
    const res = await POST(
      makeRequest({ voter_name: 'Anna', slot_ids: ['s1', 's2'] }),
      { params }
    )
    expect(res.status).toBe(201)
  })

  it('returns 409 when session has already voted on this poll', async () => {
    mockLimit.mockResolvedValue({ data: [{ id: 'existing-vote-id' }] })
    const res = await POST(
      makeRequest({ voter_name: 'Anna', slot_ids: ['s1'] }),
      { params }
    )
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toBe('Already voted')
  })
})
