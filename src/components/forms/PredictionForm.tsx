'use client';

import React, { useState } from 'react';
import { CardRank, CardSuit, CardColor, Prediction } from '../../types/card';
import { GAME_MODES, SUITS, RANKS, COLORS } from '../../constants/game';
import { useSound } from '../../hooks/useSound';

interface PredictionFormProps {
    onSubmit: (prediction: Prediction) => void;
    disabled?: boolean;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, disabled }) => {
    const [mode, setMode] = useState<'color' | 'suit' | 'rank' | 'full' | null>(null);
    const [prediction, setPrediction] = useState<Prediction>({ mode: null });
    const { playSound } = useSound();

    const handleModeChange = (newMode: 'color' | 'suit' | 'rank' | 'full') => {
        if (disabled) return;
        playSound();
        setMode(newMode);
        setPrediction({ mode: newMode });
    };

    const handleSubmit = () => {
        if (disabled) return;
        if (canSubmit()) {
            playSound();
            onSubmit(prediction);
            setMode(null);
            setPrediction({ mode: null });
        }
    };

    const canSubmit = () => {
        if (!prediction.mode || disabled) return false;

        switch (prediction.mode) {
            case 'color':
                return !!prediction.color;
            case 'suit':
                return !!prediction.suit;
            case 'rank':
                return !!prediction.rank;
            case 'full':
                return !!prediction.suit && !!prediction.rank;
            default:
                return false;
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="glass-dark rounded-3xl p-4 md:p-6 shadow-xl h-[400px] flex flex-col">{/* Фиксированная высота */}
                {/* Кнопка Назад - Круглая стрелка в левом углу */}
                {mode && (
                    <button
                        onClick={() => {
                            if (disabled) return;
                            playSound();
                            setMode(null);
                            setPrediction({ mode: null });
                        }}
                        disabled={disabled}
                        className={`absolute top-4 left-4 z-20
                                  w-12 h-12 rounded-full
                                  bg-gradient-to-br from-blue-500/20 to-blue-500/10
                                  border-2 border-blue-500/40
                                  hover:border-blue-500
                                  hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]
                                  hover:scale-110
                                  active:scale-95
                                  transition-all duration-300
                                  flex items-center justify-center group
                                  ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-blue-400 transform 
                                     transition-transform duration-300 
                                     group-hover:-translate-x-0.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                            />
                        </svg>
                    </button>
                )}

                {/* Основной контент */}
                <div className="flex-1 overflow-visible">{/* Изменено с overflow-hidden */}
                    {/* Выбор режима предсказания - ПРЕМИУМ ДИЗАЙН */}
                    {!mode && (
                        <div className="grid grid-cols-2 gap-4 h-full">
                            {Object.entries(GAME_MODES).map(([key, { icon, text, points, description }]) => {
                                // Цветовая схема для каждого режима
                                const colorSchemes = {
                                    color: {
                                        gradient: 'from-red-500/20 via-pink-500/15 to-red-500/10',
                                        border: 'border-red-500/30 hover:border-red-500',
                                        glow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]',
                                        text: 'text-red-400'
                                    },
                                    suit: {
                                        gradient: 'from-purple-500/20 via-indigo-500/15 to-purple-500/10',
                                        border: 'border-purple-500/30 hover:border-purple-500',
                                        glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]',
                                        text: 'text-purple-400'
                                    },
                                    rank: {
                                        gradient: 'from-blue-500/20 via-cyan-500/15 to-blue-500/10',
                                        border: 'border-blue-500/30 hover:border-blue-500',
                                        glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]',
                                        text: 'text-blue-400'
                                    },
                                    full: {
                                        gradient: 'from-yellow-500/20 via-orange-500/15 to-yellow-500/10',
                                        border: 'border-yellow-500/30 hover:border-yellow-500',
                                        glow: 'hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]',
                                        text: 'text-yellow-400'
                                    }
                                };

                                const scheme = colorSchemes[key as keyof typeof colorSchemes];

                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleModeChange(key as 'color' | 'suit' | 'rank' | 'full')}
                                        className={`
                                            glass-dark rounded-2xl 
                                            p-4 md:p-5 lg:p-6
                                            bg-gradient-to-br ${scheme.gradient}
                                            border-2 ${scheme.border}
                                            ${scheme.glow}
                                            hover:scale-[1.05]
                                            hover:rotate-1
                                            active:scale-[0.98]
                                            transition-all duration-300
                                            flex flex-col items-center justify-center 
                                            gap-2 md:gap-2.5 lg:gap-3
                                            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                        `}
                                        disabled={disabled}
                                    >
                                        {/* Название - Orbitron */}
                                        <div className="text-lg md:text-base lg:text-xl font-bold text-white font-[family-name:var(--font-orbitron)]">
                                            {text}
                                        </div>

                                        {/* Очки - ЯРКИЕ с градиентом */}
                                        <div className={`text-2xl md:text-xl lg:text-3xl font-extrabold ${scheme.text} font-[family-name:var(--font-orbitron)]`}>
                                            +{points} очков
                                        </div>

                                        {/* Описание - показываем на md+ с меньшим текстом */}
                                        <div className="text-[10px] md:text-[9px] lg:text-xs text-gray-400 text-center leading-tight md:leading-snug hidden md:block">
                                            {description}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Выбор цвета */}
                    {mode === 'color' && (
                        <div className="grid grid-cols-2 gap-4 h-full">
                            {Object.entries(COLORS).map(([color, { icon, text }]) => (
                                <button
                                    key={color}
                                    onClick={() => { playSound(); setPrediction({ ...prediction, color: color as CardColor }); }}
                                    className={`
                                        glass-dark rounded-2xl p-6
                                        hover:scale-105 transition-all duration-300
                                        flex flex-col items-center justify-center
                                        border-2
                                        ${prediction.color === color
                                            ? color === 'red'
                                                ? 'border-red-500 glow-red'
                                                : 'border-transparent glow-gray'
                                            : color === 'red'
                                                ? 'border-red-500/30 hover:glow-red'
                                                : 'border-transparent hover:glow-gray'}
                                    `}
                                >
                                    <span className="text-6xl mb-3">{icon}</span>
                                    <span className="text-base font-medium text-white">{text}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Выбор масти */}
                    {mode === 'suit' && (
                        <div className="grid grid-cols-2 gap-4 h-full">
                            {Object.entries(SUITS).map(([suit, { icon, text, color }]) => {
                                const isRed = suit === 'hearts' || suit === 'diamonds';
                                return (
                                    <button
                                        key={suit}
                                        onClick={() => {
                                            playSound();
                                            setPrediction({
                                                ...prediction,
                                                suit: suit as CardSuit,
                                                color: isRed ? 'red' : 'black'
                                            });
                                        }}
                                        className={`
                                            glass-dark rounded-2xl p-6
                                            hover:scale-105 hover:rotate-3 transition-all duration-300
                                            flex flex-col items-center justify-center gap-4
                                            border-2
                                            ${prediction.suit === suit
                                                ? isRed
                                                    ? 'border-red-500 glow-red'
                                                    : 'border-transparent glow-gray'
                                                : isRed
                                                    ? 'border-red-500/30 hover:glow-red'
                                                    : 'border-transparent hover:glow-gray'}
                                        `}
                                    >
                                        <span className={`text-7xl ${color}`}>{icon}</span>
                                        <span className="text-lg font-bold text-white font-[family-name:var(--font-orbitron)]">{text}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Выбор номинала */}
                    {mode === 'rank' && (
                        <div className="grid grid-cols-5 gap-2 h-full">
                            {RANKS.map((rank) => (
                                <button
                                    key={rank}
                                    onClick={() => { playSound(); setPrediction({ ...prediction, rank: rank as CardRank }); }}
                                    className={`
                                        glass-dark rounded-xl p-3
                                        hover:scale-110
                                        transition-all duration-300
                                        flex items-center justify-center
                                        border-2
                                        ${prediction.rank === rank
                                            ? 'border-green-400 glow-green glass-card'
                                            : 'border-transparent hover:border-green-400/50'}
                                    `}
                                >
                                    <span className="text-xl font-bold text-white">{rank}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Полное предсказание */}
                    {mode === 'full' && (
                        <div className="grid grid-rows-2 gap-2.5 h-full">
                            {/* Выбор масти - БЕЗ заголовка */}
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(SUITS).map(([suit, { icon, text, color }]) => {
                                    const isRed = suit === 'hearts' || suit === 'diamonds';
                                    return (
                                        <button
                                            key={suit}
                                            onClick={() => {
                                                playSound();
                                                setPrediction({
                                                    ...prediction,
                                                    suit: suit as CardSuit,
                                                    color: isRed ? 'red' : 'black'
                                                });
                                            }}
                                            className={`
                                                glass-dark rounded-xl p-2
                                                hover:scale-105 hover:rotate-3 transition-all duration-300
                                                flex flex-col items-center justify-center gap-1.5
                                                border-2
                                                ${prediction.suit === suit
                                                    ? isRed
                                                        ? 'border-red-500 glow-red'
                                                        : 'border-transparent glow-gray'
                                                    : isRed
                                                        ? 'border-red-500/30'
                                                        : 'border-transparent hover:glow-gray'}
                                            `}
                                        >
                                            <span className={`text-4xl ${color}`}>{icon}</span>
                                            <span className="text-xs font-bold text-white font-[family-name:var(--font-orbitron)]">{text}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Выбор номинала - БЕЗ заголовка */}
                            <div className="grid grid-cols-7 gap-1.5">
                                {RANKS.map((rank) => (
                                    <button
                                        key={rank}
                                        onClick={() => { playSound(); setPrediction({ ...prediction, rank: rank as CardRank }); }}
                                        className={`
                                            glass-dark rounded-lg p-1.5
                                            hover:scale-110
                                            transition-all duration-300
                                            flex items-center justify-center
                                            border-2
                                            ${prediction.rank === rank
                                                ? 'border-green-400 glow-green'
                                                : 'border-transparent hover:border-green-400/50'}
                                        `}
                                    >
                                        <span className="text-base font-bold text-white">{rank}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Кнопка подтверждения - ПРЕМИУМ */}
            <button
                onClick={handleSubmit}
                className={`
                    rounded-2xl p-5 font-bold text-xl
                    font-[family-name:var(--font-orbitron)]
                    border-2 transition-all duration-300
                    active:scale-[0.96]
                    ${canSubmit() && !disabled
                        ? `border-green-500 
                           bg-gradient-to-br from-green-500/25 to-emerald-500/15
                           shadow-[0_0_35px_rgba(16,185,129,0.4)]
                           hover:border-green-400
                           hover:shadow-[0_0_45px_rgba(16,185,129,0.5)]
                           hover:scale-[1.02]
                           text-white cursor-pointer
                           animate-pulse`
                        : 'glass-dark border-white/5 opacity-40 cursor-not-allowed text-gray-500'}\
                `}
                disabled={!canSubmit() || disabled}
            >
                Сделать выбор
            </button>
        </div>
    );
};