'use client';

import React, { useState } from 'react';
import { CardRank, CardSuit, CardColor, Prediction } from '../types/card';
import { GAME_MODES, SUITS, RANKS, COLORS } from '../constants/game';

interface PredictionFormProps {
    onSubmit: (prediction: Prediction) => void;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit }) => {
    const [mode, setMode] = useState<'color' | 'suit' | 'rank' | 'full' | null>(null);
    const [prediction, setPrediction] = useState<Prediction>({ mode: null });

    const handleModeChange = (newMode: 'color' | 'suit' | 'rank' | 'full') => {
        setMode(newMode);
        setPrediction({ mode: newMode });
    };

    const handleSubmit = () => {
        if (canSubmit()) {
            onSubmit(prediction);
            setMode(null);
            setPrediction({ mode: null });
        }
    };

    const canSubmit = () => {
        if (!prediction.mode) return false;
        
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
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 shadow-xl h-[400px] flex flex-col">
                {/* Заголовок */}
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-blue-600">
                        Сделайте предсказание
                    </h2>
                    {mode && (
                        <button
                            onClick={() => {
                                setMode(null);
                                setPrediction({ mode: null });
                            }}
                            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                        >
                            ← Назад
                        </button>
                    )}
                </div>

                {/* Основной контент */}
                <div className="flex-1 overflow-hidden">
                    {/* Выбор режима предсказания */}
                    {!mode && (
                        <div className="grid grid-cols-2 gap-3 h-full">
                            {Object.entries(GAME_MODES).map(([key, { icon, text, points, description }]) => (
                                <button
                                    key={key}
                                    onClick={() => handleModeChange(key as 'color' | 'suit' | 'rank' | 'full')}
                                    className="card-button"
                                >
                                    <div className="text-center p-2">
                                        <div className="text-2xl mb-2 text-blue-500">{icon}</div>
                                        <div className="text-base font-medium text-gray-700 mb-1">{text}</div>
                                        <div className="text-sm font-medium text-green-500">+{points} очков</div>
                                        <div className="text-xs text-gray-500 mt-1">{description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Выбор цвета */}
                    {mode === 'color' && (
                        <div className="grid grid-cols-2 gap-4 h-full">
                            {Object.entries(COLORS).map(([color, { icon, text }]) => (
                                <button
                                    key={color}
                                    onClick={() => setPrediction({ ...prediction, color: color as CardColor })}
                                    className={`relative bg-white rounded-xl p-3 flex flex-col items-center justify-center
                                        transition-all duration-200 border hover:bg-blue-50/50
                                        ${prediction.color === color 
                                            ? 'border-blue-400 shadow-md bg-blue-50/30' 
                                            : 'border-gray-100 hover:border-blue-200'}`}
                                >
                                    <span className="text-3xl mb-2 opacity-90 group-hover:opacity-100">{icon}</span>
                                    <span className="text-sm font-medium text-gray-800">{text}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Выбор масти */}
                    {mode === 'suit' && (
                        <div className="grid grid-cols-2 gap-4 h-full">
                            {Object.entries(SUITS).map(([suit, { icon, text, color }]) => (
                                <button
                                    key={suit}
                                    onClick={() => setPrediction({ 
                                        ...prediction, 
                                        suit: suit as CardSuit,
                                        color: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black'
                                    })}
                                    className={`relative bg-white rounded-xl p-3 flex flex-col items-center justify-center
                                        transition-all duration-200 border hover:bg-blue-50/50
                                        ${prediction.suit === suit 
                                            ? 'border-blue-400 shadow-md bg-blue-50/30' 
                                            : 'border-gray-100 hover:border-blue-200'}`}
                                >
                                    <span className={`text-3xl mb-2 opacity-90 group-hover:opacity-100 ${color}`}>{icon}</span>
                                    <span className="text-sm font-medium text-gray-800">{text}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Выбор номинала */}
                    {mode === 'rank' && (
                        <div className="flex flex-col gap-2 h-full">
                            <div className="grid grid-cols-7 gap-1.5 flex-1">
                                {RANKS.slice(0, 7).map((rank) => (
                                    <button
                                        key={rank}
                                        onClick={() => setPrediction({ ...prediction, rank: rank as CardRank })}
                                        className={`flex items-center justify-center h-full rounded-lg bg-white
                                            transition-all duration-200 border hover:bg-blue-50/50
                                            ${prediction.rank === rank 
                                                ? 'border-blue-400 shadow-md bg-blue-50/30' 
                                                : 'border-gray-100 hover:border-blue-200'}`}
                                    >
                                        <span className="text-base font-medium text-gray-800">{rank}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-6 gap-1.5 flex-1">
                                {RANKS.slice(7).map((rank) => (
                                    <button
                                        key={rank}
                                        onClick={() => setPrediction({ ...prediction, rank: rank as CardRank })}
                                        className={`flex items-center justify-center h-full rounded-lg bg-white
                                            transition-all duration-200 border hover:bg-blue-50/50
                                            ${prediction.rank === rank 
                                                ? 'border-blue-400 shadow-md bg-blue-50/30' 
                                                : 'border-gray-100 hover:border-blue-200'}`}
                                    >
                                        <span className="text-base font-medium text-gray-800">{rank}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Полное предсказание */}
                    {mode === 'full' && (
                        <div className="grid grid-rows-2 gap-2 h-full">
                            {/* Выбор масти */}
                            <div>
                                <h3 className="text-xs font-medium text-gray-700 mb-1">Выберите масть:</h3>
                                <div className="grid grid-cols-2 gap-2 h-[calc(100%-1.25rem)]">
                                    {Object.entries(SUITS).map(([suit, { icon, text, color }]) => (
                                        <button
                                            key={suit}
                                            onClick={() => setPrediction({ 
                                                ...prediction, 
                                                suit: suit as CardSuit,
                                                color: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black'
                                            })}
                                            className={`relative bg-white rounded-lg p-2 flex flex-col items-center justify-center
                                                transition-all duration-200 border hover:bg-blue-50/50
                                                ${prediction.suit === suit 
                                                    ? 'border-blue-400 shadow-md bg-blue-50/30' 
                                                    : 'border-gray-100 hover:border-blue-200'}`}
                                        >
                                            <span className={`text-xl mb-1 opacity-90 group-hover:opacity-100 ${color}`}>{icon}</span>
                                            <span className="text-xs font-medium text-gray-800">{text}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Выбор номинала */}
                            <div>
                                <h3 className="text-xs font-medium text-gray-700 mb-1">Выберите номинал:</h3>
                                <div className="grid grid-cols-7 gap-1">
                                    {RANKS.map((rank) => (
                                        <button
                                            key={rank}
                                            onClick={() => setPrediction({ ...prediction, rank: rank as CardRank })}
                                            className={`flex items-center justify-center p-2 rounded-lg bg-white
                                                transition-all duration-200 border hover:bg-blue-50/50
                                                ${prediction.rank === rank 
                                                    ? 'border-blue-400 shadow-md bg-blue-50/30' 
                                                    : 'border-gray-100 hover:border-blue-200'}`}
                                        >
                                            <span className="text-sm font-medium text-gray-800">{rank}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Кнопка подтверждения */}
            <button
                onClick={handleSubmit}
                className={`button-base ${!canSubmit() ? 'button-inactive' : ''}`}
                disabled={!canSubmit()}
            >
                Сделать выбор
            </button>
        </div>
    );
}; 