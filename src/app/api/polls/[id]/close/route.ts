import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const { organizer_token, slot_id } = body as {
    organizer_token?: string
    slot_id?: string
  }

  if (!organizer_token || !slot_id) {
    return NextResponse.json({ error: 'organizer_token and slot_id required' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data: poll } = await supabase
    .from('polls')
    .select('id, organizer_token')
    .eq('id', id)
    .single()

  if (!poll || poll.organizer_token !== organizer_token) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('polls')
    .update({ closed_slot_id: slot_id })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'db error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
