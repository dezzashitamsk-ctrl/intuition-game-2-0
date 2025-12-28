-- ============================================
-- COMPLETE MIGRATION: Encrypted Deck System
-- ============================================
-- This migration does 3 things:
-- 1. Adds encrypted deck fields
-- 2. Adds card flip synchronization field
-- 3. Removes old plaintext deck field
-- ============================================

-- Step 1: Clean up old rooms (they won't work with new system)
DELETE FROM game_rooms;

-- Step 2: Add encrypted deck fields
ALTER TABLE game_rooms
ADD COLUMN IF NOT EXISTS encrypted_deck TEXT,
ADD COLUMN IF NOT EXISTS deck_seed TEXT;

-- Step 3: Add card flip synchronization
ALTER TABLE game_rooms
ADD COLUMN IF NOT EXISTS card_revealed BOOLEAN NOT NULL DEFAULT FALSE;

-- Step 4: Remove old plaintext deck (security risk!)
ALTER TABLE game_rooms
DROP COLUMN IF EXISTS deck;

-- Step 5: Add helpful comments
COMMENT ON COLUMN game_rooms.encrypted_deck IS 'Encrypted shuffled deck - prevents cheating by hiding next cards';
COMMENT ON COLUMN game_rooms.deck_seed IS 'Encryption seed for deck decryption';
COMMENT ON COLUMN game_rooms.card_revealed IS 'Whether current card is revealed (face up) - syncs flip animation for both players';

-- Done! Now create a new room and test.
