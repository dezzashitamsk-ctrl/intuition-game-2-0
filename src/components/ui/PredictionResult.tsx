'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Prediction, PredictionResult as PredictionResultType } from '../../types/game';
import { SUITS } from '../../constants/game';

interface PredictionResultProps {
    prediction: Prediction;
    actual: Card;
    result: PredictionResultType;
    chipsWon: number;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({
    prediction,
    actual,
    result,
    chipsWon
}) => {
    // Звук теперь проигрывается в Game.tsx синхронно с переворотом карты

    const getPredictionText = () => {
        switch (prediction.mode) {
            case 'color':
                return `${prediction.color === 'red' ? '🔴 Красный' : '⚫ Чёрный'}`;
            case 'suit':
                return `${SUITS[prediction.suit!].icon} ${SUITS[prediction.suit!].text}`;
            case 'rank':
                return `🎯 ${prediction.rank}`;
            case 'full':
                return `${SUITS[prediction.suit!].icon} ${prediction.rank}`;
            default:
                return '';
        }
    };

    const getActualText = () => {
        switch (prediction.mode) {
            case 'color':
                return `${actual.color === 'red' ? '🔴 Красный' : '⚫ Чёрный'}`;
            case 'suit':
                return `${SUITS[actual.suit].icon} ${SUITS[actual.suit].text}`;
            case 'rank':
                return `🎯 ${actual.rank}`;
            case 'full':
                return `${SUITS[actual.suit].icon} ${actual.rank}`;
            default:
                return '';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col gap-4"
        >
            <div className={`
                glass-dark rounded-3xl p-4 md:p-6 shadow-xl 
                h-auto md:h-[400px] 
                flex flex-col
                relative overflow-hidden
                transition-shadow duration-500
                ${result.correct
                    ? 'shadow-[0_0_40px_rgba(34,197,94,0.4)] border-2 border-green-500/30'
                    : 'shadow-[0_0_40px_rgba(239,68,68,0.4)] border-2 border-red-500/30'
                }
            `}>
                {/* Gradient overlay */}
                <div className={`
                    absolute inset-0 opacity-10
                    ${result.correct ? 'bg-gradient-to-br from-green-500/30 to-transparent' : 'bg-gradient-to-br from-red-500/30 to-transparent'}
                `} />

                {/* Контент */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Информация */}
                    <div className="space-y-2 md:space-y-4 flex-1">
                        {/* Предсказание */}
                        <div className="flex items-center justify-between glass-dark rounded-xl p-3 md:p-4 border-2 border-white/10">
                            {/* Мобильная версия - только иконка */}
                            <span className="md:hidden text-2xl" title="Ваш выбор">👤</span>
                            {/* Десктоп версия - текст */}
                            <span className="hidden md:inline text-gray-400 text-base">Ваш выбор:</span>
                            <span className="text-white font-bold text-lg md:text-xl">{getPredictionText()}</span>
                        </div>

                        {/* Результат */}
                        <div className="flex items-center justify-between glass-dark rounded-xl p-3 md:p-4 border-2 border-white/10">
                            {/* Мобильная версия - только иконка */}
                            <span className="md:hidden text-2xl" title="Результат">🎴</span>
                            {/* Десктоп версия - текст */}
                            <span className="hidden md:inline text-gray-400 text-base">Результат:</span>
                            <span className="text-white font-bold text-lg md:text-xl">{getActualText()}</span>
                        </div>

                        {/* Очки - ВСЕГДА ПОКАЗЫВАЕМ */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`flex items-center justify-between glass-dark rounded-xl p-3 md:p-5 w-full border-2 ${result.correct ? 'border-green-400/30' : 'border-red-400/20'
                                }`}
                        >
                            <div className="flex items-center gap-2 md:gap-3">
                                <motion.span
                                    animate={result.correct ? { rotate: [0, 360] } : {}}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="text-2xl md:text-3xl"
                                >
                                    ⭐
                                </motion.span>
                                {/* Мобильная версия - без текста */}
                                <span className="hidden md:inline text-white font-medium text-lg">Получено очков:</span>
                            </div>
                            <span className={`text-3xl md:text-4xl font-bold font-[family-name:var(--font-orbitron)] ${result.correct ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {result.correct ? `+${result.totalPoints}` : '+0'}
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};