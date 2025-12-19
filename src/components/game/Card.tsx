'use client';

import React from 'react';
import { Card as CardType, CardSuit } from '../../types/card';

interface CardProps {
    card?: CardType;
    isHidden: boolean;
}

export const Card: React.FC<CardProps> = ({ card, isHidden }) => {
    if (!card) {
        return (
            <>
                <div className="card-face card-front">
                    <span className="text-gray-400">Нет карты</span>
                </div>
            </>
        );
    }

    const suitColor = card.color === 'red' ? 'text-red-500' : 'text-gray-800';

    const SUIT_SYMBOLS = {
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

    return (
        <>
            {/* Передняя сторона (рубашка) - КРУГЛАЯ */}
            <div className="card-face card-front overflow-hidden">
                {/* Темный фон с градиентом */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[32px]">

                    {/* Узор из мастей */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="grid grid-cols-3 grid-rows-5 h-full w-full p-4 gap-2">
                            {Array.from({ length: 15 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-center text-4xl text-white">
                                    {['♠', '♥', '♦', '♣'][i % 4]}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-4 rounded-[24px] glass-light"></div>

                    {/* Градиентная рамка */}
                    <div className="absolute inset-0 rounded-[32px] border-4 border-double"
                        style={{
                            borderImage: 'linear-gradient(135deg, #CC3333, #3b82f6, #CC3333) 1'
                        }}>
                    </div>

                    {/* Центральный вопросик */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            {/* Glow эффект */}
                            <div className="absolute inset-0 text-9xl font-bold text-blue-400 blur-2xl opacity-50">
                                ?
                            </div>
                            {/* Основной вопросик */}
                            <div className="relative text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                                ?
                            </div>
                        </div>
                    </div>

                    {/* Декоративные уголки - круглые */}
                    <div className="absolute top-3 left-3 w-12 h-12 border-l-4 border-t-4 border-blue-400/50 rounded-tl-xl"></div>
                    <div className="absolute top-3 right-3 w-12 h-12 border-r-4 border-t-4 border-purple-400/50 rounded-tr-xl"></div>
                    <div className="absolute bottom-3 left-3 w-12 h-12 border-l-4 border-b-4 border-purple-400/50 rounded-bl-xl"></div>
                    <div className="absolute bottom-3 right-3 w-12 h-12 border-r-4 border-b-4 border-blue-400/50 rounded-br-xl"></div>
                </div>
            </div>

            {/* Задняя сторона (лицо карты) - КРУГЛАЯ И СВЕТЛАЯ */}
            <div className="card-face card-back overflow-hidden">
                {/* Светлый фон */}
                <div className="absolute inset-0 bg-white rounded-[32px]"></div>

                {/* Декоративная рамка */}
                <div className="absolute inset-0 rounded-[32px] border-8 border-double"
                    style={{ borderColor: card.color === 'red' ? '#CC3333' : '#333333' }}>
                </div>

                {/* Внутренняя рамка */}
                <div className="absolute inset-3 rounded-[24px] border-2"
                    style={{ borderColor: card.color === 'red' ? '#CC3333' : '#333333', opacity: 0.3 }}>
                </div>

                {/* Верхний левый угол */}
                <div className="absolute top-6 left-6 flex flex-col items-center">
                    <div className={`text-5xl font-bold ${suitColor} leading-none`}>{card.rank}</div>
                    <div className={`text-4xl ${suitColor} -mt-1`}>{SUIT_SYMBOLS[card.suit]}</div>
                </div>

                {/* Центральный символ */}
                <div className={`absolute inset-0 flex items-center justify-center ${suitColor}`}>
                    <div className="relative">
                        {/* Тень для объема */}
                        <div className="absolute inset-0 text-[12rem] opacity-10 blur-sm">
                            {SUIT_SYMBOLS[card.suit]}
                        </div>
                        {/* Основной символ */}
                        <div className="text-[12rem] relative z-10 drop-shadow-lg">
                            {SUIT_SYMBOLS[card.suit]}
                        </div>
                    </div>
                </div>

                {/* Нижний правый угол (перевернутый) */}
                <div className="absolute bottom-6 right-6 rotate-180 flex flex-col items-center">
                    <div className={`text-5xl font-bold ${suitColor} leading-none`}>{card.rank}</div>
                    <div className={`text-4xl ${suitColor} -mt-1`}>{SUIT_SYMBOLS[card.suit]}</div>
                </div>

                {/* Название масти внизу */}
                <div className="absolute bottom-6 left-6">
                    <div className={`text-sm font-medium ${suitColor} opacity-60 tracking-wider`}>
                        {suitNames[card.suit]}
                    </div>
                </div>

                {/* Декоративные уголки */}
                <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 rounded-tl-lg"
                    style={{ borderColor: card.color === 'red' ? '#CC3333' : '#333333', opacity: 0.3 }}>
                </div>
                <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 rounded-tr-lg"
                    style={{ borderColor: card.color === 'red' ? '#CC3333' : '#333333', opacity: 0.3 }}>
                </div>
                <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 rounded-bl-lg"
                    style={{ borderColor: card.color === 'red' ? '#CC3333' : '#333333', opacity: 0.3 }}>
                </div>
                <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 rounded-br-lg"
                    style={{ borderColor: card.color === 'red' ? '#CC3333' : '#333333', opacity: 0.3 }}>
                </div>
            </div>
        </>
    );
};

// Добавляем displayName для удобства отладки
Card.displayName = 'Card';

// Экспортируем компонент
export default Card;

