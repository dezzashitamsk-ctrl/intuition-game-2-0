'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '../ui/AnimatedBackground';

interface RoomLobbyProps {
    onRoomCreated: (roomId: string, inviteLink: string) => void;
    onRoomJoined: (roomId: string) => void;
    onBack: () => void;
}

export const RoomLobby: React.FC<RoomLobbyProps> = ({
    onRoomCreated,
    onRoomJoined,
    onBack,
}) => {
    const [roomCode, setRoomCode] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    const handleCreateRoom = async () => {
        setIsCreating(true);
        try {
            // Will be called from parent with useMultiplayer hook
            onRoomCreated('', '');
        } catch (error) {
            console.error('Error creating room:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleJoinRoom = async () => {
        if (!roomCode.trim()) return;

        setIsJoining(true);
        try {
            onRoomJoined(roomCode.trim());
        } catch (error) {
            console.error('Error joining room:', error);
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center">
            <AnimatedBackground variant="game" />

            <div className="relative z-10 w-full max-w-2xl p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-dark rounded-3xl p-8"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-blue-400 mb-2 font-[family-name:var(--font-orbitron)]">
                            🌐 Online 1v1
                        </h1>
                        <p className="text-gray-300">
                            Создайте комнату или присоединитесь к существующей
                        </p>
                    </div>

                    {/* Create Room */}
                    <div className="mb-8">
                        <button
                            onClick={handleCreateRoom}
                            disabled={isCreating}
                            className="w-full glass-dark rounded-2xl p-6
                                     bg-gradient-to-r from-blue-500/20 to-purple-500/20
                                     border-2 border-blue-500/50
                                     hover:border-blue-400
                                     hover:scale-[1.02]
                                     active:scale-[0.98]
                                     transition-all duration-300
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-orbitron)]">
                                {isCreating ? '⏳ Создание...' : '➕ Создать комнату'}
                            </div>
                            <div className="text-sm text-gray-400">
                                Получите ссылку-приглашение для друга
                            </div>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
                        <span className="text-gray-500 font-[family-name:var(--font-orbitron)]">ИЛИ</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
                    </div>

                    {/* Join Room */}
                    <div className="mb-8">
                        <label className="block text-sm text-gray-400 mb-3 font-[family-name:var(--font-orbitron)]">
                            КОД КОМНАТЫ
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                                placeholder="Вставьте код комнаты..."
                                className="flex-1 glass-dark rounded-xl px-4 py-3
                                         border-2 border-white/10
                                         focus:border-purple-500
                                         focus:outline-none
                                         text-white placeholder-gray-500
                                         transition-colors"
                                onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                            />
                            <button
                                onClick={handleJoinRoom}
                                disabled={!roomCode.trim() || isJoining}
                                className="glass-dark rounded-xl px-6 py-3
                                         bg-gradient-to-r from-purple-500/20 to-pink-500/20
                                         border-2 border-purple-500/50
                                         hover:border-purple-400
                                         hover:scale-105
                                         active:scale-95
                                         transition-all duration-300
                                         text-white font-bold
                                         font-[family-name:var(--font-orbitron)]
                                         disabled:opacity-50 disabled:cursor-not-allowed
                                         disabled:hover:scale-100"
                            >
                                {isJoining ? '⏳' : '🚪 Войти'}
                            </button>
                        </div>
                    </div>

                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="w-full glass-dark rounded-xl px-6 py-3
                                 border-2 border-white/10
                                 hover:border-white/30
                                 transition-all duration-300
                                 text-gray-400 hover:text-white
                                 font-[family-name:var(--font-orbitron)]"
                    >
                        ← Назад
                    </button>
                </motion.div>
            </div>
        </div>
    );
};
