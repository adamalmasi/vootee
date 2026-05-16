/**
 * @jest-environment node
 */
import { POST } from '@/app/api/polls/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/supabase/server', () => ({
  createServerClient: () => ({
    from: () => ({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 'poll-123', organizer_token: 'tok-abc' },
            error: null,
          }),
        }),
      }),
    }),
  }),
}))

function makeRequest(body: object) {
  return new NextRequest('http://localhost/api/polls', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/polls', () => {
  it('returns 400 when title is missing', async () => {
    const req = makeRequest({ slots: ['2025-06-08T18:00:00Z'] })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 when slots is empty', async () => {
    const req = makeRequest({ title: 'Vacsora', slots: [] })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns vote_link and admin_link on success', async () => {
    const req = makeRequest({
      title: 'Vacsora',
      slots: ['2025-06-08T18:00:00Z', '2025-06-10T19:00:00Z'],
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.vote_link).toContain('poll-123')
    expect(body.admin_link).toContain('tok-abc')
  })
})
