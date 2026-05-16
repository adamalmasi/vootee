import { formatSlotDate, groupSlotsByDay } from '@/lib/dates'
import type { Slot } from '@/lib/supabase/types'

const makeSlot = (id: string, starts_at: string): Slot => ({
  id, poll_id: 'p1', starts_at, ends_at: null, vote_count: 0
})

describe('formatSlotDate', () => {
  it('formats a timestamptz to readable Hungarian date', () => {
    const result = formatSlotDate('2025-06-08T18:00:00Z')
    expect(result).toMatch(/jún/)
    expect(result).toMatch(/8/)
  })
})

describe('groupSlotsByDay', () => {
  it('groups slots by calendar day', () => {
    const slots = [
      makeSlot('a', '2025-06-08T18:00:00Z'),
      makeSlot('b', '2025-06-08T20:00:00Z'),
      makeSlot('c', '2025-06-10T19:00:00Z'),
    ]
    const grouped = groupSlotsByDay(slots)
    expect(Object.keys(grouped)).toHaveLength(2)
    expect(grouped['2025-06-08']).toHaveLength(2)
    expect(grouped['2025-06-10']).toHaveLength(1)
  })
})
