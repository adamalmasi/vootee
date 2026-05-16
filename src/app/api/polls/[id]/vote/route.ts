import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'
import { generateSessionToken } from '@/lib/token'

const SESSION_COOKIE = 'timepick_session'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const { voter_name, slot_ids } = body as {
    voter_name?: string
    slot_ids?: string[]
  }

  if (!voter_name?.trim()) {
    return NextResponse.json({ error: 'voter_name required' }, { status: 400 })
  }
  if (!slot_ids || slot_ids.length === 0) {
    return NextResponse.json({ error: 'slot_ids required' }, { status: 400 })
  }

  const cookieStore = await cookies()
  let session_token = cookieStore.get(SESSION_COOKIE)?.value

  const isNewSession = !session_token
  if (isNewSession) {
    session_token = generateSessionToken()
  }

  const supabase = createServerClient()

  const voteRows = slot_ids.map((slot_id) => ({
    poll_id: id,
    slot_id,
    voter_name: voter_name.trim(),
    session_token: session_token!,
  }))

  const { error } = await supabase.from('votes').insert(voteRows)

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'already voted' }, { status: 409 })
    }
    return NextResponse.json({ error: 'db error' }, { status: 500 })
  }

  const res = NextResponse.json({ ok: true }, { status: 201 })

  if (isNewSession) {
    res.cookies.set(SESSION_COOKIE, session_token!, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  return res
}
