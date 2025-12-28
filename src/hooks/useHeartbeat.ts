import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Heartbeat hook - sends periodic heartbeat to indicate player is online
 * @param roomId - Game room ID
 * @param playerRole - Player's role (host or guest)
 */
export function useHeartbeat(
    roomId: string | null,
    playerRole: 'host' | 'guest' | null
) {
    useEffect(() => {
        if (!roomId || !playerRole) return;

        const sendHeartbeat = async () => {
            try {
                const field = `${playerRole}_last_heartbeat`;
                await supabase
                    .from('game_rooms')
                    .update({ [field]: new Date().toISOString() })
                    .eq('id', roomId);

                console.log(`[Heartbeat] Sent ${playerRole} heartbeat`);
            } catch (error) {
                console.error('[Heartbeat] Error sending heartbeat:', error);
            }
        };

        // Send immediately on mount
        sendHeartbeat();

        // Then send every 5 seconds
        const interval = setInterval(sendHeartbeat, 5000);

        return () => {
            console.log('[Heartbeat] Cleanup');
            clearInterval(interval);
        };
    }, [roomId, playerRole]);
}
