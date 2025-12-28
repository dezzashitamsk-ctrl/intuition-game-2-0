-- Migration: Add turn timer and presence tracking fields
-- Run this in Supabase SQL Editor

-- Add new columns to game_rooms table
ALTER TABLE game_rooms
ADD COLUMN IF NOT EXISTS turn_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS turn_timeout_seconds INTEGER NOT NULL DEFAULT 15,
ADD COLUMN IF NOT EXISTS player_last_seen JSONB DEFAULT '{"host": null, "guest": null}'::jsonb,
ADD COLUMN IF NOT EXISTS disconnected_player TEXT CHECK (disconnected_player IN ('host', 'guest'));

-- Update existing rows to have default values
UPDATE game_rooms
SET player_last_seen = '{"host": null, "guest": null}'::jsonb
WHERE player_last_seen IS NULL;
