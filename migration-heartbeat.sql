-- Migration: Add Heartbeat Fields for Reconnection
-- Adds timestamp fields to track player heartbeats

ALTER TABLE game_rooms
ADD COLUMN IF NOT EXISTS host_last_heartbeat TIMESTAMP,
ADD COLUMN IF NOT EXISTS guest_last_heartbeat TIMESTAMP;

COMMENT ON COLUMN game_rooms.host_last_heartbeat IS 'Last heartbeat from host player';
COMMENT ON COLUMN game_rooms.guest_last_heartbeat IS 'Last heartbeat from guest player';
