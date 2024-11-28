'use client';

import React from 'react';
import type { Card, Prediction, PredictionResult as PredictionResultType } from '../types/card';

interface PredictionResultProps {
    prediction: Prediction;
    actual: Card;
    result: PredictionResultType;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({ prediction, actual, result }) => {
    const formatSuit = (suit: string) => {
        const suits = {
            hearts: '♥ Червы',
            diamonds: '♦ Бубны',
            clubs: '♣ Трефы',
            spades: '♠ Пики'
        };
        return suits[suit as keyof typeof suits] || suit;
    };

    const formatColor = (color: string) => {
        return color === 'red' ? '🔴 Красный' : '⚫ Черный';
    };

    return (
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl 
            border border-gray-100 space-y-6 hover:shadow-2xl transition-all duration-500">
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Предсказание:</h3>
                <div className="grid grid-cols-2 gap-4">
                    {prediction.color && (
                        <div className="prediction-item bg-white/70">
                            <span className="text-gray-600 font-medium">Цвет:</span>
                            <span className="font-semibold">{formatColor(prediction.color)}</span>
                        </div>
                    )}
                    {prediction.suit && (
                        <div className="prediction-item bg-white/70">
                            <span className="text-gray-600 font-medium">Масть:</span>
                            <span className="font-semibold">{formatSuit(prediction.suit)}</span>
                        </div>
                    )}
                    {prediction.rank && (
                        <div className="prediction-item bg-white/70">
                            <span className="text-gray-600 font-medium">Номинал:</span>
                            <span className="font-semibold">{prediction.rank}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Результат:</h3>
                <div className="space-y-3">
                    {result.colorMatch && prediction.color && (
                        <div className="prediction-item bg-gradient-to-r from-green-50 to-green-100/50">
                            <span className="font-medium">Цвет угадан</span>
                            <span className="font-bold text-green-600">+1 очко</span>
                        </div>
                    )}
                    {result.suitMatch && prediction.suit && !prediction.rank && (
                        <div className="prediction-item bg-gradient-to-r from-green-50 to-green-100/50">
                            <span className="font-medium">Масть угадана</span>
                            <span className="font-bold text-green-600">+3 очка</span>
                        </div>
                    )}
                    {result.rankMatch && prediction.rank && !prediction.suit && (
                        <div className="prediction-item bg-gradient-to-r from-green-50 to-green-100/50">
                            <span className="font-medium">Номинал угадан</span>
                            <span className="font-bold text-green-600">+8 очков</span>
                        </div>
                    )}
                    {(result.suitMatch && result.rankMatch && prediction.suit && prediction.rank) && (
                        <div className="prediction-item bg-gradient-to-r from-purple-50 to-purple-100/50">
                            <span className="font-medium">Масть и номинал угаданы</span>
                            <span className="font-bold text-purple-600">+15 очков</span>
                        </div>
                    )}
                    {(!result.suitMatch || !result.rankMatch) && prediction.suit && prediction.rank && (
                        <div className="prediction-item bg-gradient-to-r from-red-50 to-red-100/50">
                            <span className="font-medium">Масть и номинал должны быть угаданы оба</span>
                            <span className="font-bold text-red-600">+0 очков</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 