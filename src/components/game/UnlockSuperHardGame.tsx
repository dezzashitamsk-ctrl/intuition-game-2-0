'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

interface UnlockSuperHardGameProps {
    onUnlock: () => void;
    onClose: () => void;
}

export const UnlockSuperHardGame: React.FC<UnlockSuperHardGameProps> = ({
    onUnlock,
    onClose
}) => {
    const [gameState, setGameState] = useState<'instruction' | 'selecting' | 'waiting' | 'showing' | 'result'>('instruction');
    const [selectedPosition, setSelectedPosition] = useState<{ x: number; y: number } | null>(null);
    const [targetPosition, setTargetPosition] = useState<{ x: number; y: number } | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const gameFieldRef = useRef<HTMLDivElement>(null);

    // Генерируем случайную позицию для появления символа
    const generateRandomPosition = useCallback(() => {
        if (gameFieldRef.current) {
            const rect = gameFieldRef.current.getBoundingClientRect();
            const padding = 50;
            const maxWidth = rect.width - padding * 2;
            const maxHeight = rect.height - padding * 2;
            return {
                x: Math.random() * maxWidth + padding,
                y: Math.random() * maxHeight + padding
            };
        }
        return { x: 0, y: 0 };
    }, []);

    // Чит для разработчика (Alt + U)
    React.useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.altKey && e.key.toLowerCase() === 'u') {
                onUnlock();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [onUnlock]);

    // Обработчик клика по экрану для выбора позиции
    const handleScreenClick = useCallback((e: React.MouseEvent) => {
        if (gameState === 'selecting' && gameFieldRef.current) {
            const rect = gameFieldRef.current.getBoundingClientRect();
            const position = { 
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            setSelectedPosition(position);
            setGameState('waiting');
            
            const target = generateRandomPosition();
            setTargetPosition(target);

            const showDelay = 1000 + Math.random() * 2000;
            setTimeout(() => {
                if (target) {
                    setGameState('showing');
                    
                    const distance = Math.sqrt(
                        Math.pow(position.x - target.x, 2) + 
                        Math.pow(position.y - target.y, 2)
                    );
                    
                    const success = distance < 100;
                    setIsSuccess(success);
                    
                    setTimeout(() => {
                        setGameState('result');
                        if (success) {
                            setTimeout(onUnlock, 2000);
                        }
                    }, 1000);
                }
            }, showDelay);
        }
    }, [gameState, generateRandomPosition, onUnlock]);

    return (
        <div 
            ref={gameFieldRef}
            className="fixed inset-0 z-50"
            onClick={handleScreenClick}
        >
            {/* Фоновое изображение с сеткой */}
            <div className="absolute inset-0 -z-20 bg-[url('/grid.svg')] opacity-[0.15]"></div>
            
            {/* Затемнение и градиент */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/90 via-[#111111]/70 to-[#111111]/90 backdrop-blur-sm"></div>

            {/* Основной контент */}
            <div className="relative h-full">
                {/* Инструкция */}
                {gameState === 'instruction' && (
                    <motion.div 
                        key="instruction"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <h2 className="text-2xl text-[#FFF1F2] mb-4">
                            Unlock Super Hard Mode
                        </h2>
                        <p className="text-[#FFF1F2]/70 mb-8 max-w-md">
                            Click where you think the ♣ will appear. 
                            If you guess correctly, you'll unlock the Super Hard mode!
                        </p>
                        <div className="space-x-4">
                            <button
                                onClick={() => setGameState('selecting')}
                                className="px-6 py-2 rounded-lg bg-[#1A1A1A] text-[#FFF1F2]/90 hover:bg-[#1E1E1E] transition-colors border border-[#2A2A2A]"
                            >
                                Start
                            </button>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg bg-transparent text-[#FFF1F2]/50 hover:text-[#FFF1F2]/90 transition-colors border border-[#2A2A2A]"
                            >
                                Back
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Выбранная позиция */}
                {selectedPosition && gameState !== 'result' && (
                    <motion.div
                        key="selected-position"
                        className="absolute w-8 h-8 border-2 border-[#FFF1F2]/50 rounded-full"
                        style={{
                            left: selectedPosition.x - 16,
                            top: selectedPosition.y - 16
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                    />
                )}

                {/* Символ */}
                {targetPosition && gameState === 'showing' && (
                    <motion.div
                        key="target-symbol"
                        className={`absolute text-4xl ${isSuccess ? 'text-[#10B981]' : 'text-[#FFF1F2]'}`}
                        style={{
                            left: targetPosition.x - 16,
                            top: targetPosition.y - 16
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                    >
                        ♣
                    </motion.div>
                )}

                {/* Результат */}
                {gameState === 'result' && (
                    <motion.div
                        key="result"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <h3 className="text-xl text-[#FFF1F2] mb-2">
                            {isSuccess ? 'Super Hard Mode Unlocked!' : 'Try Again!'}
                        </h3>
                        <p className="text-[#FFF1F2]/70 mb-6">
                            {isSuccess 
                                ? 'Get ready for the ultimate challenge!'
                                : 'Keep trying to improve your intuition.'}
                        </p>
                        {!isSuccess && (
                            <div className="space-x-4">
                                <button
                                    onClick={() => setGameState('selecting')}
                                    className="px-6 py-2 rounded-lg bg-[#1A1A1A] text-[#FFF1F2]/90 hover:bg-[#1E1E1E] transition-colors border border-[#2A2A2A]"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 rounded-lg bg-transparent text-[#FFF1F2]/50 hover:text-[#FFF1F2]/90 transition-colors border border-[#2A2A2A]"
                                >
                                    Back
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Подсказка во время выбора */}
                {gameState === 'selecting' && (
                    <motion.div
                        key="selecting-hint"
                        className="absolute top-8 left-1/2 -translate-x-1/2 text-[#FFF1F2]/50 text-sm"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        Click anywhere on the screen
                    </motion.div>
                )}
            </div>
        </div>
    );
}; 