-- ============================================================
-- Migration 005: Add phone and notification_preferences to profiles
-- ============================================================
-- The AdminSettings page references phone and notification_preferences
-- columns on the profiles table, but they were never added.

-- Add phone column (text, nullable)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add notification_preferences column (jsonb, nullable, default empty object)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{}'::jsonb;
