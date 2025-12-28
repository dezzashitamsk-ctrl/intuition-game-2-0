-- Migration: Add current_card field
-- This stores the already-decrypted current card
-- Both players get the same card from DB (no client-side decryption issues)

ALTER TABLE game_rooms
ADD COLUMN IF NOT EXISTS current_card JSONB;

COMMENT ON COLUMN game_rooms.current_card IS 'Current card (already decrypted) - both players see this';
