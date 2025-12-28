import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface PresenceState {
    isOnline: boolean;
    opponentOnline: boolean;
    lastSeen: Date | null;
}

export function usePresence(
    roomId: string | null,
    userId: string,
    playerRole: 'host' | 'guest' | null,
    onOpponentDisconnect?: () => void,
    onOpponentReconnect?: () => void
): PresenceState {
    const [isOnline, setIsOnline] = useState(true);
    const [opponentOnline, setOpponentOnline] = useState(true);
    const [lastSeen, setLastSeen] = useState<Date | null>(null);

    // Use refs for callbacks to avoid recreating them
    const onDisconnectRef = useRef(onOpponentDisconnect);
    const onReconnectRef = useRef(onOpponentReconnect);
    const opponentOnlineRef = useRef(opponentOnline);

    // Update refs when callbacks change
    useEffect(() => {
        onDisconnectRef.current = onOpponentDisconnect;
        onReconnectRef.current = onOpponentReconnect;
        opponentOnlineRef.current = opponentOnline;
    });

    useEffect(() => {
        if (!roomId || !playerRole) return;

        console.log('[Presence] Setting up presence tracking for room:', roomId);

        const presenceChannel = supabase.channel(`presence:${roomId}`, {
            config: {
                presence: {
                    key: userId,
                },
            },
        });

        presenceChannel
            .on('presence', { event: 'sync' }, () => {
                const state = presenceChannel.presenceState();
                const presences = Object.values(state).flat();

                // Check if opponent is online
                const opponentPresent = presences.some((p: any) => p.user_id !== userId);

                if (opponentPresent !== opponentOnlineRef.current) {
                    setOpponentOnline(opponentPresent);

                    if (opponentPresent && onReconnectRef.current) {
                        console.log('[Presence] Opponent reconnected');
                        onReconnectRef.current();
                    } else if (!opponentPresent && onDisconnectRef.current) {
                        console.log('[Presence] Opponent disconnected');
                        onDisconnectRef.current();
                    }
                }
            })
            .on('presence', { event: 'join' }, ({ key }) => {
                console.log('[Presence] Player joined:', key);
            })
            .on('presence', { event: 'leave' }, ({ key }) => {
                console.log('[Presence] Player left:', key);
                setLastSeen(new Date());
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('[Presence] Subscribed, tracking presence');
                    await presenceChannel.track({
                        user_id: userId,
                        player_role: playerRole,
                        online_at: new Date().toISOString(),
                    });
                    setIsOnline(true);
                } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                    console.error('[Presence] Connection error:', status);
                    setIsOnline(false);
                }
            });

        // Heartbeat to keep presence alive
        const heartbeat = setInterval(async () => {
            await presenceChannel.track({
                user_id: userId,
                player_role: playerRole,
                online_at: new Date().toISOString(),
            });
        }, 30000); // Every 30 seconds

        return () => {
            console.log('[Presence] Cleaning up presence tracking');
            clearInterval(heartbeat);
            presenceChannel.unsubscribe();
        };
    }, [roomId, userId, playerRole]); // Only these dependencies - no callbacks!

    return { isOnline, opponentOnline, lastSeen };
}
