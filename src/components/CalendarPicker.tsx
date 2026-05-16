'use client'
import { useState } from 'react'

type Props = {
  selectedDays: string[]
  onDayToggle: (day: string) => void
}

const DAYS = ['H', 'K', 'Sz', 'Cs', 'P', 'Sz', 'V']
const MONTHS = ['január','február','március','április','május','június',
                'július','augusztus','szeptember','október','november','december']

export default function CalendarPicker({ selectedDays, onDayToggle }: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  function prev() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  function next() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  function dayKey(d: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="border rounded-xl p-4 select-none">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="px-2 py-1 rounded hover:bg-gray-100 text-gray-500">‹</button>
        <span className="font-semibold text-sm">{year} {MONTHS[month]}</span>
        <button onClick={next} className="px-2 py-1 rounded hover:bg-gray-100 text-gray-500">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((d, i) => (
          <div key={`${d}-${i}`} className="text-center text-xs font-bold text-gray-400">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />
          const key = dayKey(d)
          const isSelected = selectedDays.includes(key)
          const isToday = today.getFullYear() === year &&
                          today.getMonth() === month &&
                          today.getDate() === d
          return (
            <button
              key={key}
              aria-label={String(d)}
              onClick={() => onDayToggle(key)}
              className={[
                'rounded-lg text-sm py-1.5 font-medium transition-colors',
                isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-700',
                isToday && !isSelected ? 'border-2 border-blue-400 text-blue-600' : '',
              ].join(' ')}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}
