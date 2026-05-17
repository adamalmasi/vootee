import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('polls')
    .select('id, title, closed_slot_id, created_at, slots(id, poll_id, starts_at, ends_at, vote_count)')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'not found', detail: error?.message ?? null }, { status: 404 })
  }

  return NextResponse.json(data)
}
