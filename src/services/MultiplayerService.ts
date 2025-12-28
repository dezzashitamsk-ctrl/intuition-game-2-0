'use client';

import { supabase, GameRoom } from '../lib/supabase';
import { createDeck, shuffleDeck } from '../utils/cardUtils';
import { generateDeck, encryptDeck, decryptCard, generateSeed } from '../utils/deckEncryption';
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
            // Create, shuffle, and encrypt deck
            const deck = shuffleDeck(generateDeck());
            const seed = generateSeed();
            const encryptedDeck = encryptDeck(deck, seed);

            console.log('[createRoom] Encrypted deck length:', encryptedDeck.length);
            console.log('[createRoom] Seed:', seed);

            // Decrypt first card and save to DB
            const firstCard = decryptCard(encryptedDeck, seed, 0);
            console.log('[createRoom] First card:', firstCard);

            // Create room in database
            const { data, error } = await supabase
                .from('game_rooms')
                .insert({
                    host_id: this.userId,
                    encrypted_deck: encryptedDeck,
                    deck_seed: seed,
                    current_card: firstCard,  // Save decrypted card
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

            // Check if this is a reconnection
            const isMyRoom = room.host_id === this.userId || room.guest_id === this.userId;
            const isReconnecting = isMyRoom && room.status === 'playing';

            if (isReconnecting) {
                // Reconnection - just set roomId and clear disconnect state
                console.log('[MultiplayerService] Reconnecting to room');
                this.roomId = roomId;

                // Clear disconnect state if I was disconnected
                const myRole = room.host_id === this.userId ? 'host' : 'guest';
                if (room.disconnected_player === myRole) {
                    await this.handleReconnect();
                }

                return room;
            }

            // Normal join flow - must be waiting status
            if (room.status !== 'waiting') {
                console.error('[MultiplayerService] Room not available, status:', room.status);
                throw new Error('Room is not available');
            }
            if (room.guest_id) {
                console.error('[MultiplayerService] Room is full');
                throw new Error('Room is full');
            }

            // Join room as guest
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

            if (!data) {
                throw new Error('Failed to join room');
            }

            this.roomId = data.id;
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
     * Get current card from encrypted deck
     */
    private async getCurrentCard(room: GameRoom): Promise<Card | null> {
        try {
            return decryptCard(room.encrypted_deck, room.deck_seed, room.current_card_index);
        } catch (error) {
            console.error('Error decrypting card:', error);
            return null;
        }
    }

    /**
     * Make a turn (HYBRID APPROACH - server logic, client animations)
     */
    async makeTurn(prediction: Prediction): Promise<{ correct: boolean; totalPoints: number }> {
        if (!this.roomId) throw new Error('Not in a room');

        try {
            const room = await this.getRoom();
            if (!room) throw new Error('Room not found');

            // Determine player role
            const playerRole = room.host_id === this.userId ? 'host' : 'guest';

            console.log('[makeTurn] Turn check:', {
                playerRole,
                current_turn: room.current_turn,
                card_revealed: room.card_revealed,
                isMyTurn: room.current_turn === playerRole
            });

            // Check if it's player's turn
            if (room.current_turn !== playerRole) {
                console.error('[makeTurn] Not your turn!', {
                    playerRole,
                    current_turn: room.current_turn,
                    card_revealed: room.card_revealed
                });
                throw new Error('Not your turn');
            }

            // Get current card (decrypt from encrypted deck)
            const currentCard = await this.getCurrentCard(room);
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

            // Check if game is finished (52 cards total)
            const isLastCard = room.current_card_index >= 51;
            const newStatus = isLastCard ? 'finished' : 'playing';

            let winner = null;
            if (newStatus === 'finished') {
                winner = newScore > (playerRole === 'host' ? room.guest_score : room.host_score)
                    ? playerRole
                    : newScore < (playerRole === 'host' ? room.guest_score : room.host_score)
                        ? (playerRole === 'host' ? 'guest' : 'host')
                        : 'draw';
            }

            // Decrypt next card (if not last card)
            const nextCardIndex = room.current_card_index + 1;
            const nextCard = !isLastCard ? decryptCard(room.encrypted_deck, room.deck_seed, nextCardIndex) : null;

            // Clear player's choice after turn
            const choiceField = playerRole === 'host' ? 'host_current_choice' : 'guest_current_choice';

            // Update room - set card_revealed for client animation sync
            const { error: updateError } = await supabase
                .from('game_rooms')
                .update({
                    [scoreField]: newScore,
                    [streakField]: newStreak,
                    current_card_index: nextCardIndex,
                    current_card: nextCard,
                    current_turn: nextTurn,
                    turn_started_at: new Date().toISOString(),
                    last_prediction: prediction,
                    last_result: result,
                    status: newStatus,
                    winner: winner,
                    [choiceField]: null,
                    card_revealed: true, // Client will animate based on this
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
     * Hide card (reset card_revealed to false)
     */
    async hideCard(): Promise<void> {
        if (!this.roomId) return;

        await supabase
            .from('game_rooms')
            .update({
                card_revealed: false,
                turn_started_at: new Date().toISOString() // Reset timer for next player
            })
            .eq('id', this.roomId);
    }

    /**
     * Save player's current choice (before submitting turn)
     * This allows opponent to see what you're choosing in real-time
     */
    async savePlayerChoice(prediction: Prediction): Promise<void> {
        if (!this.roomId || !this.userId) return;

        try {
            const room = await this.getRoom();
            if (!room) return;

            const playerRole = room.host_id === this.userId ? 'host' : 'guest';
            const choiceField = playerRole === 'host' ? 'host_current_choice' : 'guest_current_choice';

            let choiceData: { type: 'suit' | 'color' | 'value'; value: string } | null = null;

            // Convert Prediction to choice format
            if (prediction.mode === 'color' && prediction.color) {
                choiceData = { type: 'color', value: prediction.color };
            } else if (prediction.mode === 'suit' && prediction.suit) {
                choiceData = { type: 'suit', value: prediction.suit };
            } else if (prediction.mode === 'rank' && prediction.rank) {
                choiceData = { type: 'value', value: prediction.rank };
            } else if (prediction.mode === 'full' && prediction.suit && prediction.rank) {
                // For full card, show both suit and rank
                choiceData = { type: 'value', value: `${prediction.rank} ${prediction.suit}` };
            }

            // Save choice to database
            await supabase
                .from('game_rooms')
                .update({
                    [choiceField]: choiceData
                })
                .eq('id', this.roomId);
        } catch (error) {
            console.error('Error saving player choice:', error);
        }
    }

    /**
     * Confirm player's choice (when clicking "Сделать выбор" button)
     * This makes the bubble turn green and scale up
     */
    async confirmPlayerChoice(): Promise<void> {
        if (!this.roomId || !this.userId) return;

        try {
            const room = await this.getRoom();
            if (!room) return;

            const playerRole = room.host_id === this.userId ? 'host' : 'guest';
            const choiceField = playerRole === 'host' ? 'host_current_choice' : 'guest_current_choice';
            const currentChoice = playerRole === 'host' ? room.host_current_choice : room.guest_current_choice;

            if (!currentChoice) return;

            // Mark choice as confirmed
            await supabase
                .from('game_rooms')
                .update({
                    [choiceField]: { ...currentChoice, confirmed: true }
                })
                .eq('id', this.roomId);
        } catch (error) {
            console.error('Error confirming player choice:', error);
        }
    }

    /**
     * Reveal card (show face) - syncs for both players
     */
    async revealCard(): Promise<void> {
        if (!this.roomId) return;

        try {
            await supabase
                .from('game_rooms')
                .update({ card_revealed: true })
                .eq('id', this.roomId);
        } catch (error) {
            console.error('Error revealing card:', error);
        }
    }

    /**
     * Handle player disconnect - set deadline for reconnection
     */
    async handleDisconnect(playerRole: 'host' | 'guest', roomId?: string): Promise<void> {
        const targetRoomId = roomId || this.roomId;
        if (!targetRoomId) {
            console.error('[handleDisconnect] No roomId available');
            return;
        }

        try {
            const deadline = new Date(Date.now() + 60000); // 60 seconds grace period

            await supabase
                .from('game_rooms')
                .update({
                    disconnected_player: playerRole,
                    disconnect_time: new Date().toISOString(),
                    reconnection_deadline: deadline.toISOString(),
                })
                .eq('id', targetRoomId);

            console.log(`[Disconnect] Player ${playerRole} disconnected, deadline:`, deadline);
        } catch (error) {
            console.error('Error handling disconnect:', error);
        }
    }

    /**
     * Handle player reconnect - clear disconnect state
     */
    async handleReconnect(): Promise<void> {
        if (!this.roomId) return;

        try {
            await supabase
                .from('game_rooms')
                .update({
                    disconnected_player: null,
                    disconnect_time: null,
                    reconnection_deadline: null,
                })
                .eq('id', this.roomId);

            console.log('[Reconnect] Player reconnected successfully');
        } catch (error) {
            console.error('Error handling reconnect:', error);
        }
    }

    /**
     * Check if reconnection timeout has expired
     */
    async checkReconnectionTimeout(): Promise<boolean> {
        if (!this.roomId) return false;

        try {
            const room = await this.getRoom();
            if (!room || !room.reconnection_deadline) return false;

            const deadline = new Date(room.reconnection_deadline);
            const now = new Date();

            if (now > deadline) {
                // Timeout expired - end game
                const winner = room.disconnected_player === 'host' ? 'guest' : 'host';

                await supabase
                    .from('game_rooms')
                    .update({
                        status: 'finished',
                        winner: winner,
                    })
                    .eq('id', this.roomId);

                console.log(`[Timeout] Reconnection timeout expired, winner: ${winner}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error checking reconnection timeout:', error);
            return false;
        }
    }

    /**
     * Subscribe to room updates
     */
    subscribeToRoom(callback: (room: GameRoom) => void): () => void {
        if (!this.roomId) {
            console.warn('[subscribeToRoom] No roomId set, skipping subscription');
            return () => { }; // Return empty cleanup function
        }

        console.log('[subscribeToRoom] Setting up subscription for room:', this.roomId);

        // Track last important state to filter heartbeat-only updates
        let lastState = {
            card_revealed: null as boolean | null,
            current_turn: null as string | null,
            status: null as string | null,
            current_card_index: null as number | null
        };

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
                    const newRoom = payload.new as GameRoom;

                    // Check if this is a meaningful update (not just heartbeat)
                    const isImportant =
                        newRoom.card_revealed !== lastState.card_revealed ||
                        newRoom.current_turn !== lastState.current_turn ||
                        newRoom.status !== lastState.status ||
                        newRoom.current_card_index !== lastState.current_card_index;

                    if (isImportant) {
                        console.log('[subscribeToRoom] Important UPDATE:', {
                            card_revealed: newRoom.card_revealed,
                            current_turn: newRoom.current_turn
                        });

                        // Update last state
                        lastState = {
                            card_revealed: newRoom.card_revealed,
                            current_turn: newRoom.current_turn,
                            status: newRoom.status,
                            current_card_index: newRoom.current_card_index
                        };

                        callback(newRoom);
                    }
                    // Silently ignore heartbeat-only updates
                }
            )
            .subscribe((status) => {
                console.log('[subscribeToRoom] Subscription status:', status);
            });

        // Return unsubscribe function
        return () => {
            if (this.subscription) {
                console.log('[subscribeToRoom] Unsubscribing from room');
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

    /**
     * Update player presence (heartbeat)
     */
    async updatePlayerPresence(): Promise<void> {
        if (!this.roomId) return;

        try {
            const room = await this.getRoom();
            if (!room) return;

            const playerRole = room.host_id === this.userId ? 'host' : 'guest';
            const heartbeatField = playerRole === 'host' ? 'host_last_heartbeat' : 'guest_last_heartbeat';

            await supabase
                .from('game_rooms')
                .update({
                    [heartbeatField]: new Date().toISOString(),
                    // Clear disconnected status if player is back
                    disconnected_player: room.disconnected_player === playerRole ? null : room.disconnected_player
                })
                .eq('id', this.roomId);
        } catch (error) {
            console.error('Error updating presence:', error);
        }
    }

    /**
     * Check if opponent is connected
     */
    async checkOpponentConnection(): Promise<boolean> {
        if (!this.roomId) return false;

        try {
            const room = await this.getRoom();
            if (!room) return false;

            const playerRole = room.host_id === this.userId ? 'host' : 'guest';
            const opponentRole = playerRole === 'host' ? 'guest' : 'host';
            const opponentHeartbeatField = opponentRole === 'host' ? 'host_last_heartbeat' : 'guest_last_heartbeat';

            const opponentLastHeartbeat = room[opponentHeartbeatField];
            if (!opponentLastHeartbeat) return false;

            const now = new Date();
            const lastHeartbeatTime = new Date(opponentLastHeartbeat);
            const timeSinceLastSeen = now.getTime() - lastHeartbeatTime.getTime();

            // Consider disconnected if no activity for 15 seconds
            return timeSinceLastSeen < 15000;
        } catch (error) {
            console.error('Error checking opponent connection:', error);
            return false;
        }
    }

    /**
     * Mark opponent as disconnected
     */
    async markOpponentDisconnected(): Promise<void> {
        if (!this.roomId) return;

        try {
            const room = await this.getRoom();
            if (!room) return;

            const playerRole = room.host_id === this.userId ? 'host' : 'guest';
            const opponentRole = playerRole === 'host' ? 'guest' : 'host';

            await supabase
                .from('game_rooms')
                .update({
                    disconnected_player: opponentRole
                })
                .eq('id', this.roomId);
        } catch (error) {
            console.error('Error marking opponent disconnected:', error);
        }
    }

    /**
     * Skip turn (timeout or disconnection)
     * Passes turn to opponent WITHOUT moving to next card
     */
    async skipTurn(): Promise<void> {
        if (!this.roomId) return;

        try {
            const room = await this.getRoom();
            if (!room) return;

            const playerRole = room.host_id === this.userId ? 'host' : 'guest';

            // Only skip if it's actually this player's turn
            if (room.current_turn !== playerRole) return;

            // Determine next turn
            const nextTurn = playerRole === 'host' ? 'guest' : 'host';

            // Update room - pass turn to opponent, keep same card
            await supabase
                .from('game_rooms')
                .update({
                    // НЕ увеличиваем current_card_index - карта остается та же!
                    current_turn: nextTurn,
                    turn_started_at: new Date().toISOString(),
                })
                .eq('id', this.roomId);
        } catch (error) {
            console.error('Error skipping turn:', error);
            throw error;
        }
    }
}

// Singleton instance
export const multiplayerService = new MultiplayerService();
