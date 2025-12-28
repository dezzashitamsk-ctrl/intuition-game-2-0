-- Migration: Add player choice tracking
-- Run this in Supabase SQL Editor

-- Add fields to track current prediction choice for each player
ALTER TABLE game_rooms
ADD COLUMN IF NOT EXISTS host_current_choice JSONB,
ADD COLUMN IF NOT EXISTS guest_current_choice JSONB;

COMMENT ON COLUMN game_rooms.host_current_choice IS 'Current prediction choice of host player (shown to opponent)';
COMMENT ON COLUMN game_rooms.guest_current_choice IS 'Current prediction choice of guest player (shown to opponent)';
