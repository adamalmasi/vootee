'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import VoteForm from '@/components/VoteForm'
import type { PollWithSlots } from '@/lib/supabase/types'

export default function PollPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [poll, setPoll] = useState<PollWithSlots | null>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/polls/${id}`)
      .then(r => r.json())
      .then(data => { setPoll(data); setLoading(false) })
  }, [id])

  async function handleVote(name: string, slotIds: string[]) {
    setVoting(true)
    const res = await fetch(`/api/polls/${id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voter_name: name, slot_ids: slotIds }),
    })
    setVoting(false)
    if (res.status === 409) { setError('Már szavaztál erre a szavazásra.'); return }
    if (!res.ok) { setError('Hiba történt, próbáld újra.'); return }
    setDone(true)
    setTimeout(() => router.push(`/results/${id}`), 1500)
  }

  if (loading) return <div className="p-10 text-center text-gray-400">Betöltés...</div>
  if (!poll) return <div className="p-10 text-center text-red-400">Szavazás nem található.</div>
  if (poll.closed_slot_id) return <div className="p-10 text-center text-gray-500">Ez a szavazás már lezárult.</div>

  return (
    <main className="max-w-sm mx-auto px-4 py-10">
      <h1 className="text-xl font-bold mb-2">{poll.title}</h1>
      <p className="text-gray-500 text-sm mb-6">Jelöld be mikor érsz rá</p>
      {done ? (
        <div className="text-center text-green-600 font-semibold py-10">✓ Szavazat rögzítve!</div>
      ) : (
        <>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <VoteForm slots={poll.slots} onSubmit={handleVote} loading={voting} />
        </>
      )}
    </main>
  )
}
