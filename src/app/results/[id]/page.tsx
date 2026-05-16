'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import ResultsChart from '@/components/ResultsChart'
import type { PollWithSlots, Slot } from '@/lib/supabase/types'

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>()
  const [poll, setPoll] = useState<PollWithSlots | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])

  useEffect(() => {
    fetch(`/api/polls/${id}`)
      .then(r => r.json())
      .then((data: PollWithSlots) => { setPoll(data); setSlots(data.slots) })

    const channel = supabase
      .channel(`results-${id}`)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'slots', filter: `poll_id=eq.${id}` },
        payload => {
          setSlots(prev => prev.map(s => s.id === payload.new.id ? { ...s, vote_count: payload.new.vote_count } : s))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id])

  if (!poll) return <div className="p-10 text-center text-gray-400">Betöltés...</div>

  return (
    <main className="max-w-sm mx-auto px-4 py-10">
      <h1 className="text-xl font-bold mb-1">{poll.title}</h1>
      <p className="text-gray-400 text-xs mb-6">Eredmény — valós idejű frissítés</p>
      <ResultsChart slots={slots} winnerId={poll.closed_slot_id} />
    </main>
  )
}
