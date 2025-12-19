-- Enable Realtime for game_rooms table
-- This is CRITICAL for multiplayer to work!

-- First, check if table is in publication
SELECT * FROM pg_publication_tables WHERE tablename = 'game_rooms';

-- If not in publication, add it:
ALTER PUBLICATION supabase_realtime ADD TABLE game_rooms;

-- Verify it was added:
SELECT * FROM pg_publication_tables WHERE tablename = 'game_rooms';

-- Also make sure Realtime is enabled in Supabase Dashboard:
-- 1. Go to Database > Replication
-- 2. Find 'game_rooms' table
-- 3. Enable 'Realtime' toggle
