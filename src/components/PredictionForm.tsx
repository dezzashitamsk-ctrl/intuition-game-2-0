'use client';

import React, { useState } from 'react';
import type { CardColor, CardRank, CardSuit, PredictionMode, Prediction } from '../types';

interface PredictionFormProps {
    onSubmit: (prediction: Prediction) => void;
}

export const PredictionForm = ({ onSubmit }: PredictionFormProps) => {
    const [mode, setMode] = useState<PredictionMode>(null);
    const [prediction, setPrediction] = useState<Prediction>({});

    const suitSymbols: Record<CardSuit, string> = {
        hearts: '♥',
        diamonds: '♦',
        clubs: '♣',
        spades: '♠'
    };

    const suitNames: Record<CardSuit, string> = {
        hearts: 'Червы',
        diamonds: 'Бубны',
        clubs: 'Трефы',
        spades: 'Пики'
    };

    const handleModeChange = (newMode: PredictionMode) => {
        setMode(newMode);
        setPrediction({});
    };

    const canSubmit = () => {
        if (!mode) return false;
        if (mode === 'color') return 'color' in prediction;
        if (mode === 'suit') return 'suit' in prediction;
        if (mode === 'rank') return 'rank' in prediction;
        if (mode === 'full') return 'suit' in prediction && 'rank' in prediction;
        return false;
    };

    const handleSubmit = () => {
        if (!canSubmit()) return;
        onSubmit(prediction);
        setPrediction({});
        setMode(null);
    };

    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    return (
        <div className="w-[800px] bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {!mode ? 'Выберите тип предсказания' : 
                         mode === 'color' ? 'Выберите цвет' :
                         mode === 'suit' ? 'Выберите масть' :
                         mode === 'rank' ? 'Выберите номинал' : 'Масть и номинал'}
                    </h3>
                    {mode && (
                        <button 
                            onClick={() => handleModeChange(null)}
                            className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-2"
                        >
                            <span>←</span>
                            <span>Назад</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="p-6">
                {!mode && (
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleModeChange('color')}
                            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all"
                        >
                            <span className="text-4xl mb-3">🎨</span>
                            <span className="text-lg font-medium text-gray-800 mb-2">Угадать цвет</span>
                            <span className="text-sm font-medium text-green-600">+1 очко</span>
                        </button>

                        <button
                            onClick={() => handleModeChange('suit')}
                            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all"
                        >
                            <span className="text-4xl mb-3">♠️</span>
                            <span className="text-lg font-medium text-gray-800 mb-2">Угадать масть</span>
                            <span className="text-sm font-medium text-green-600">+3 очков</span>
                        </button>

                        <button
                            onClick={() => handleModeChange('rank')}
                            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all"
                        >
                            <span className="text-4xl mb-3">A</span>
                            <span className="text-lg font-medium text-gray-800 mb-2">Угадать номинал</span>
                            <span className="text-sm font-medium text-green-600">+8 очков</span>
                        </button>

                        <button
                            onClick={() => handleModeChange('full')}
                            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all"
                        >
                            <span className="text-4xl mb-3">🃏</span>
                            <span className="text-lg font-medium text-gray-800 mb-2">Масть и номинал</span>
                            <span className="text-sm font-medium text-green-600">+15 очков</span>
                        </button>
                    </div>
                )}

                {mode === 'suit' && (
                    <div className="grid grid-cols-2 gap-4">
                        {(Object.entries(suitSymbols) as [CardSuit, string][]).map(([suit, symbol]) => (
                            <button
                                key={suit}
                                onClick={() => setPrediction({ suit })}
                                className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all
                                    ${prediction.suit === suit 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-blue-300'}`}
                            >
                                <span className={`text-5xl mb-3 ${suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-gray-900'}`}>
                                    {symbol}
                                </span>
                                <span className="text-lg font-medium text-gray-800">{suitNames[suit]}</span>
                            </button>
                        ))}
                    </div>
                )}

                {mode === 'rank' && (
                    <div className="grid grid-cols-7 gap-2">
                        {ranks.map(rank => (
                            <button
                                key={rank}
                                onClick={() => setPrediction({ rank: rank as CardRank })}
                                className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all
                                    ${prediction.rank === rank 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-blue-300'}`}
                            >
                                <span className="text-xl font-medium text-gray-900">{rank}</span>
                            </button>
                        ))}
                    </div>
                )}

                {mode === 'color' && (
                    <div className="grid grid-cols-2 gap-6">
                        {[
                            { color: 'red', label: 'Красный' },
                            { color: 'black', label: 'Черный' }
                        ].map(({ color, label }) => (
                            <button
                                key={color}
                                onClick={() => setPrediction({ color: color as CardColor })}
                                className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all
                                    ${prediction.color === color 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-blue-300'}`}
                            >
                                <div className={`w-16 h-16 rounded-full mb-4 ${color === 'red' ? 'bg-red-500' : 'bg-gray-900'}`} />
                                <span className="text-lg font-medium text-gray-800">{label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {mode === 'full' && (
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-base font-medium text-gray-900 mb-3">Выберите масть:</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {(Object.entries(suitSymbols) as [CardSuit, string][]).map(([suit, symbol]) => (
                                    <button
                                        key={suit}
                                        onClick={() => setPrediction({...prediction, suit})}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
                                            ${prediction.suit === suit 
                                                ? 'border-blue-500 bg-blue-50' 
                                                : 'border-gray-200 hover:border-blue-300'}`}
                                    >
                                        <span className={`text-4xl mb-2 ${suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-gray-900'}`}>
                                            {symbol}
                                        </span>
                                        <span className="text-base font-medium text-gray-800">{suitNames[suit]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-base font-medium text-gray-900 mb-3">Выберите номинал:</h4>
                            <div className="grid grid-cols-7 gap-2">
                                {ranks.map(rank => (
                                    <button
                                        key={rank}
                                        onClick={() => setPrediction({...prediction, rank: rank as CardRank})}
                                        className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all
                                            ${prediction.rank === rank 
                                                ? 'border-blue-500 bg-blue-50' 
                                                : 'border-gray-200 hover:border-blue-300'}`}
                                    >
                                        <span className="text-lg font-medium text-gray-900">{rank}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {mode && (
                <div className="p-6 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit()}
                        className="w-full py-3 rounded-xl font-medium text-lg bg-blue-500 text-white hover:bg-blue-600 
                            transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        Подтвердить выбор
                    </button>
                </div>
            )}
        </div>
    );
}; 