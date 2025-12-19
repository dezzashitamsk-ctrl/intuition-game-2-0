'use client';

import React, { useRef, useMemo } from 'react';
import { Space_Grotesk } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { DifficultySelector } from './DifficultySelector';

const spaceGrotesk = Space_Grotesk({ 
    subsets: ['latin'],
    weight: ['700'],
});

const suits = Array(10).fill(['♠', '♥', '♦', '♣']).flat();

interface StartMenuProps {
    onStart: (playerCount: number) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onStart }) => {
    const titleRef = useRef<HTMLDivElement>(null);
    const [showDifficultySelector, setShowDifficultySelector] = React.useState(false);
    const [showIdleShape, setShowIdleShape] = React.useState(false);
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

    const [letterStates, setLetterStates] = React.useState(
        Array(9).fill(false)
    );

    const [clickedLetterIndex, setClickedLetterIndex] = React.useState<number | null>(null);
    const [onlineCount] = React.useState(Math.floor(Math.random() * 100) + 150);
    const version = "v1.0.0-beta";

    // Эффект для случайного "затухания" букв
    React.useEffect(() => {
        const interval = setInterval(() => {
            setLetterStates(prev => {
                if (prev.some(state => state)) {
                    return prev.map(() => false);
                }
                
                if (Math.random() > 0.7) {
                    const newStates = Array(9).fill(false);
                    const randomIndex = Math.floor(Math.random() * 9);
                    newStates[randomIndex] = true;
                    return newStates;
                }
                
                return prev;
            });
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    // Функция для сброса таймера неактивности
    const resetIdleTimer = () => {
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
        }
        if (showIdleShape) {
            setTimeout(() => {
                setShowIdleShape(false);
                idleTimerRef.current = setTimeout(() => {
                    setShowIdleShape(true);
                }, 5000);
            }, 1000);
            return;
        }
        setShowIdleShape(false);
        idleTimerRef.current = setTimeout(() => {
            setShowIdleShape(true);
        }, 5000);
    };

    // Установка слушателей событий
    React.useEffect(() => {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        const handleUserActivity = () => {
            resetIdleTimer();
        };

        events.forEach(event => {
            document.addEventListener(event, handleUserActivity);
        });

        resetIdleTimer();

        return () => {
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
            }
            events.forEach(event => {
                document.removeEventListener(event, handleUserActivity);
            });
        };
    }, [showIdleShape]);

    // Создаем массив падающих мастей
    const fallingSymbols = useMemo(() => {
        return Array.from({ length: 10 }).map((_, i) => ({
            id: i,
            symbol: ['♠', '♥', '♦', '♣'][Math.floor(Math.random() * 4)],
            x: Math.random() * 100,
            delay: Math.random() * 2,
            duration: 20 + Math.random() * 5,
            isRed: ['♥', '♦'].includes(['♠', '♥', '♦', '♣'][Math.floor(Math.random() * 4)])
        }));
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-[#111111] overflow-hidden"
            style={{ height: '100dvh' }}
        >
            {/* Фоновое изображение с сеткой */}
            <div className="fixed inset-0 -z-20 bg-[url('/grid.svg')] opacity-[0.1]" />
            
            {/* Плавающее градиентное пятно */}
            <motion.div 
                className="fixed inset-0 -z-10"
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
            
            {/* Затемнение и градиент */}
            <div className="fixed inset-0 bg-gradient-to-b from-[#111111]/90 via-[#111111]/85 to-[#111111]/90" />
            
            {/* Анимированные асти на фоне */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                {suits.map((suit, index) => (
                    <motion.div
                        key={`${suit}-${index}`}
                        className="absolute text-[1200px] font-serif opacity-[0.05]"
                        initial={{ 
                            x: Math.random() * window.innerWidth,
                            y: -200,
                            rotate: Math.random() * 360,
                            scale: 0.2
                        }}
                        animate={{ 
                            y: window.innerHeight + 200,
                            rotate: 360,
                            scale: [0.2, 0.6, 0.2]
                        }}
                        transition={{
                            duration: 30 + Math.random() * 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 10,
                            scale: {
                                duration: 20,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                        style={{
                            x: Math.random() * window.innerWidth,
                            color: ['♥', '♦'].includes(suit) ? '#CC3333' : '#333333',
                            filter: 'blur(2px)',
                            opacity: Math.random() * 0.02 + 0.01,
                            willChange: 'transform',
                            transform: 'translateZ(0)',
                            backfaceVisibility: 'hidden'
                        }}
                    >
                        {suit}
                    </motion.div>
                ))}
            </div>
            
            {/* Падающие масти */}
            <div className="fixed inset-0 pointer-events-none">
                {fallingSymbols.map((symbol) => (
                    <motion.div
                        key={symbol.id}
                        className={`absolute text-6xl ${['♥', '♦'].includes(symbol.symbol) ? 'text-[#CC3333]/30' : 'text-[#333333]/30'}`}
                        initial={{ 
                            x: `${symbol.x}vw`, 
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
                            duration: symbol.duration,
                            delay: symbol.delay,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            willChange: 'transform',
                            transform: 'translateZ(0)',
                            backfaceVisibility: 'hidden'
                        }}
                    >
                        {symbol.symbol}
                    </motion.div>
                ))}
            </div>
            
            {/* Верхняя информация */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="fixed top-4 left-0 right-0 flex items-center justify-between px-4"
            >
                <div className="flex items-center space-x-3 text-[#FFF1F2]/20 text-xs tracking-wider">
                    <span>{version}</span>
                    <span className="w-1 h-1 rounded-full bg-[#FFF1F2]/10" />
                    <div className="flex items-center space-x-1.5">
                        <span className="w-1 h-1 bg-green-500/50 rounded-full" />
                        <span>{onlineCount} players</span>
                    </div>
                </div>
            </motion.div>

            {/* Основной контент */}
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="w-full max-w-[90vw] relative z-10">
                    {/* Заголовок */}
                    <motion.div 
                        animate={{
                            opacity: showDifficultySelector ? 0 : 1
                        }}
                        transition={{
                            duration: 0.2
                        }}
                        className="flex flex-col items-center justify-center"
                    >
                        <div ref={titleRef} className={`${spaceGrotesk.className} w-full relative`}>
                            {/* Светящееся пятно за названием */}
                            <motion.div 
                                className="absolute top-[-85%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-[50%] aspect-square -z-10"
                                animate={{
                                    x: ['-3%', '3%', '-3%'],
                                    y: ['-3%', '3%', '-3%'],
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

                            <motion.h1 
                                className="relative text-[20vw] md:text-[15vw] lg:text-[12vw] xl:text-[10vw] font-bold mb-4 tracking-[-0.02em] leading-none text-center"
                                animate={{
                                    opacity: showDifficultySelector ? 0 : 1,
                                    y: [0, -5, 0],
                                    x: [0, 3, 0]
                                }}
                                transition={{
                                    opacity: { duration: 0.2 },
                                    y: {
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    },
                                    x: {
                                        duration: 10,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                }}
                            >
                                <div className="flex justify-center items-center">
                                    {'INTUITION'.split('').map((letter, index) => (
                                        <motion.span
                                            key={index}
                                            className={`
                                                bg-gradient-to-b bg-clip-text text-transparent 
                                                drop-shadow-[0_0_15px_rgba(229,231,235,0.3)]
                                                cursor-pointer transition-all duration-200
                                                ${clickedLetterIndex === index 
                                                    ? 'from-[#FFEEB3] to-[#FFEEB3]/90 drop-shadow-[0_0_15px_rgba(255,238,179,0.3)]'
                                                    : 'from-[#E5E7EB] to-[#E5E7EB]/70 hover:from-[#FFEEB3] hover:to-[#FFEEB3]/90 hover:drop-shadow-[0_0_15px_rgba(255,238,179,0.3)]'
                                                }
                                            `}
                                            animate={{
                                                opacity: letterStates[index] ? 0 : 1,
                                                textShadow: letterStates[index] 
                                                    ? "0 0 0px rgba(255,241,242,0)"
                                                    : "0 0 20px rgba(255,241,242,0.3)"
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                ease: "easeInOut"
                                            }}
                                            whileHover={{
                                                scale: 1.1,
                                            }}
                                            whileTap={{
                                                scale: 0.95,
                                            }}
                                            onClick={() => {
                                                setClickedLetterIndex(
                                                    clickedLetterIndex === index ? null : index
                                                );
                                            }}
                                        >
                                            {letter}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.h1>
                        </div>
                        <motion.p 
                            className="text-sm md:text-base text-[#FFF1F2]/60 font-normal tracking-[0.1em] mt-4 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            Test your card prediction abilities
                        </motion.p>
                    </motion.div>

                    {/* Кнопки */}
                    <div className="mt-12 space-y-3 px-4 md:px-0 max-w-md mx-auto">
                        <AnimatePresence mode="wait">
                            {!showDifficultySelector ? (
                                <motion.div
                                    key="main-menu"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <motion.button
                                        key="two-players"
                                        onClick={() => onStart(2)}
                                        className="w-full p-4 relative overflow-hidden rounded-2xl
                                                bg-[#1A1A1A] hover:bg-[#1F1F1F]
                                                shadow-[0_8px_16px_rgba(0,0,0,0.4)]
                                                border border-[#2A2A2A] hover:border-[#333333]
                                                group transition-all duration-300"
                                    >
                                        <div className="relative flex items-center justify-between px-4">
                                            <span className="text-3xl text-[#CC3333]/30 font-serif">♥</span>
                                            <span className="flex-grow text-center text-[#E5E7EB]/80 tracking-[0.2em] uppercase text-xl font-medium">
                                                Two Players
                                            </span>
                                            <span className="text-3xl text-[#CC3333]/30 font-serif">♥</span>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        key="play-with-bot"
                                        onClick={() => setShowDifficultySelector(true)}
                                        className="w-full p-4 relative overflow-hidden rounded-2xl mt-3
                                                bg-[#1A1A1A] hover:bg-[#1F1F1F]
                                                shadow-[0_8px_16px_rgba(0,0,0,0.4)]
                                                border border-[#2A2A2A] hover:border-[#333333]
                                                group transition-all duration-300"
                                    >
                                        <div className="relative flex items-center justify-between px-4">
                                            <span className="text-3xl text-[#333333]/30 font-serif">♠</span>
                                            <span className="flex-grow text-center text-[#E5E7EB]/80 tracking-[0.2em] uppercase text-xl font-medium">
                                                Play with Bot
                                            </span>
                                            <span className="text-3xl text-[#333333]/30 font-serif">♠</span>
                                        </div>
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="difficulty-selector"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <DifficultySelector
                                        onSelect={() => {
                                            setShowDifficultySelector(false);
                                            onStart(1);
                                        }}
                                        onClose={() => setShowDifficultySelector(false)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Нижняя информация */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="fixed bottom-4 left-0 right-0 flex items-center justify-center gap-6"
            >
                <div className="flex items-center gap-4 text-[#FFF1F2]/20 text-xs tracking-wider">
                    <motion.a 
                        href="#" 
                        className="hover:text-[#FFF1F2]/40 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        About
                    </motion.a>
                    <span>·</span>
                    <motion.a 
                        href="#" 
                        className="hover:text-[#FFF1F2]/40 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Privacy
                    </motion.a>
                    <span>·</span>
                    <motion.a 
                        href="#" 
                        className="hover:text-[#FFF1F2]/40 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Terms
                    </motion.a>
                </div>
                <span className="text-[#FFF1F2]/20">|</span>
                <div className="flex items-center gap-1.5 text-[#FFF1F2]/20 text-xs tracking-wider">
                    <span>Made by</span>
                    <motion.span 
                        className="text-[#FFF1F2]/30 font-medium"
                        whileHover={{ scale: 1.05 }}
                    >
                        Intuition Game Team
                    </motion.span>
                </div>
            </motion.div>

            {/* Кнопка настроек */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="fixed bottom-4 right-4 p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {/* TODO: Add settings handler */}}
            >
                <svg className="w-5 h-5 text-[#FFF1F2]/20 hover:text-[#FFF1F2]/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </motion.button>
        </motion.div>
    );
}; 