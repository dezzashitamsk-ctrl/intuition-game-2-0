import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DisconnectionModalProps {
    isOpen: boolean;
    waitTimeLeft: number; // seconds
    onWait: () => void;
    onExit: () => void;
}

export const DisconnectionModal: React.FC<DisconnectionModalProps> = ({
    isOpen,
    waitTimeLeft,
    onWait,
    onExit
}) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                    }}
                    className="glass-dark rounded-3xl p-8 max-w-md w-full border-2 border-yellow-500/30 shadow-[0_0_40px_rgba(251,191,36,0.3)]"
                >
                    {/* Icon */}
                    <div className="text-center mb-6">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, -10, 10, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-7xl mb-4"
                        >
                            💔
                        </motion.div>
                        <h2 className="text-3xl font-bold text-yellow-400 mb-2 font-[family-name:var(--font-orbitron)]">
                            Оппонент отключился
                        </h2>
                        <p className="text-gray-300">
                            Ожидание переподключения...
                        </p>
                    </div>

                    {/* Timer */}
                    <div className="glass-dark rounded-2xl p-6 mb-6 border-2 border-white/10 text-center">
                        <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider">
                            Осталось времени
                        </div>
                        <motion.div
                            key={waitTimeLeft}
                            initial={{ scale: 1.2, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-6xl font-bold text-yellow-400 font-[family-name:var(--font-orbitron)] tabular-nums"
                        >
                            {waitTimeLeft}
                        </motion.div>
                        <div className="text-xs text-gray-400 mt-2">
                            секунд
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        {/* Wait Button */}
                        <button
                            onClick={onWait}
                            className="flex-1 glass-dark px-6 py-4 rounded-xl
                                     bg-gradient-to-r from-yellow-500/20 to-amber-500/20
                                     border-2 border-yellow-500/50
                                     hover:border-yellow-400
                                     hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]
                                     hover:scale-105
                                     active:scale-95
                                     transition-all duration-300
                                     text-white font-bold
                                     font-[family-name:var(--font-orbitron)]
                                     flex items-center justify-center gap-2"
                        >
                            <span className="text-2xl">⏳</span>
                            <span>Ждать</span>
                        </button>

                        {/* Exit Button */}
                        <button
                            onClick={onExit}
                            className="flex-1 glass-dark px-6 py-4 rounded-xl
                                     bg-gradient-to-r from-red-500/20 to-red-500/20
                                     border-2 border-red-500/50
                                     hover:border-red-400
                                     hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]
                                     hover:scale-105
                                     active:scale-95
                                     transition-all duration-300
                                     text-white font-bold
                                     font-[family-name:var(--font-orbitron)]
                                     flex items-center justify-center gap-2"
                        >
                            <span className="text-2xl">🚪</span>
                            <span>Выйти</span>
                        </button>
                    </div>

                    {/* Info */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                        Игра автоматически завершится через {waitTimeLeft} секунд
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
