-- Migration: Add animation synchronization fields
-- This enables server-controlled animation timing for perfect multiplayer sync

-- Add animation state tracking
ALTER TABLE game_rooms 
ADD COLUMN animation_state TEXT DEFAULT 'idle' 
CHECK (animation_state IN ('idle', 'revealing', 'showing', 'hiding'));

-- Add animation timestamp
ALTER TABLE game_rooms 
ADD COLUMN animation_started_at TIMESTAMP WITH TIME ZONE;

-- Add turn processing lock (prevents race conditions)
ALTER TABLE game_rooms
ADD COLUMN processing_lock TEXT; -- Player ID who is currently processing turn

-- Add lock expiration
ALTER TABLE game_rooms
ADD COLUMN lock_expires_at TIMESTAMP WITH TIME ZONE;

-- Add comment
COMMENT ON COLUMN game_rooms.animation_state IS 'Current animation state: idle (no animation), revealing (card flipping to face), showing (displaying result), hiding (card flipping to back)';
COMMENT ON COLUMN game_rooms.processing_lock IS 'Player ID who currently holds the turn processing lock';
COMMENT ON COLUMN game_rooms.lock_expires_at IS 'When the processing lock expires (30 seconds timeout)';
