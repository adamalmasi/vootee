import type { Slot } from '@/lib/supabase/types'

export function formatSlotDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('hu-HU', {
    month: 'short', day: 'numeric', weekday: 'short',
  })
}

export function formatSlotTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('hu-HU', {
    hour: '2-digit', minute: '2-digit',
  })
}

export function groupSlotsByDay(slots: Slot[]): Record<string, Slot[]> {
  return slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    const day = slot.starts_at.slice(0, 10)
    if (!acc[day]) acc[day] = []
    acc[day].push(slot)
    return acc
  }, {})
}
