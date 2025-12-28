'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PredictionForm } from './PredictionForm';
import type { Prediction } from '../../types/game';
import { useSound } from '../../hooks/useSound';

interface CollapsiblePredictionPanelProps {
    onSubmit: (prediction: Prediction) => void;
    onChange?: (prediction: Prediction) => void;
    disabled?: boolean;
}

export const CollapsiblePredictionPanel: React.FC<CollapsiblePredictionPanelProps> = ({
    onSubmit,
    onChange,
    disabled
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { playSound } = useSound();

    const handleOpen = () => {
        if (disabled) return;
        playSound();
        setIsOpen(true);
    };

    const handleClose = () => {
        playSound();
        setIsOpen(false);
    };

    const handleSubmit = (prediction: Prediction) => {
        onSubmit(prediction);
        // Auto-close after submission
        setTimeout(() => {
            setIsOpen(false);
        }, 300);
    };

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    return (
        <>
            {/* Floating Action Button (FAB) - только на мобильных, под кнопкой выхода */}
            <motion.button
                onClick={handleOpen}
                disabled={disabled}
                className={`
                    md:hidden absolute top-20 -right-4 z-40
                    w-16 h-16 rounded-full
                    bg-gradient-to-br from-blue-500 to-purple-600
                    border-2 border-blue-400/50
                    shadow-[0_0_30px_rgba(59,130,246,0.5)]
                    hover:shadow-[0_0_50px_rgba(59,130,246,0.8)]
                    hover:scale-110
                    active:scale-95
                    transition-all duration-300
                    flex items-center justify-center
                    ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                `}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                animate={!disabled ? {
                    scale: [1, 1.1, 1],
                    boxShadow: [
                        '0 0 30px rgba(59,130,246,0.5)',
                        '0 0 50px rgba(59,130,246,0.8)',
                        '0 0 30px rgba(59,130,246,0.5)'
                    ]
                } : {}}
                transition={!disabled ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                } : {}}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-white"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                    />
                </svg>
            </motion.button>

            {/* Backdrop + Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop - затемнение фона */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={handleClose}
                            className="md:hidden absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-8 p-4"
                        >
                            {/* Panel - клик на панели не закрывает её */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{
                                    type: 'spring',
                                    damping: 25,
                                    stiffness: 300
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-md max-h-[85vh] overflow-y-auto"
                            >
                                {/* Panel Header */}
                                <div className="glass-dark border-2 border-blue-500/30 rounded-t-3xl p-4 pb-2">
                                    <div className="flex items-center justify-between mb-2">
                                        {/* Title */}
                                        <h3 className="flex-1 text-xl font-bold text-center text-white font-[family-name:var(--font-orbitron)]">
                                            Сделайте выбор
                                        </h3>

                                        {/* Close Button */}
                                        <button
                                            onClick={handleClose}
                                            className="
                                                w-10 h-10 rounded-full
                                                bg-gradient-to-br from-red-500/20 to-red-500/10
                                                border-2 border-red-500/40
                                                hover:border-red-500
                                                hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]
                                                transition-all duration-300
                                                flex items-center justify-center
                                            "
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2.5}
                                                stroke="currentColor"
                                                className="w-5 h-5 text-red-400"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Panel Content */}
                                <div className="glass-dark px-4 pb-6 rounded-b-3xl">
                                    <PredictionForm
                                        onSubmit={handleSubmit}
                                        onChange={onChange}
                                        disabled={disabled}
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
