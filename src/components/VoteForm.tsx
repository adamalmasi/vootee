'use client'
import { useState } from 'react'
import type { Slot } from '@/lib/supabase/types'
import { formatSlotDate, formatSlotTime } from '@/lib/dates'

type Props = {
  slots: Slot[]
  onSubmit: (name: string, slotIds: string[]) => void
  loading: boolean
}

export default function VoteForm({ slots, onSubmit, loading }: Props) {
  const [name, setName] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [nameError, setNameError] = useState(false)

  function toggle(id: string) {
    setSelected(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  function handleSubmit() {
    if (!name.trim()) { setNameError(true); return }
    setNameError(false)
    onSubmit(name.trim(), Array.from(selected))
  }

  return (
    <div className="space-y-4">
      <div>
        <input value={name} onChange={e => { setName(e.target.value); setNameError(false) }}
          placeholder="A neved"
          className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-blue-400 ${nameError ? 'border-red-400' : ''}`} />
        {nameError && <p className="text-red-500 text-xs mt-1">Add meg a neved!</p>}
      </div>
      <div className="space-y-2">
        {slots.map(slot => (
          <label key={slot.id}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              selected.has(slot.id) ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200 hover:border-blue-200'
            }`}>
            <input type="checkbox" checked={selected.has(slot.id)} onChange={() => toggle(slot.id)}
              className="w-5 h-5 rounded accent-green-500" />
            <div>
              <div className="font-semibold text-sm">{formatSlotDate(slot.starts_at)}</div>
              <div className="text-gray-500 text-xs">{formatSlotTime(slot.starts_at)}</div>
            </div>
            <div className="ml-auto text-xs text-gray-400">{slot.vote_count} szavazat</div>
          </label>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={loading}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-sm transition disabled:opacity-50">
        {loading ? 'Küldés...' : 'Szavazok'}
      </button>
    </div>
  )
}
