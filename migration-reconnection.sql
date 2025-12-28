-- Migration: Add Reconnection Fields
-- Adds fields to track player disconnections and reconnection deadlines

ALTER TABLE game_rooms
ADD COLUMN IF NOT EXISTS disconnected_player TEXT,
ADD COLUMN IF NOT EXISTS disconnect_time TIMESTAMP,
ADD COLUMN IF NOT EXISTS reconnection_deadline TIMESTAMP;

COMMENT ON COLUMN game_rooms.disconnected_player IS 'Which player disconnected: host, guest, or null';
COMMENT ON COLUMN game_rooms.disconnect_time IS 'When the player disconnected';
COMMENT ON COLUMN game_rooms.reconnection_deadline IS 'Deadline for reconnection (60 seconds from disconnect)';
