'use client';

import { useState, useEffect, useCallback } from 'react';
import { multiplayerService } from '../services/MultiplayerService';
import type { GameRoom } from '../lib/supabase';

export function useMultiplayer() {
    const [room, setRoom] = useState<GameRoom | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [playerRole, setPlayerRole] = useState<'host' | 'guest' | null>(null);

    // Subscribe to room updates
    useEffect(() => {
        if (!room) return;

        const unsubscribe = multiplayerService.subscribeToRoom((updatedRoom) => {
            setRoom(updatedRoom);
        });

        return () => {
            unsubscribe();
        };
    }, [room?.id]);

    // Update player role when room changes
    useEffect(() => {
        if (room) {
            multiplayerService.getPlayerRole().then(setPlayerRole);
        }
    }, [room]);

    /**
     * Create a new room
     */
    const createRoom = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const { roomId, inviteLink } = await multiplayerService.createRoom();
            const newRoom = await multiplayerService.getRoom();
            setRoom(newRoom);
            return { roomId, inviteLink };
        } catch (err: any) {
            setError(err.message || 'Failed to create room');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Join existing room
     */
    const joinRoom = useCallback(async (roomId: string) => {
        console.log('[useMultiplayer] joinRoom called with roomId:', roomId);
        setIsLoading(true);
        setError(null);

        try {
            console.log('[useMultiplayer] Calling multiplayerService.joinRoom...');
            const joinedRoom = await multiplayerService.joinRoom(roomId);
            console.log('[useMultiplayer] Joined room:', joinedRoom);
            setRoom(joinedRoom);

            // Force refresh after a short delay to ensure we get the updated status
            setTimeout(async () => {
                console.log('[useMultiplayer] Refreshing room data...');
                const refreshedRoom = await multiplayerService.getRoom();
                console.log('[useMultiplayer] Refreshed room:', refreshedRoom);
                if (refreshedRoom) {
                    setRoom(refreshedRoom);
                }
            }, 500);

            return joinedRoom;
        } catch (err: any) {
            console.error('[useMultiplayer] Error in joinRoom:', err);
            setError(err.message || 'Failed to join room');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Make a turn
     */
    const makeTurn = useCallback(async (prediction: any) => {
        setIsLoading(true);
        setError(null);

        try {
            await multiplayerService.makeTurn(prediction);
            // Room will be updated via subscription
        } catch (err: any) {
            setError(err.message || 'Failed to make turn');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Leave room
     */
    const leaveRoom = useCallback(async () => {
        await multiplayerService.leaveRoom();
        setRoom(null);
        setPlayerRole(null);
        setError(null);
    }, []);

    /**
     * Check if it's player's turn
     */
    const isMyTurn = room?.current_turn === playerRole;

    /**
     * Check if waiting for opponent
     */
    const isWaiting = room?.status === 'waiting';

    /**
     * Check if game is finished
     */
    const isFinished = room?.status === 'finished';

    /**
     * Get current card
     */
    const currentCard = room?.deck?.[room.current_card_index];

    /**
     * Get opponent info
     */
    const opponent = playerRole === 'host'
        ? { id: room?.guest_id, score: room?.guest_score, streak: room?.guest_streak }
        : { id: room?.host_id, score: room?.host_score, streak: room?.host_streak };

    /**
     * Get player info
     */
    const player = playerRole === 'host'
        ? { id: room?.host_id, score: room?.host_score, streak: room?.host_streak }
        : { id: room?.guest_id, score: room?.guest_score, streak: room?.guest_streak };

    return {
        room,
        playerRole,
        isLoading,
        error,
        isMyTurn,
        isWaiting,
        isFinished,
        currentCard,
        opponent,
        player,
        createRoom,
        joinRoom,
        makeTurn,
        leaveRoom,
    };
}
