export type Poll = {
  id: string
  title: string
  organizer_token: string
  user_id: string | null
  closed_slot_id: string | null
  created_at: string
}

export type Slot = {
  id: string
  poll_id: string
  starts_at: string
  ends_at: string | null
  vote_count: number
}

export type Vote = {
  id: string
  poll_id: string
  slot_id: string
  voter_name: string
  session_token: string
  created_at: string
}

export type PollWithSlots = Poll & { slots: Slot[] }
