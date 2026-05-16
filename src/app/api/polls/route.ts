import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateOrganizerToken } from '@/lib/token'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, slots } = body as { title?: string; slots?: string[] }

  if (!title?.trim()) {
    return NextResponse.json({ error: 'title required' }, { status: 400 })
  }
  if (!slots || slots.length === 0) {
    return NextResponse.json({ error: 'slots required' }, { status: 400 })
  }

  const supabase = createServerClient()
  const organizer_token = generateOrganizerToken()

  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({ title: title.trim(), organizer_token })
    .select('id, organizer_token')
    .single()

  if (pollError || !poll) {
    return NextResponse.json({ error: 'db error' }, { status: 500 })
  }

  const slotRows = slots.map((starts_at: string) => ({
    poll_id: poll.id,
    starts_at,
  }))

  const { error: slotError } = await supabase.from('slots').insert(slotRows)

  if (slotError) {
    return NextResponse.json({ error: 'slot insert error' }, { status: 500 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return NextResponse.json({
    poll_id: poll.id,
    vote_link: `${appUrl}/poll/${poll.id}`,
    admin_link: `${appUrl}/admin/${poll.organizer_token}`,
  }, { status: 201 })
}
