-- Migration: Encrypted Deck System
-- Replace full deck with encrypted version for security

-- Add encrypted deck fields
ALTER TABLE game_rooms
ADD COLUMN IF NOT EXISTS encrypted_deck TEXT,
ADD COLUMN IF NOT EXISTS deck_seed TEXT;

-- Remove old plaintext deck (security risk)
ALTER TABLE game_rooms
DROP COLUMN IF EXISTS deck;

-- Add comments
COMMENT ON COLUMN game_rooms.encrypted_deck IS 'Encrypted shuffled deck - prevents cheating by hiding next cards';
COMMENT ON COLUMN game_rooms.deck_seed IS 'Encryption seed for deck decryption';
