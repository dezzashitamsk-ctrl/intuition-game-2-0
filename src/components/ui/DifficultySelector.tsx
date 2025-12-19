'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BotDifficulty } from '../../types/bot';
import { UnlockSuperHardGame } from '../game/UnlockSuperHardGame';

interface DifficultySelectorProps {
    onSelect: (difficulty: BotDifficulty) => void;
    onClose: () => void;
}

const difficultyConfig = {
    easy: {
        text: "EASY",
        symbol: "♦",
        color: "#CC3333",
        description: "Predict card color"
    },
    medium: {
        text: "MEDIUM",
        symbol: "♣",
        color: "#333333",
        description: "Predict card suit"
    },
    hard: {
        text: "HARD",
        symbol: "♥",
        color: "#CC3333",
        description: "Predict card value"
    },
    superHard: {
        text: "SUPER HARD",
        symbol: "♠",
        color: "#333333",
        description: "Predict exact card",
        locked: true
    }
};

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    }
};

const item = {
    hidden: { 
        opacity: 0,
        y: 20
    },
    show: { 
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.2,
            ease: "easeIn"
        }
    }
};

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
    onSelect,
    onClose
}) => {
    const [showUnlockGame, setShowUnlockGame] = useState(false);
    const [isSuperHardUnlocked, setIsSuperHardUnlocked] = useState(false);

    const handleDifficultyClick = (difficulty: BotDifficulty) => {
        if (difficulty === 'superHard' && !isSuperHardUnlocked) {
            setShowUnlockGame(true);
            return;
        }
        onSelect(difficulty);
    };

    const handleUnlockSuccess = () => {
        setShowUnlockGame(false);
        setIsSuperHardUnlocked(true);
        onSelect('superHard');
    };

    return (
        <motion.div
            key="difficulty-selector-container"
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
            <motion.div 
                className="absolute inset-0 bg-[#111111]/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <motion.div 
                    className="absolute inset-0 -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <motion.div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh]"
                        animate={{
                            x: ['-2%', '2%', '-2%'],
                            y: ['-2%', '2%', '-2%'],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.5, 1]
                        }}
                    >
                        <div className="w-full h-full bg-gradient-radial from-[#FFEEB3]/[0.03] via-transparent to-transparent
                                    filter blur-[100px] mix-blend-soft-light" />
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                exit="exit"
                className="relative w-full max-w-[90vw] md:max-w-[320px] mx-auto space-y-3 perspective-[1000px]"
            >
                {Object.entries(difficultyConfig).map(([key, config], index) => {
                    const isLocked = key === 'superHard' && !isSuperHardUnlocked;
                    return (
                        <motion.button
                            key={key}
                            variants={item}
                            custom={index}
                            onClick={() => handleDifficultyClick(key as BotDifficulty)}
                            whileHover="hover"
                            whileTap="tap"
                            className={`w-full p-4 relative overflow-hidden rounded-2xl
                                    bg-[#1A1A1A] hover:bg-[#1E1E1E]
                                    shadow-[0_8px_16px_rgba(0,0,0,0.5)]
                                    border border-[#2A2A2A]
                                    group transition-all duration-300
                                    hover:shadow-[0_12px_24px_rgba(0,0,0,0.6)]
                                    hover:border-[#3A3A3A]
                                    transform-style-3d preserve-3d`}
                        >
                            <motion.div 
                                className="absolute inset-0 w-full h-full"
                                animate={{
                                    opacity: [0.015, 0.03, 0.015],
                                    scale: [0.98, 1.02, 0.98],
                                }}
                                transition={{
                                    duration: 15,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    times: [0, 0.5, 1]
                                }}
                            >
                                <div className="absolute inset-0 bg-[#FFEEB3] rounded-full opacity-[0.015] blur-[35px] mix-blend-soft-light" />
                                <div className="absolute inset-0 bg-[#FFEEB3] rounded-full opacity-[0.01] blur-[45px] mix-blend-soft-light translate-x-[10%]" />
                                <div className="absolute inset-0 bg-[#FFEEB3] rounded-full opacity-[0.008] blur-[55px] mix-blend-soft-light translate-x-[-10%]" />
                            </motion.div>

                            <div className="relative flex items-center justify-between px-4 perspective-[1000px]">
                                <span 
                                    className="text-3xl font-serif opacity-40"
                                    style={{ color: config.color }}
                                >
                                    {config.symbol}
                                </span>
                                <div className="flex-grow text-center">
                                    <span className="text-[#FFF1F2]/90 tracking-[0.2em] uppercase text-xl font-medium block">
                                        {config.text}
                                    </span>
                                    {isLocked && (
                                        <span className="block text-[#FFEEB3] text-sm tracking-[0.2em] mt-1">
                                            LOCKED
                                        </span>
                                    )}
                                </div>
                                <span 
                                    className="text-3xl font-serif opacity-40"
                                    style={{ color: config.color }}
                                >
                                    {config.symbol}
                                </span>
                            </div>
                        </motion.button>
                    );
                })}

                <motion.button
                    variants={item}
                    onClick={onClose}
                    className="w-full p-4 relative overflow-hidden rounded-2xl mt-6
                            bg-transparent hover:bg-[#1E1E1E]/10
                            border border-[#2A2A2A]
                            text-[#FFF1F2]/50 hover:text-[#FFF1F2]/90
                            tracking-[0.2em] uppercase
                            transition-all duration-300"
                >
                    ← Back
                </motion.button>
            </motion.div>

            <AnimatePresence>
                {showUnlockGame && (
                    <UnlockSuperHardGame
                        onUnlock={handleUnlockSuccess}
                        onClose={() => setShowUnlockGame(false)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}; 