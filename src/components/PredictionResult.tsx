'use client';

import React from 'react';
import { Card, Prediction, PredictionResult } from '../types/card';

interface PredictionResultProps {
    prediction: Prediction;
    actual: Card;
    result: PredictionResult;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({ prediction, actual, result }) => {
    // Функция для форматирования названия масти
    const formatSuit = (suit: string) => {
        const suits = {
            hearts: '♥ Червы',
            diamonds: '♦ Бубны',
            clubs: '♣ Трефы',
            spades: '♠ Пики'
        };
        return suits[suit as keyof typeof suits] || suit;
    };

    // Функция для форматирования цвета
    const formatColor = (color: string) => {
        return color === 'red' ? '🔴 Красный' : '⚫ Черный';
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            {/* Секция предсказания */}
            <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-700">Предсказание:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {prediction.color && (
                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Цвет:</span>
                            <span className="font-medium">{formatColor(prediction.color)}</span>
                        </div>
                    )}
                    {prediction.suit && (
                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Масть:</span>
                            <span className="font-medium">{formatSuit(prediction.suit)}</span>
                        </div>
                    )}
                    {prediction.rank && (
                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Номинал:</span>
                            <span className="font-medium">{prediction.rank}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Секция результата */}
            <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-700">Результат:</h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded">
                        <span className="font-medium text-blue-700">Итого очков:</span>
                        <span className="text-2xl font-bold text-blue-600">+{result.totalPoints}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                        {result.colorMatch && prediction.color && (
                            <div className="flex justify-between items-center bg-green-50 p-2 rounded">
                                <span>Цвет угадан</span>
                                <span className="font-medium text-green-600">+1 очко</span>
                            </div>
                        )}
                        {result.suitMatch && prediction.suit && (
                            <div className="flex justify-between items-center bg-green-50 p-2 rounded">
                                <span>Масть угадана</span>
                                <span className="font-medium text-green-600">+3 очка</span>
                            </div>
                        )}
                        {result.rankMatch && prediction.rank && !prediction.suit && (
                            <div className="flex justify-between items-center bg-green-50 p-2 rounded">
                                <span>Номинал угадан</span>
                                <span className="font-medium text-green-600">+8 очков</span>
                            </div>
                        )}
                        {(result.suitMatch && result.rankMatch && prediction.suit && prediction.rank) && (
                            <div className="flex justify-between items-center bg-purple-50 p-2 rounded">
                                <span>Масть и номинал угаданы</span>
                                <span className="font-medium text-purple-600">+15 очков</span>
                            </div>
                        )}
                        {(!result.suitMatch || !result.rankMatch) && prediction.suit && prediction.rank && (
                            <div className="flex justify-between items-center bg-red-50 p-2 rounded">
                                <span>Масть и номинал должны быть угаданы оба</span>
                                <span className="font-medium text-red-600">+0 очков</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 