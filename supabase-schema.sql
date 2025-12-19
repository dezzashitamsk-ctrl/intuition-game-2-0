-- Create game_rooms table
CREATE TABLE IF NOT EXISTS game_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
    host_id TEXT NOT NULL,
    guest_id TEXT,
    current_turn TEXT CHECK (current_turn IN ('host', 'guest')),
    deck JSONB NOT NULL,
    current_card_index INTEGER NOT NULL DEFAULT 0,
    host_score INTEGER NOT NULL DEFAULT 0,
    guest_score INTEGER NOT NULL DEFAULT 0,
    host_streak INTEGER NOT NULL DEFAULT 0,
    guest_streak INTEGER NOT NULL DEFAULT 0,
    last_prediction JSONB,
    last_result JSONB,
    winner TEXT CHECK (winner IN ('host', 'guest', 'draw'))
);

-- Create game_moves table
CREATE TABLE IF NOT EXISTS game_moves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    room_id UUID NOT NULL REFERENCES game_rooms(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL,
    player_role TEXT NOT NULL CHECK (player_role IN ('host', 'guest')),
    move_number INTEGER NOT NULL,
    card_index INTEGER NOT NULL,
    prediction JSONB NOT NULL,
    actual_card JSONB NOT NULL,
    result JSONB NOT NULL,
    points_earned INTEGER NOT NULL DEFAULT 0,
    streak_after INTEGER NOT NULL DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_rooms_status ON game_rooms(status);
CREATE INDEX IF NOT EXISTS idx_game_rooms_host ON game_rooms(host_id);
CREATE INDEX IF NOT EXISTS idx_game_rooms_guest ON game_rooms(guest_id);
CREATE INDEX IF NOT EXISTS idx_game_moves_room ON game_moves(room_id);

-- Enable Row Level Security
ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_moves ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to game rooms" ON game_rooms;
DROP POLICY IF EXISTS "Allow public insert to game rooms" ON game_rooms;
DROP POLICY IF EXISTS "Allow public update to game rooms" ON game_rooms;
DROP POLICY IF EXISTS "Allow public read access to game moves" ON game_moves;
DROP POLICY IF EXISTS "Allow public insert to game moves" ON game_moves;

-- RLS Policies for game_rooms (allow all operations for now - can be restricted later)
CREATE POLICY "Allow public read access to game rooms"
    ON game_rooms FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert to game rooms"
    ON game_rooms FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update to game rooms"
    ON game_rooms FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- RLS Policies for game_moves
CREATE POLICY "Allow public read access to game moves"
    ON game_moves FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert to game moves"
    ON game_moves FOR INSERT
    WITH CHECK (true);

-- Enable Realtime for game_rooms table
ALTER PUBLICATION supabase_realtime ADD TABLE game_rooms;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_game_rooms_updated_at ON game_rooms;
CREATE TRIGGER update_game_rooms_updated_at
    BEFORE UPDATE ON game_rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
