'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExitConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="glass-dark rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Иконка предупреждения */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                                <span className="text-5xl">⚠️</span>
                            </div>
                        </div>

                        {/* Заголовок */}
                        <h2 className="text-3xl font-bold text-white text-center mb-4 font-[family-name:var(--font-orbitron)]">
                            Выйти из игры?
                        </h2>

                        {/* Описание */}
                        <p className="text-gray-400 text-center mb-8 text-lg">
                            Весь прогресс будет потерян. Вы уверены?
                        </p>

                        {/* Кнопки */}
                        <div className="flex gap-4">
                            {/* Отмена */}
                            <button
                                onClick={onCancel}
                                className="flex-1 glass-dark rounded-xl p-4 border-2 border-white/10
                                         hover:border-white/30 hover:scale-105
                                         transition-all duration-300
                                         text-white font-bold text-lg"
                            >
                                Отмена
                            </button>

                            {/* Подтверждение */}
                            <button
                                onClick={onConfirm}
                                className="flex-1 glass-dark rounded-xl p-4 border-2 border-red-500/50
                                         hover:border-red-500 hover:scale-105 glow-red
                                         transition-all duration-300
                                         text-red-400 font-bold text-lg font-[family-name:var(--font-orbitron)]"
                            >
                                Выйти
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
