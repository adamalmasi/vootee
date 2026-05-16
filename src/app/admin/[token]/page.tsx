'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ResultsChart from '@/components/ResultsChart'
import type { PollWithSlots, Slot } from '@/lib/supabase/types'
import { formatSlotDate, formatSlotTime } from '@/lib/dates'

export default function AdminPage() {
  const { token } = useParams<{ token: string }>()
  const [poll, setPoll] = useState<PollWithSlots | null>(null)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    fetch(`/api/polls/by-token/${token}`)
      .then(r => r.json())
      .then(setPoll)
  }, [token])

  async function closeWith(slot: Slot) {
    if (!poll) return
    setClosing(true)
    await fetch(`/api/polls/${poll.id}/close`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizer_token: token, slot_id: slot.id }),
    })
    setClosing(false)
    setPoll(p => p ? { ...p, closed_slot_id: slot.id } : p)
  }

  if (!poll) return <div className="p-10 text-center text-gray-400">Betöltés...</div>

  return (
    <main className="max-w-sm mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">{poll.title}</h1>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${poll.closed_slot_id ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'}`}>
          {poll.closed_slot_id ? 'Lezárt' : 'Nyitott'}
        </span>
      </div>
      <ResultsChart slots={poll.slots} winnerId={poll.closed_slot_id} />
      {!poll.closed_slot_id && (
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-3">Zárj le egy időpontot nyertesként:</p>
          <div className="space-y-2">
            {[...poll.slots].sort((a, b) => b.vote_count - a.vote_count).map(slot => (
              <button key={slot.id} onClick={() => closeWith(slot)} disabled={closing}
                className="w-full text-left text-sm border border-gray-200 rounded-lg px-3 py-2 hover:border-purple-300 hover:bg-purple-50 transition disabled:opacity-50">
                Lezárás: {formatSlotDate(slot.starts_at)} {formatSlotTime(slot.starts_at)} ({slot.vote_count} szavazat)
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
