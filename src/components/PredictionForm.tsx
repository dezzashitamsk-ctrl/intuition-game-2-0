'use client';

import React, { useState } from 'react';
import type { CardColor, CardRank, CardSuit, PredictionMode, Prediction } from '../types';

interface PredictionFormProps {
    onSubmit: (prediction: Prediction) => void;
}

/**
 * Компонент формы для предсказания карт
 * 
 * Основные режимы:
 * 1. Выбор цвета (красный/черный) - 1 очко
 * 2. Выбор масти (червы/бубны/трефы/пики) - 3 очка
 * 3. Выбор номинала (2-10, J, Q, K, A) - 8 очков
 * 4. Полное предсказание (масть + номинал) - 15 очков
 * 
 * Стилевые особенности:
 * - Размеры карточек: aspect-ratio 4:3
 * - Отступы между карточками: gap-6
 * - Размер иконок: text-7xl (масти), text-4xl (меню)
 * - Размер текста: text-xl (масти), text-base (меню)
 * 
 * Цветовая схема:
 * - Красные масти (червы, бубны): #FF0000
 * - Черные масти (трефы, пики): #6B4E9D
 * - Фон карточек: белый с hover эффектом
 * - Рамка: светло-серая (border-gray-100)
 * 
 * Интерактивность:
 * - Hover эффект: легкое затемнение фона
 * - Анимация при наведении: 300ms
 * - Тень при наведении
 * 
 * @param {PredictionFormProps} props - Пропсы компонента
 * @param {function} props.onSubmit - Функция обработки отправки формы
 * @returns {JSX.Element} Форма предсказания
 */
export const PredictionForm = ({ onSubmit }: PredictionFormProps) => {
    const [mode, setMode] = useState<PredictionMode>(null);
    const [prediction, setPrediction] = useState<Prediction>({});

    const handleModeChange = (newMode: PredictionMode) => {
        setMode(newMode);
        setPrediction({});
    };

    const handleSubmit = () => {
        if (canSubmit()) {
            onSubmit(prediction);
            setMode(null);
            setPrediction({});
        }
    };

    const canSubmit = () => {
        switch (mode) {
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

    const ranks: CardRank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suitSymbols = {
        hearts: '♥',
        diamonds: '♦',
        clubs: '♣',
        spades: '♠'
    };
    const suitNames = {
        hearts: 'Червы',
        diamonds: 'Бубны',
        clubs: 'Трефы',
        spades: 'Пики'
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="relative bg-gradient-to-br from-white to-gray-50/80 rounded-3xl 
                          shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm
                          w-[800px] min-h-[400px] border border-gray-100/50">
                <div className="p-6 h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">
                            {!mode ? 'Выберите тип предсказания' : 
                             mode === 'color' ? 'Выберите цвет' :
                             mode === 'suit' ? 'Выберите масть' :
                             mode === 'rank' ? 'Выберите номинал' : 'Масть и номинал'}
                        </h3>
                        {mode && (
                            <button 
                                onClick={() => handleModeChange(null)}
                                className="text-blue-500 hover:text-blue-600 font-medium 
                                         transition-all duration-200 hover:-translate-x-1"
                            >
                                ← Назад
                            </button>
                        )}
                    </div>

                    {mode === 'suit' && (
                        <div className="h-[300px] grid grid-cols-2 gap-6 p-4">
                            <button onClick={() => setPrediction({ suit: 'hearts' })} 
                                className="h-full w-full flex flex-col items-center justify-center rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 transition-all duration-300"
                            >
                                <div className="text-7xl mb-4 text-red-500">❤️</div>
                                <div className="text-xl font-medium text-gray-600">Червы</div>
                            </button>
                            <button onClick={() => setPrediction({ suit: 'diamonds' })} 
                                className="h-full w-full flex flex-col items-center justify-center rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 transition-all duration-300"
                            >
                                <div className="text-7xl mb-4 text-red-500">♦️</div>
                                <div className="text-xl font-medium text-gray-600">Бубны</div>
                            </button>
                            <button onClick={() => setPrediction({ suit: 'clubs' })} 
                                className="h-full w-full flex flex-col items-center justify-center rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 transition-all duration-300"
                            >
                                <div className="text-7xl mb-4 text-[#6B4E9D]">♣️</div>
                                <div className="text-xl font-medium text-gray-600">Трефы</div>
                            </button>
                            <button onClick={() => setPrediction({ suit: 'spades' })} 
                                className="h-full w-full flex flex-col items-center justify-center rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 transition-all duration-300"
                            >
                                <div className="text-7xl mb-4 text-[#6B4E9D]">♠️</div>
                                <div className="text-xl font-medium text-gray-600">Пики</div>
                            </button>
                        </div>
                    )}

                    {mode === 'rank' && (
                        <div>
                            <div className="text-sm text-gray-600 mb-2">Выберите номинал:</div>
                            <div className="grid grid-cols-7 gap-2">
                                {ranks.map(rank => (
                                    <button
                                        key={rank}
                                        onClick={() => setPrediction({ rank: rank as CardRank })}
                                        className={`flex items-center justify-center p-3 rounded-xl bg-white shadow-sm
                                            hover:shadow transition-shadow ${prediction.rank === rank ? 'ring-2 ring-blue-500' : ''}`}
                                    >
                                        <span className="text-sm font-medium">{rank}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {mode === 'color' && (
                        <div className="h-[250px] grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setPrediction({ color: 'red' })}
                                className="h-full flex flex-col items-center justify-center rounded-2xl bg-white hover:bg-gray-50 border border-gray-100"
                            >
                                <div className="text-6xl mb-4">🔴</div>
                                <div className="text-xl font-medium text-gray-700">Красная</div>
                            </button>
                            <button
                                onClick={() => setPrediction({ color: 'black' })}
                                className="h-full flex flex-col items-center justify-center rounded-2xl bg-white hover:bg-gray-50 border border-gray-100"
                            >
                                <div className="text-6xl mb-4">⚫</div>
                                <div className="text-xl font-medium text-gray-700">Черная</div>
                            </button>
                        </div>
                    )}

                    {mode === 'full' && (
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-gray-600 mb-2">Выберите масть:</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {(Object.entries(suitSymbols) as [CardSuit, string][]).map(([suit, symbol]) => (
                                        <button
                                            key={suit}
                                            onClick={() => setPrediction({...prediction, suit})}
                                            className={`flex items-center justify-center gap-2 p-4 rounded-2xl bg-white shadow-sm
                                                hover:shadow transition-shadow ${prediction.suit === suit ? 'ring-2 ring-blue-500' : ''}`}
                                        >
                                            <span className={`text-2xl ${suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : ''}`}>
                                                {symbol}
                                            </span>
                                            <span className="text-sm font-medium">{suitNames[suit]}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-600 mb-2">Выберите номинал:</div>
                                <div className="grid grid-cols-7 gap-2">
                                    {ranks.map(rank => (
                                        <button
                                            key={rank}
                                            onClick={() => setPrediction({...prediction, rank: rank as CardRank})}
                                            className={`flex items-center justify-center p-3 rounded-xl bg-white shadow-sm
                                                hover:shadow transition-shadow ${prediction.rank === rank ? 'ring-2 ring-blue-500' : ''}`}
                                        >
                                            <span className="text-sm font-medium">{rank}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {!mode && (
                        <div className="grid grid-cols-2 gap-2 p-4">
                            <button onClick={() => handleModeChange('color')} 
                                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100">
                                <span className="text-4xl mb-4">🎨</span>
                                <span className="text-base font-medium text-gray-700">Угадать цвет</span>
                                <span className="text-sm text-green-500 mt-2">+1 очко</span>
                            </button>
                            <button onClick={() => handleModeChange('suit')} 
                                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100">
                                <span className="text-4xl mb-4">♠️</span>
                                <span className="text-base font-medium text-gray-700">Угадать масть</span>
                                <span className="text-sm text-green-500 mt-2">+3 очка</span>
                            </button>
                            <button onClick={() => handleModeChange('rank')} 
                                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100">
                                <span className="text-4xl mb-4">A</span>
                                <span className="text-base font-medium text-gray-700">Угадать номинал</span>
                                <span className="text-sm text-green-500 mt-2">+8 очков</span>
                            </button>
                            <button onClick={() => handleModeChange('full')} 
                                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100">
                                <span className="text-4xl mb-4">🃏</span>
                                <span className="text-base font-medium text-gray-700">Масть и номинал</span>
                                <span className="text-sm text-green-500 mt-2">+15 очков</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {mode && (
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit()}
                    className="w-full p-4 rounded-2xl font-medium text-lg
                        bg-gradient-to-r from-blue-500 to-blue-600
                        disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-400
                        enabled:text-white enabled:hover:from-blue-600 enabled:hover:to-blue-700
                        transition-all duration-200 disabled:cursor-not-allowed
                        shadow-sm enabled:hover:shadow-md enabled:hover:-translate-y-0.5"
                >
                    Подтвердить выбор
                </button>
            )}
        </div>
    );
}; 