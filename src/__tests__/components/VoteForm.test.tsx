// @jest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import VoteForm from '@/components/VoteForm'
import type { Slot } from '@/lib/supabase/types'

const slots: Slot[] = [
  { id: 's1', poll_id: 'p1', starts_at: '2025-06-08T18:00:00Z', ends_at: null, vote_count: 3 },
  { id: 's2', poll_id: 'p1', starts_at: '2025-06-10T19:00:00Z', ends_at: null, vote_count: 1 },
]

describe('VoteForm', () => {
  it('renders all slots as checkboxes', () => {
    render(<VoteForm slots={slots} onSubmit={jest.fn()} loading={false} />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(2)
  })

  it('calls onSubmit with name and selected slot ids', () => {
    const onSubmit = jest.fn()
    render(<VoteForm slots={slots} onSubmit={onSubmit} loading={false} />)
    fireEvent.change(screen.getByPlaceholderText(/neved/i), { target: { value: 'Anna' } })
    fireEvent.click(screen.getAllByRole('checkbox')[0])
    fireEvent.click(screen.getByRole('button', { name: /szavazok/i }))
    expect(onSubmit).toHaveBeenCalledWith('Anna', ['s1'])
  })

  it('does not call onSubmit when name is empty', () => {
    const onSubmit = jest.fn()
    render(<VoteForm slots={slots} onSubmit={onSubmit} loading={false} />)
    fireEvent.click(screen.getByRole('button', { name: /szavazok/i }))
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
