-- Migration: Add card flip synchronization
-- Run this in Supabase SQL Editor

-- Add field to track if card is currently revealed (for both players to see flip)
ALTER TABLE game_rooms
ADD COLUMN IF NOT EXISTS card_revealed BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN game_rooms.card_revealed IS 'Whether the current card is revealed (face up) - syncs flip animation for both players';
