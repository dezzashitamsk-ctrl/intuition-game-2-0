'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
    variant?: 'menu' | 'game';
}

const suits = ['♠', '♥', '♦', '♣'];

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
    variant = 'game'
}) => {
    // Создаем массив падающих символов
    const fallingSymbols = useMemo(() => {
        const count = variant === 'menu' ? 20 : 12;
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            symbol: suits[Math.floor(Math.random() * suits.length)],
            x: Math.random() * 100,
            duration: 15 + Math.random() * 10,
            delay: Math.random() * 10,
            size: variant === 'menu' ? 'text-6xl' : 'text-4xl'
        }));
    }, [variant]);

    // Большие фоновые символы
    const backgroundSymbols = useMemo(() => {
        const count = variant === 'menu' ? 15 : 8;
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            symbol: suits[Math.floor(Math.random() * suits.length)],
            x: Math.random() * 100,
            y: Math.random() * 100,
            rotation: Math.random() * 360,
            scale: 0.2 + Math.random() * 0.4,
            duration: 30 + Math.random() * 10,
            delay: Math.random() * 10
        }));
    }, [variant]);

    return (
        <>
            {/* Большие фоновые символы */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                {backgroundSymbols.map((item) => {
                    const isRed = ['♥', '♦'].includes(item.symbol);
                    return (
                        <motion.div
                            key={`bg-${item.id}`}
                            className="absolute text-[1200px] font-serif"
                            initial={{
                                x: `${item.x}vw`,
                                y: `${item.y}vh`,
                                rotate: item.rotation,
                                scale: item.scale
                            }}
                            animate={{
                                rotate: [item.rotation, item.rotation + 360],
                                scale: [item.scale, item.scale + 0.2, item.scale]
                            }}
                            transition={{
                                duration: item.duration,
                                repeat: Infinity,
                                ease: "linear",
                                delay: item.delay,
                                scale: {
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                            style={{
                                color: isRed ? 'var(--suit-red)' : 'var(--suit-black)',
                                filter: 'blur(2px)',
                                opacity: 0.02,
                                willChange: 'transform',
                                transform: 'translateZ(0)',
                                backfaceVisibility: 'hidden'
                            }}
                        >
                            {item.symbol}
                        </motion.div>
                    );
                })}
            </div>

            {/* Падающие символы */}
            <div className="fixed inset-0 pointer-events-none">
                {fallingSymbols.map((item) => {
                    const isRed = ['♥', '♦'].includes(item.symbol);
                    return (
                        <motion.div
                            key={`fall-${item.id}`}
                            className={`absolute ${item.size}`}
                            initial={{
                                x: `${item.x}vw`,
                                y: -50,
                                rotate: 0,
                                opacity: 0.2
                            }}
                            animate={{
                                y: '120vh',
                                rotate: 360,
                                opacity: [0.2, 0.4, 0.2]
                            }}
                            transition={{
                                duration: item.duration,
                                delay: item.delay,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{
                                color: isRed ? 'var(--suit-red)' : 'var(--suit-black)',
                                opacity: 0.3,
                                willChange: 'transform',
                                transform: 'translateZ(0)',
                                backfaceVisibility: 'hidden'
                            }}
                        >
                            {item.symbol}
                        </motion.div>
                    );
                })}
            </div>
        </>
    );
};
