'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReconnectedToastProps {
    show: boolean;
    onClose: () => void;
}

export function ReconnectedToast({ show, onClose }: ReconnectedToastProps) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 3000); // Auto-close after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-8 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="glass-dark rounded-2xl px-6 py-4 border-2 border-green-500/50 shadow-2xl">
                        <div className="flex items-center gap-3">
                            {/* Success Icon */}
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <span className="text-2xl">✅</span>
                            </div>

                            {/* Message */}
                            <div>
                                <div className="text-lg font-bold text-green-400">
                                    Игрок вернулся!
                                </div>
                                <div className="text-sm text-gray-400">
                                    Игра продолжается
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
