-- ============================================================
-- El Rachum Auctions LLC — Supabase Schema
-- Run this in Supabase > SQL Editor
-- ============================================================

-- Drop old tables if they exist (clean slate)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;

-- ── 1. Bookings table ────────────────────────────────────────
CREATE TABLE bookings (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT        NOT NULL,
  lots        TEXT        NOT NULL,
  slot        TEXT        NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert"
  ON bookings FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow admin select"
  ON bookings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admin delete"
  ON bookings FOR DELETE TO authenticated USING (true);

-- ── 2. Contact submissions table ─────────────────────────────
CREATE TABLE contact_submissions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  subject     TEXT        NOT NULL,
  message     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert"
  ON contact_submissions FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow admin select"
  ON contact_submissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admin delete"
  ON contact_submissions FOR DELETE TO authenticated USING (true);
