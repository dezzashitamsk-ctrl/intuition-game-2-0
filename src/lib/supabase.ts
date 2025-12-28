import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Card types
export interface Card {
    suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
    rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
    color: 'red' | 'black';
}

export interface GameRoom {
    id: string;
    created_at: string;
    updated_at: string;
    status: 'waiting' | 'playing' | 'finished';
    host_id: string;
    guest_id: string | null;
    current_turn: 'host' | 'guest' | null;
    encrypted_deck: string;
    deck_seed: string;
    current_card: any;
    current_card_index: number;
    host_score: number;
    guest_score: number;
    host_streak: number;
    guest_streak: number;
    last_prediction: any | null;
    last_result: any | null;
    winner: 'host' | 'guest' | 'draw' | null;
    turn_started_at: string | null;
    turn_timeout_seconds: number;
    card_revealed: boolean;
    host_current_choice: any | null;
    guest_current_choice: any | null;
    host_last_seen: string | null;
    guest_last_seen: string | null;
    // Reconnection fields
    disconnected_player: 'host' | 'guest' | null;
    disconnect_time: string | null;
    reconnection_deadline: string | null;
    // Heartbeat fields
    host_last_heartbeat: string | null;
    guest_last_heartbeat: string | null;
    // Animation sync fields
    animation_state: 'idle' | 'revealing' | 'showing' | 'hiding';
    animation_started_at: string | null;
    processing_lock: string | null;
    lock_expires_at: string | null;
}
