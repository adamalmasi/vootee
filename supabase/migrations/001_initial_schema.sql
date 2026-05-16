CREATE TABLE polls (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  organizer_token text NOT NULL UNIQUE,
  user_id         uuid,
  closed_slot_id  uuid,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE slots (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id     uuid NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  starts_at   timestamptz NOT NULL,
  ends_at     timestamptz,
  vote_count  int NOT NULL DEFAULT 0
);

ALTER TABLE polls ADD CONSTRAINT polls_closed_slot_fk
  FOREIGN KEY (closed_slot_id) REFERENCES slots(id);

CREATE TABLE votes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id       uuid NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  slot_id       uuid NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
  voter_name    text NOT NULL,
  session_token text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX votes_no_double
  ON votes(session_token, slot_id);

CREATE FUNCTION increment_vote_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE slots SET vote_count = vote_count + 1 WHERE id = NEW.slot_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER after_vote_insert
  AFTER INSERT ON votes
  FOR EACH ROW EXECUTE FUNCTION increment_vote_count();

ALTER TABLE slots REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE slots;
