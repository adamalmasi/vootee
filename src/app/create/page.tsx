'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CalendarPicker from '@/components/CalendarPicker'
import SlotEditor from '@/components/SlotEditor'

type SlotMap = Record<string, string[]>

export default function CreatePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [slotMap, setSlotMap] = useState<SlotMap>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [honeypot, setHoneypot] = useState('')

  function toggleDay(day: string) {
    if (selectedDays.includes(day)) {
      setSelectedDays(d => d.filter(x => x !== day))
      setSlotMap(m => { const n = { ...m }; delete n[day]; return n })
    } else {
      setSelectedDays(d => [...d, day].sort())
      setSlotMap(m => ({ ...m, [day]: [] }))
    }
  }

  function addTime(day: string, time: string) {
    setSlotMap(m => ({ ...m, [day]: [...(m[day] ?? []), time].sort() }))
  }

  function removeTime(day: string, time: string) {
    setSlotMap(m => ({ ...m, [day]: m[day].filter(t => t !== time) }))
  }

  function buildSlots(): string[] {
    return Object.entries(slotMap).flatMap(([day, times]) =>
      times.map(time => `${day}T${time}:00+00:00`)
    )
  }

  async function handleSubmit() {
    setError('')
    if (!title.trim()) { setError('Add meg az esemény nevét!'); return }
    const slots = buildSlots()
    if (slots.length === 0) { setError('Adj meg legalább egy időpontot!'); return }

    setLoading(true)
    const res = await fetch('/api/polls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slots, website: honeypot }),
    })
    setLoading(false)

    if (!res.ok) { setError('Hiba történt, próbáld újra.'); return }
    const data = await res.json()
    router.push(`/share?vote=${encodeURIComponent(data.vote_link)}&admin=${encodeURIComponent(data.admin_link)}`)
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Új időpont-szavazás</h1>
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-600 mb-1">Esemény neve</label>
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder="pl. Csapat vacsora júniusban"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-blue-400" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-600 mb-2">Válassz napokat a naptárból</label>
        <CalendarPicker selectedDays={selectedDays} onDayToggle={toggleDay} />
      </div>
      {selectedDays.length > 0 && (
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Kiválasztott időpontok</div>
          <div className="flex flex-col gap-2">
            {selectedDays.map(day => (
              <SlotEditor key={day} day={day} times={slotMap[day] ?? []}
                onAddTime={addTime} onRemoveTime={removeTime} onRemoveDay={toggleDay} />
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <input
        type="text"
        value={honeypot}
        onChange={e => setHoneypot(e.target.value)}
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        style={{ display: 'none' }}
      />
      <button onClick={handleSubmit} disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50">
        {loading ? 'Létrehozás...' : 'Link generálása →'}
      </button>
    </main>
  )
}
