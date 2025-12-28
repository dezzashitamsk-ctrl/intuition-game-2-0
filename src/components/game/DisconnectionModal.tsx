'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DisconnectionModalProps {
    disconnectedPlayer: 'host' | 'guest';
    deadline: Date;
    onWait: () => void;
    onLeave: () => void;
}

export function DisconnectionModal({
    disconnectedPlayer,
    deadline,
    onWait,
    onLeave,
}: DisconnectionModalProps) {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const updateTimer = () => {
            const now = Date.now();
            const left = Math.max(0, deadline.getTime() - now);
            setTimeLeft(Math.floor(left / 1000));

            if (left === 0) {
                // Timeout - automatically leave
                onLeave();
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [deadline, onLeave]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="glass-dark rounded-3xl p-8 max-w-md w-full mx-4 border-2 border-yellow-500/30"
                >
                    {/* Warning Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-yellow-500/20 border-2 border-yellow-500/50 flex items-center justify-center">
                            <span className="text-5xl">⚠️</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-center mb-4 text-yellow-400">
                        Игрок отключился
                    </h2>

                    {/* Message */}
                    <p className="text-center text-gray-300 mb-6">
                        Ожидание переподключения...
                    </p>

                    {/* Timer */}
                    <div className="bg-black/40 rounded-2xl p-6 mb-6 border border-yellow-500/20">
                        <div className="text-center">
                            <div className="text-sm text-gray-400 mb-2">Осталось времени</div>
                            <div className="text-5xl font-bold font-mono text-yellow-400">
                                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                            </div>
                            <div className="text-sm text-gray-500 mt-2">из 01:00</div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                                initial={{ width: '100%' }}
                                animate={{ width: `${(timeLeft / 60) * 100}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={onWait}
                            className="flex-1 py-3 px-6 rounded-xl
                       bg-gradient-to-r from-blue-500/20 to-blue-600/20
                       border-2 border-blue-500/40
                       hover:border-blue-500
                       hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]
                       transition-all duration-300
                       text-white font-semibold"
                        >
                            Подождать
                        </button>
                        <button
                            onClick={onLeave}
                            className="flex-1 py-3 px-6 rounded-xl
                       bg-gradient-to-r from-red-500/20 to-red-600/20
                       border-2 border-red-500/40
                       hover:border-red-500
                       hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]
                       transition-all duration-300
                       text-white font-semibold"
                        >
                            Выйти
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
