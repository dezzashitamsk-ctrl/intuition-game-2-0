'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMultiplayer } from '../../hooks/useMultiplayer';
import { multiplayerService } from '../../services/MultiplayerService';
import { RoomLobby } from '../../components/multiplayer/RoomLobby';
import { OnlineGame } from '../../components/multiplayer/OnlineGame';
import { AnimatedBackground } from '../../components/ui/AnimatedBackground';
import { motion } from 'framer-motion';

export default function OnlinePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomIdFromUrl = searchParams.get('room');

    const {
        room,
        playerRole,
        isWaiting,
        createRoom,
        joinRoom,
        leaveRoom,
    } = useMultiplayer();

    const [inviteLink, setInviteLink] = useState('');
    const [showLobby, setShowLobby] = useState(true);

    // Get current card directly from database (already decrypted)
    const currentCard = room?.current_card || null;

    // Auto-join if room ID in URL
    useEffect(() => {
        console.log('[online/page] roomIdFromUrl:', roomIdFromUrl);
        console.log('[online/page] room:', room);

        if (roomIdFromUrl && !room) {
            console.log('[online/page] Auto-joining room:', roomIdFromUrl);
            handleJoinRoom(roomIdFromUrl);
        }
    }, [roomIdFromUrl]);

    const handleCreateRoom = async () => {
        try {
            const { inviteLink } = await createRoom();
            setInviteLink(inviteLink);
            setShowLobby(false);
        } catch (error) {
            console.error('Failed to create room:', error);
        }
    };

    const handleJoinRoom = async (roomId: string) => {
        console.log('[online/page] handleJoinRoom called with:', roomId);

        if (!roomId.trim()) return;

        try {
            await joinRoom(roomId.trim());
            setShowLobby(false);
        } catch (error) {
            console.error('Failed to join room:', error);
            alert('Не удалось присоединиться к комнате');
        }
    };

    const handleBack = () => {
        router.push('/');
    };

    const handleLeave = async () => {
        await leaveRoom();
        setShowLobby(true);
        setInviteLink('');
        router.push('/online');
    };

    const copyInviteLink = () => {
        navigator.clipboard.writeText(inviteLink);
        alert('Ссылка скопирована!');
    };

    // Debug logging
    console.log('Online Page State:', JSON.stringify({
        showLobby,
        hasRoom: !!room,
        roomStatus: room?.status,
        playerRole,
        isWaiting,
    }, null, 2));

    // Show lobby if explicitly requested or no room
    if (showLobby || !room) {
        return (
            <RoomLobby
                onRoomCreated={handleCreateRoom}
                onRoomJoined={handleJoinRoom}
                onBack={handleBack}
            />
        );
    }

    // Loading state - waiting for playerRole to be set
    if (!playerRole) {
        return (
            <div className="min-h-screen relative flex items-center justify-center">
                <AnimatedBackground variant="game" />
                <div className="glass-dark rounded-3xl p-8 text-center">
                    <div className="text-4xl mb-4 animate-pulse">⏳</div>
                    <div className="text-white">Loading...</div>
                </div>
            </div>
        );
    }

    // Show waiting room if host is waiting for opponent
    if (isWaiting && playerRole === 'host') {
        return (
            <div className="min-h-screen relative flex items-center justify-center">
                <AnimatedBackground variant="game" />

                <div className="relative z-10 w-full max-w-2xl p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-dark rounded-3xl p-8 text-center"
                    >
                        <div className="text-6xl mb-6 animate-pulse">⏳</div>
                        <h2 className="text-3xl font-bold text-blue-400 mb-4 font-[family-name:var(--font-orbitron)]">
                            Ожидание оппонента...
                        </h2>
                        <p className="text-gray-300 mb-8">
                            Отправьте ссылку-приглашение другу
                        </p>

                        {/* Invite Link */}
                        <div className="glass-dark rounded-xl p-4 mb-6 border-2 border-blue-500/30">
                            <div className="text-sm text-gray-400 mb-2 font-[family-name:var(--font-orbitron)]">
                                ССЫЛКА-ПРИГЛАШЕНИЕ
                            </div>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={inviteLink}
                                    readOnly
                                    className="flex-1 bg-black/30 rounded-lg px-4 py-2 text-white text-sm"
                                />
                                <button
                                    onClick={copyInviteLink}
                                    className="glass-dark px-6 py-2 rounded-lg
                                             border-2 border-blue-500/50
                                             hover:border-blue-400
                                             transition-all
                                             text-white font-bold
                                             font-[family-name:var(--font-orbitron)]"
                                >
                                    📋 Копировать
                                </button>
                            </div>
                        </div>

                        {/* Room Code */}
                        <div className="glass-dark rounded-xl p-6 mb-8 border-2 border-purple-500/30">
                            <div className="text-sm text-gray-400 mb-2 font-[family-name:var(--font-orbitron)]">
                                КОД КОМНАТЫ
                            </div>
                            <div className="text-2xl font-bold text-white font-mono break-all">
                                {room.id}
                            </div>
                        </div>

                        <button
                            onClick={handleLeave}
                            className="glass-dark px-8 py-3 rounded-xl
                                     border-2 border-white/10
                                     hover:border-white/30
                                     transition-all
                                     text-gray-400 hover:text-white
                                     font-[family-name:var(--font-orbitron)]"
                        >
                            ← Отменить
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Show game if room is playing or finished (both players present)
    if (room && (room.status === 'playing' || room.status === 'finished')) {
        return (
            <OnlineGame
                room={room}
                playerRole={playerRole!}
                isMyTurn={!!room && room.current_turn === playerRole}
                isFinished={room.status === 'finished'}
                currentCard={currentCard}
                opponent={playerRole === 'host'
                    ? { id: room.guest_id, score: room.guest_score, streak: room.guest_streak }
                    : { id: room.host_id, score: room.host_score, streak: room.host_streak }}
                player={playerRole === 'host'
                    ? { id: room.host_id, score: room.host_score, streak: room.host_streak }
                    : { id: room.guest_id, score: room.guest_score, streak: room.guest_streak }}
                makeTurn={async (prediction) => {
                    try {
                        return await multiplayerService.makeTurn(prediction);
                    } catch (error) {
                        console.error('Error making turn:', error);
                        throw error;
                    }
                }}
                onLeave={handleLeave}
            />
        );
    }

    // Debug fallback
    return (
        <div className="min-h-screen relative flex items-center justify-center">
            <AnimatedBackground variant="game" />
            <div className="relative z-10 w-full max-w-4xl p-4">
                <div className="glass-dark rounded-3xl p-8">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-4">🐛 Debug Info</h2>
                    <pre className="text-white text-sm bg-black/50 p-4 rounded overflow-auto">
                        {JSON.stringify({
                            showLobby,
                            hasRoom: !!room,
                            roomStatus: room?.status,
                            playerRole,
                            isWaiting,
                            roomId: room?.id,
                        }, null, 2)}
                    </pre>
                    <button
                        onClick={handleLeave}
                        className="mt-4 glass-dark px-6 py-3 rounded-xl border-2 border-white/10 hover:border-white/30 text-white"
                    >
                        ← Back to Lobby
                    </button>
                </div>
            </div>
        </div>
    );
}
