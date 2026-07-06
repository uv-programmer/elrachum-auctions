-- ─────────────────────────────────────────────────────────────────────
-- Dynamic Slot Booking System — run AFTER the base supabase-schema.sql
-- Run in Supabase Dashboard → SQL Editor
-- ─────────────────────────────────────────────────────────────────────

-- Working hours per day of week (one row per day, 0=Sunday … 6=Saturday)
CREATE TABLE IF NOT EXISTS working_hours (
  id                    SERIAL PRIMARY KEY,
  day_of_week           INTEGER NOT NULL UNIQUE CHECK (day_of_week BETWEEN 0 AND 6),
  is_open               BOOLEAN NOT NULL DEFAULT false,
  open_time             TIME    NOT NULL DEFAULT '09:00:00',
  close_time            TIME    NOT NULL DEFAULT '17:00:00',
  slot_duration_minutes INTEGER NOT NULL DEFAULT 15,
  max_per_slot          INTEGER NOT NULL DEFAULT 4,
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Default schedule: Tuesday, Thursday, Saturday open
INSERT INTO working_hours (day_of_week, is_open, open_time, close_time, slot_duration_minutes, max_per_slot)
VALUES
  (0, false, '09:00', '17:00', 15, 4),   -- Sunday
  (1, false, '09:00', '17:00', 15, 4),   -- Monday
  (2, true,  '11:00', '17:00', 15, 4),   -- Tuesday
  (3, false, '09:00', '17:00', 15, 4),   -- Wednesday
  (4, true,  '11:00', '17:00', 15, 4),   -- Thursday
  (5, false, '09:00', '17:00', 15, 4),   -- Friday
  (6, true,  '10:00', '14:00', 15, 4)    -- Saturday
ON CONFLICT (day_of_week) DO NOTHING;

-- Break periods per day (lunch, mid-day break, etc.)
CREATE TABLE IF NOT EXISTS break_hours (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  break_start TIME    NOT NULL,
  break_end   TIME    NOT NULL,
  label       TEXT    NOT NULL DEFAULT 'Break',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Add structured date + time columns to bookings table
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS slot_date DATE,
  ADD COLUMN IF NOT EXISTS slot_time TIME;

-- ── Grants ─────────────────────────────────────────────────────────────

-- working_hours: public read (so /api/schedule works), admin write
GRANT SELECT ON working_hours TO anon;
GRANT SELECT ON working_hours TO authenticated;
GRANT ALL    ON working_hours TO service_role;
GRANT UPDATE ON working_hours TO authenticated;
GRANT USAGE  ON SEQUENCE working_hours_id_seq TO service_role;
GRANT USAGE  ON SEQUENCE working_hours_id_seq TO authenticated;

-- break_hours: public read, admin full control
GRANT SELECT ON break_hours TO anon;
GRANT SELECT ON break_hours TO authenticated;
GRANT ALL    ON break_hours TO service_role;
GRANT ALL    ON break_hours TO authenticated;
