// @jest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import CalendarPicker from '@/components/CalendarPicker'

describe('CalendarPicker', () => {
  it('renders day-of-week headers', () => {
    render(<CalendarPicker selectedDays={[]} onDayToggle={jest.fn()} />)
    expect(screen.getByText('H')).toBeInTheDocument()
  })

  it('calls onDayToggle when a day is clicked', () => {
    const onToggle = jest.fn()
    render(<CalendarPicker selectedDays={[]} onDayToggle={onToggle} />)
    const days = screen.getAllByRole('button', { name: /^\d+$/ })
    fireEvent.click(days[0])
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('highlights selected days with bg-blue-500', () => {
    const today = new Date()
    const dayStr = today.toISOString().slice(0, 10)
    render(<CalendarPicker selectedDays={[dayStr]} onDayToggle={jest.fn()} />)
    const day = screen.getByRole('button', { name: String(today.getDate()) })
    expect(day.className).toContain('bg-blue-500')
  })
})
