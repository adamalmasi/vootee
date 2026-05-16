'use client'
import { formatSlotDate } from '@/lib/dates'

type Props = {
  day: string
  times: string[]
  onAddTime: (day: string, time: string) => void
  onRemoveTime: (day: string, time: string) => void
  onRemoveDay: (day: string) => void
}

export default function SlotEditor({ day, times, onAddTime, onRemoveTime, onRemoveDay }: Props) {
  function handleAdd() {
    const time = window.prompt('Időpont (pl. 18:00):')
    if (time && /^\d{2}:\d{2}$/.test(time)) {
      onAddTime(day, time)
    }
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
      <span className="text-sm font-semibold text-blue-800 min-w-[110px]">
        {formatSlotDate(`${day}T12:00:00Z`)}
      </span>
      <div className="flex gap-1 flex-wrap flex-1">
        {times.map(t => (
          <span key={t} className="flex items-center gap-1 bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
            {t}
            <button onClick={() => onRemoveTime(day, t)} className="text-blue-500 hover:text-red-500">✕</button>
          </span>
        ))}
        <button onClick={handleAdd} className="text-xs text-blue-500 font-semibold hover:underline">
          + időpont
        </button>
      </div>
      <button onClick={() => onRemoveDay(day)} className="text-gray-300 hover:text-red-400 text-sm">✕</button>
    </div>
  )
}
