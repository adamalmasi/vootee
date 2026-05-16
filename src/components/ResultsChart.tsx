import type { Slot } from '@/lib/supabase/types'
import { formatSlotDate, formatSlotTime } from '@/lib/dates'

type Props = { slots: Slot[]; winnerId: string | null }

export default function ResultsChart({ slots, winnerId }: Props) {
  const maxVotes = Math.max(...slots.map(s => s.vote_count), 1)
  const sorted = [...slots].sort((a, b) => b.vote_count - a.vote_count)

  return (
    <ol className="space-y-3" role="list">
      {sorted.map(slot => {
        const pct = Math.round((slot.vote_count / maxVotes) * 100)
        const isWinner = slot.id === winnerId
        return (
          <li key={slot.id}
            className={`rounded-xl border p-3 ${isWinner ? 'bg-purple-50 border-purple-300' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-1.5">
              <div>
                {isWinner && <span className="text-xs font-bold text-purple-600 mr-2">🏆 Nyertes</span>}
                <span className="font-semibold text-sm">{formatSlotDate(slot.starts_at)}</span>
                <span className="text-gray-400 text-xs ml-2">{formatSlotTime(slot.starts_at)}</span>
              </div>
              <span className="text-sm font-bold text-gray-700">{slot.vote_count} szavazat</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${isWinner ? 'bg-purple-400' : 'bg-blue-300'}`}
                style={{ width: `${pct}%` }} />
            </div>
          </li>
        )
      })}
    </ol>
  )
}
