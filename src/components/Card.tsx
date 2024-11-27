'use client';

import React from 'react';
import { Card as CardType } from '../types/card';

interface CardProps {
    card?: CardType;
    isHidden?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, isHidden = false }) => {
    const cardStyles = `
        w-[280px] h-[400px] rounded-2xl border-8 shadow-xl 
        transform transition-all duration-500
        ${isHidden ? 'rotate-y-180' : ''}
    `;

    if (!card || isHidden) {
        return (
            <div className={`${cardStyles} bg-gradient-to-br from-blue-500 to-blue-600 border-white
                flex items-center justify-center hover:scale-105 relative overflow-hidden`}
            >
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                <div className="text-white text-7xl font-bold opacity-50 transform -rotate-12">?</div>
            </div>
        );
    }

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

    const cardColor = card.color === 'red' ? 'text-red-500' : 'text-gray-800';
    const borderColor = card.color === 'red' ? 'border-red-100' : 'border-gray-100';
    const bgGradient = card.color === 'red' 
        ? 'bg-gradient-to-br from-white to-red-50' 
        : 'bg-gradient-to-br from-white to-gray-50';

    return (
        <div className={`${cardStyles} ${bgGradient} ${borderColor}
            flex flex-col p-8 relative hover:scale-105
            ${cardColor}`}
        >
            {/* Верхний левый угол */}
            <div className="absolute top-6 left-6 flex flex-col items-center">
                <div className="text-4xl font-bold mb-1">{card.rank}</div>
                <div className="text-4xl">{suitSymbols[card.suit]}</div>
            </div>
            
            {/* Центральный символ */}
            <div className="flex-grow flex items-center justify-center">
                <div className="text-8xl transform hover:scale-110 transition-transform">
                    {suitSymbols[card.suit]}
                </div>
            </div>
            
            {/* Нижний правый угол */}
            <div className="absolute bottom-6 right-6 flex flex-col items-center transform rotate-180">
                <div className="text-4xl font-bold mb-1">{card.rank}</div>
                <div className="text-4xl">{suitSymbols[card.suit]}</div>
            </div>

            {/* Название масти */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium opacity-50">
                {suitNames[card.suit]}
            </div>

            {/* Декоративные элементы */}
            <div className="absolute inset-0 rounded-xl border border-current opacity-5"></div>
            <div className="absolute inset-[2px] rounded-xl border border-current opacity-5"></div>
        </div>
    );
}; 