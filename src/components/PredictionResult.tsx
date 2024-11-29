'use client';

import React from 'react';
import { Card, Prediction, PredictionResult as PredictionResultType } from '../types/game';

interface PredictionResultProps {
    prediction: Prediction;
    actual: Card;
    result: PredictionResultType;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({ prediction, actual, result }) => {
    return (
        <div className={`p-6 rounded-xl ${
            result.correct ? 'bg-green-100' : 'bg-red-100'
        }`}>
            <h3 className={`text-xl font-bold mb-4 ${
                result.correct ? 'text-green-700' : 'text-red-700'
            }`}>
                {result.correct ? 'Правильно!' : 'Неправильно!'}
            </h3>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium">Ваше предсказание:</span>
                    <span className="text-gray-600">
                        {prediction.color && `Цвет: ${prediction.color}`}
                        {prediction.suit && `Масть: ${prediction.suit}`}
                        {prediction.rank && `Номинал: ${prediction.rank}`}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="font-medium">Карта:</span>
                    <span className="text-gray-600">
                        {actual.color} {actual.suit} {actual.rank}
                    </span>
                </div>

                {result.correct && (
                    <div className="flex items-center justify-between text-green-600 font-medium">
                        <span>Очки:</span>
                        <span>+{result.totalPoints}</span>
                    </div>
                )}
            </div>
        </div>
    );
}; 