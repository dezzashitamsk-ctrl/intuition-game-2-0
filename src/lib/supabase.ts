import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
});

// Types for database tables
export interface GameRoom {
    id: string;
    created_at: string;
    updated_at: string;
    status: 'waiting' | 'playing' | 'finished';
    host_id: string;
    guest_id: string | null;
    current_turn: 'host' | 'guest' | null;
    deck: any[];
    current_card_index: number;
    host_score: number;
    guest_score: number;
    host_streak: number;
    guest_streak: number;
    last_prediction: any | null;
    last_result: any | null;
    winner: 'host' | 'guest' | 'draw' | null;
}

export interface GameMove {
    id: string;
    created_at: string;
    room_id: string;
    player_id: string;
    player_role: 'host' | 'guest';
    move_number: number;
    card_index: number;
    prediction: any;
    actual_card: any;
    result: any;
    points_earned: number;
    streak_after: number;
}
