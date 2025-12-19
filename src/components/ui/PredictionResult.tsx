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
                glass-dark rounded-3xl p-6 shadow-xl h-[400px] flex flex-col
                relative overflow-hidden
                ${result.correct ? 'glow-green' : ''}
            `}>
                {/* Gradient overlay */}
                <div className={`
                    absolute inset-0 opacity-10
                    ${result.correct ? 'bg-gradient-to-br from-green-500/30 to-transparent' : 'bg-gradient-to-br from-red-500/30 to-transparent'}
                `} />

                {/* Контент */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Заголовок с иконкой */}
                    <div className="flex items-center gap-4 mb-6">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", delay: 0.1 }}
                            className="text-5xl"
                        >
                            {result.correct ? '✅' : '❌'}
                        </motion.div>
                        <h3 className={`text-3xl font-bold font-[family-name:var(--font-orbitron)] ${result.correct ? 'text-green-400' : 'text-red-400'}`}>
                            {result.correct ? 'Правильно!' : 'Неправильно!'}
                        </h3>
                    </div>

                    {/* Информация */}
                    <div className="space-y-4 flex-1">
                        {/* Предсказание */}
                        <div className="flex items-center justify-between glass-dark rounded-xl p-4 border-2 border-white/10">
                            <span className="text-gray-400 text-base">Ваш выбор:</span>
                            <span className="text-white font-bold text-xl">{getPredictionText()}</span>
                        </div>

                        {/* Результат */}
                        <div className="flex items-center justify-between glass-dark rounded-xl p-4 border-2 border-white/10">
                            <span className="text-gray-400 text-base">Результат:</span>
                            <span className="text-white font-bold text-xl">{getActualText()}</span>
                        </div>

                        {/* Очки - ФИКСИРОВАННАЯ ОБЛАСТЬ */}
                        <div className="flex-1 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                {result.correct && (
                                    <motion.div
                                        key="points"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex items-center justify-between glass-dark rounded-xl p-5 w-full border-2 border-green-400/30"
                                    >
                                        <div className="flex items-center gap-3">
                                            <motion.span
                                                animate={{ rotate: [0, 360] }}
                                                transition={{ duration: 0.5, delay: 0.3 }}
                                                className="text-3xl"
                                            >
                                                ⭐
                                            </motion.span>
                                            <span className="text-white font-medium text-lg">Получено очков:</span>
                                        </div>
                                        <span className="text-4xl font-bold text-green-400 font-[family-name:var(--font-orbitron)]">
                                            +{result.totalPoints}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Анимированная полоса */}
                {result.correct && (
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{ transformOrigin: 'left' }}
                    />
                )}
            </div>
        </motion.div>
    );
};