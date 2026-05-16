// @jest-environment jsdom
import { render, screen } from '@testing-library/react'
import ResultsChart from '@/components/ResultsChart'
import type { Slot } from '@/lib/supabase/types'

const slots: Slot[] = [
  { id: 's1', poll_id: 'p1', starts_at: '2025-06-08T18:00:00Z', ends_at: null, vote_count: 5 },
  { id: 's2', poll_id: 'p1', starts_at: '2025-06-10T19:00:00Z', ends_at: null, vote_count: 2 },
]

describe('ResultsChart', () => {
  it('renders all slots', () => {
    render(<ResultsChart slots={slots} winnerId={null} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('highlights the winner slot', () => {
    render(<ResultsChart slots={slots} winnerId="s1" />)
    expect(screen.getByText('🏆 Nyertes')).toBeInTheDocument()
  })

  it('shows vote counts', () => {
    render(<ResultsChart slots={slots} winnerId={null} />)
    expect(screen.getByText('5 szavazat')).toBeInTheDocument()
    expect(screen.getByText('2 szavazat')).toBeInTheDocument()
  })
})
