'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ReconnectingModalProps {
    attempt: number;
    maxAttempts: number;
}

export function ReconnectingModal({ attempt, maxAttempts }: ReconnectingModalProps) {
    const progress = (attempt / maxAttempts) * 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-dark rounded-3xl p-8 max-w-md w-full mx-4 border-2 border-blue-500/30"
            >
                {/* Spinner Icon */}
                <div className="flex justify-center mb-6">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-20 h-20 rounded-full bg-blue-500/20 border-4 border-blue-500/50 border-t-blue-500 flex items-center justify-center"
                    >
                        <span className="text-4xl">🔄</span>
                    </motion.div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-center mb-4 text-blue-400">
                    Переподключение...
                </h2>

                {/* Attempt Counter */}
                <p className="text-center text-gray-300 mb-6">
                    Попытка {attempt} из {maxAttempts}
                </p>

                {/* Progress Bar */}
                <div className="bg-black/40 rounded-2xl p-4 border border-blue-500/20">
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                            initial={{ width: '0%' }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <div className="text-center text-sm text-gray-400 mt-2">
                        {Math.round(progress)}%
                    </div>
                </div>

                {/* Info Text */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Пожалуйста, подождите...
                </p>
            </motion.div>
        </div>
    );
}
