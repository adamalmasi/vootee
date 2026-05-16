/**
 * @jest-environment node
 */
import { PATCH } from '@/app/api/polls/[id]/close/route'
import { NextRequest } from 'next/server'

const mockUpdate = jest.fn()
const mockEqUpdate = jest.fn().mockResolvedValue({ error: null })
mockUpdate.mockReturnValue({ eq: mockEqUpdate })

const mockPollSingle = jest.fn().mockResolvedValue({
  data: { id: 'poll-123', organizer_token: 'valid-token' },
  error: null,
})
const mockPollEqSelect = jest.fn().mockReturnValue({ single: mockPollSingle })
const mockPollSelect = jest.fn().mockReturnValue({ eq: mockPollEqSelect })

const mockSlotSingle = jest.fn().mockResolvedValue({
  data: { id: 's1' },
  error: null,
})
const mockSlotEqPollId = jest.fn().mockReturnValue({ single: mockSlotSingle })
const mockSlotEqId = jest.fn().mockReturnValue({ eq: mockSlotEqPollId })
const mockSlotSelect = jest.fn().mockReturnValue({ eq: mockSlotEqId })

jest.mock('@/lib/supabase/server', () => ({
  createServerClient: () => ({
    from: jest.fn((table: string) => {
      if (table === 'polls') {
        return { select: mockPollSelect, update: mockUpdate }
      }
      if (table === 'slots') {
        return { select: mockSlotSelect }
      }
      return {}
    }),
  }),
}))

const params = Promise.resolve({ id: 'poll-123' })

function makeRequest(body: object) {
  return new NextRequest('http://localhost/api/polls/poll-123/close', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('PATCH /api/polls/[id]/close', () => {
  it('returns 401 when organizer_token is wrong', async () => {
    const res = await PATCH(
      makeRequest({ organizer_token: 'wrong-token', slot_id: 's1' }),
      { params }
    )
    expect(res.status).toBe(401)
  })

  it('returns 200 when token matches', async () => {
    const res = await PATCH(
      makeRequest({ organizer_token: 'valid-token', slot_id: 's1' }),
      { params }
    )
    expect(res.status).toBe(200)
  })
})
