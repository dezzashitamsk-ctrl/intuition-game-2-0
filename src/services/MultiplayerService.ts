'use client';

import { supabase, GameRoom } from '../lib/supabase';
import { createDeck, shuffleDeck } from '../utils/cardUtils';
import type { Card, Prediction } from '../types/game';

export class MultiplayerService {
    private roomId: string | null = null;
    private userId: string;
    private subscription: any = null;

    constructor() {
        // Generate or get user ID from localStorage
        this.userId = this.getUserId();
    }

    /**
     * Get or create anonymous user ID
     */
    private getUserId(): string {
        if (typeof window === 'undefined') return 'server';

        let userId = localStorage.getItem('multiplayer_user_id');
        if (!userId) {
            userId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('multiplayer_user_id', userId);
        }
        return userId;
    }

    /**
     * Create a new game room
     */
    async createRoom(): Promise<{ roomId: string; inviteLink: string }> {
        try {
            // Create and shuffle deck
            const deck = shuffleDeck(createDeck());

            // Create room in database
            const { data, error } = await supabase
                .from('game_rooms')
                .insert({
                    host_id: this.userId,
                    deck: deck,
                    status: 'waiting',
                    current_turn: 'host',
                })
                .select()
                .single();

            if (error) throw error;

            this.roomId = data.id;

            // Generate invite link
            const inviteLink = `${window.location.origin}/online?room=${data.id}`;

            return { roomId: data.id, inviteLink };
        } catch (error) {
            console.error('Error creating room:', error);
            throw error;
        }
    }

    /**
     * Join existing room
     */
    async joinRoom(roomId: string): Promise<GameRoom> {
        console.log('[MultiplayerService] Joining room:', roomId);

        try {
            // Check if room exists and is waiting
            console.log('[MultiplayerService] Fetching room data...');
            const { data: room, error: fetchError } = await supabase
                .from('game_rooms')
                .select('*')
                .eq('id', roomId)
                .single();

            console.log('[MultiplayerService] Room fetch result:', { room, error: fetchError });

            if (fetchError) {
                console.error('[MultiplayerService] Fetch error:', fetchError);
                throw fetchError;
            }
            if (!room) {
                console.error('[MultiplayerService] Room not found');
                throw new Error('Room not found');
            }
            if (room.status !== 'waiting') {
                console.error('[MultiplayerService] Room not available, status:', room.status);
                throw new Error('Room is not available');
            }
            if (room.guest_id) {
                console.error('[MultiplayerService] Room is full');
                throw new Error('Room is full');
            }

            // Join room
            console.log('[MultiplayerService] Updating room with guest_id:', this.userId);
            const { data, error } = await supabase
                .from('game_rooms')
                .update({
                    guest_id: this.userId,
                    status: 'playing',
                })
                .eq('id', roomId)
                .select()
                .single();

            console.log('[MultiplayerService] Update result:', { data, error });

            if (error) {
                console.error('[MultiplayerService] Update error:', error);
                throw error;
            }

            this.roomId = roomId;
            console.log('[MultiplayerService] Successfully joined room:', data);
            return data;
        } catch (error) {
            console.error('[MultiplayerService] Error joining room:', error);
            throw error;
        }
    }

    /**
     * Get current room state
     */
    async getRoom(): Promise<GameRoom | null> {
        if (!this.roomId) return null;

        try {
            const { data, error } = await supabase
                .from('game_rooms')
                .select('*')
                .eq('id', this.roomId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching room:', error);
            return null;
        }
    }

    /**
     * Make a turn (prediction)
     */
    async makeTurn(prediction: Prediction): Promise<{ correct: boolean; totalPoints: number }> {
        if (!this.roomId) throw new Error('Not in a room');

        try {
            const room = await this.getRoom();
            if (!room) throw new Error('Room not found');

            // Determine player role
            const playerRole = room.host_id === this.userId ? 'host' : 'guest';

            // Check if it's player's turn
            if (room.current_turn !== playerRole) {
                throw new Error('Not your turn');
            }

            // Get current card
            const currentCard = room.deck[room.current_card_index];
            if (!currentCard) throw new Error('No more cards');

            // Calculate result
            const result = this.checkPrediction(prediction, currentCard);

            // Calculate new score and streak
            const scoreField = playerRole === 'host' ? 'host_score' : 'guest_score';
            const streakField = playerRole === 'host' ? 'host_streak' : 'guest_streak';
            const newScore = room[scoreField] + result.totalPoints;
            const newStreak = result.correct ? room[streakField] + 1 : 0;

            // Determine next turn
            const nextTurn = playerRole === 'host' ? 'guest' : 'host';

            // Check if game is finished
            const isLastCard = room.current_card_index >= room.deck.length - 1;
            const newStatus = isLastCard ? 'finished' : 'playing';

            let winner = null;
            if (isLastCard) {
                if (room.host_score > room.guest_score) winner = 'host';
                else if (room.guest_score > room.host_score) winner = 'guest';
                else winner = 'draw';
            }

            // Update room
            const { error: updateError } = await supabase
                .from('game_rooms')
                .update({
                    [scoreField]: newScore,
                    [streakField]: newStreak,
                    current_card_index: room.current_card_index + 1,
                    current_turn: isLastCard ? null : nextTurn,
                    last_prediction: prediction,
                    last_result: result,
                    status: newStatus,
                    winner: winner,
                })
                .eq('id', this.roomId);

            if (updateError) throw updateError;

            // Save move
            const { error: moveError } = await supabase
                .from('game_moves')
                .insert({
                    room_id: this.roomId,
                    player_id: this.userId,
                    player_role: playerRole,
                    move_number: room.current_card_index,
                    card_index: room.current_card_index,
                    prediction: prediction,
                    actual_card: currentCard,
                    result: result,
                    points_earned: result.totalPoints,
                    streak_after: newStreak,
                });

            if (moveError) throw moveError;

            // Return result immediately
            return {
                correct: result.correct,
                totalPoints: result.totalPoints
            };
        } catch (error) {
            console.error('Error making turn:', error);
            throw error;
        }
    }

    /**
     * Subscribe to room updates
     */
    subscribeToRoom(callback: (room: GameRoom) => void): () => void {
        if (!this.roomId) throw new Error('Not in a room');

        this.subscription = supabase
            .channel(`room:${this.roomId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'game_rooms',
                    filter: `id=eq.${this.roomId}`,
                },
                (payload) => {
                    callback(payload.new as GameRoom);
                }
            )
            .subscribe();

        // Return unsubscribe function
        return () => {
            if (this.subscription) {
                supabase.removeChannel(this.subscription);
                this.subscription = null;
            }
        };
    }

    /**
     * Leave room
     */
    async leaveRoom(): Promise<void> {
        if (this.subscription) {
            supabase.removeChannel(this.subscription);
            this.subscription = null;
        }
        this.roomId = null;
    }

    /**
     * Get player role in current room
     */
    async getPlayerRole(): Promise<'host' | 'guest' | null> {
        const room = await this.getRoom();
        if (!room) return null;

        if (room.host_id === this.userId) return 'host';
        if (room.guest_id === this.userId) return 'guest';
        return null;
    }

    /**
     * Check if it's player's turn
     */
    async isMyTurn(): Promise<boolean> {
        const room = await this.getRoom();
        if (!room) return false;

        const role = await this.getPlayerRole();
        return room.current_turn === role;
    }

    /**
     * Check prediction (same logic as in cardUtils)
     */
    private checkPrediction(prediction: Prediction, card: Card) {
        console.log('[MultiplayerService] checkPrediction:', {
            prediction,
            card,
            predictionColor: prediction.color,
            cardColor: card.color,
            match: prediction.color === card.color
        });

        let correct = false;
        let basePoints = 0;

        switch (prediction.mode) {
            case 'color':
                correct = prediction.color === card.color;
                basePoints = 2;
                break;
            case 'suit':
                correct = prediction.suit === card.suit;
                basePoints = 5;
                break;
            case 'rank':
                correct = prediction.rank === card.rank;
                basePoints = 15;
                break;
            case 'full':
                correct = prediction.suit === card.suit && prediction.rank === card.rank;
                basePoints = 30;
                break;
        }

        const result = {
            correct,
            basePoints,
            totalPoints: correct ? basePoints : 0,
        };

        console.log('[MultiplayerService] checkPrediction result:', result);

        return result;
    }
}

// Singleton instance
export const multiplayerService = new MultiplayerService();
