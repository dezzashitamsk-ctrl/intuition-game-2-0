'use client';

import React from 'react';
import { Card as CardType } from '../types/card';

interface CardProps {
    card?: CardType;
    isHidden?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, isHidden = false }) => {
    const cardStyles = `card-base ${isHidden ? 'rotate-y-180' : ''}`;

    if (!card || isHidden) {
        return (
            <div className={`${cardStyles} bg-gradient-to-br from-blue-400 to-blue-600 border-white/90
                flex items-center justify-center relative overflow-hidden
                hover:from-blue-500 hover:to-blue-700 transition-all duration-500 ease-in-out
                transform-gpu backface-visible-hidden will-change-transform`}
            >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="text-white text-8xl font-bold opacity-90 transform -rotate-12 
                    drop-shadow-2xl transition-transform duration-500 ease-in-out
                    hover:scale-110 hover:-rotate-6">?</div>
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

    const isRedSuit = card.suit === 'hearts' || card.suit === 'diamonds';
    const cardColor = isRedSuit ? 'text-red-500' : 'text-gray-800';
    const borderColor = isRedSuit ? 'border-red-100' : 'border-gray-100';
    const bgGradient = isRedSuit
        ? 'bg-gradient-to-br from-white via-red-50 to-red-100/50' 
        : 'bg-gradient-to-br from-white via-gray-50 to-gray-100/50';

    return (
        <div className={`${cardStyles} ${bgGradient} ${borderColor}
            flex flex-col p-8 relative group
            transform-gpu backface-visible-hidden will-change-transform
            transition-all duration-500 ease-in-out hover:scale-105`}
        >
            <div className={`absolute top-6 left-6 flex flex-col items-center 
                transition-all duration-300 ease-in-out group-hover:scale-110 ${cardColor}`}
            >
                <div className="text-4xl font-bold mb-1">{card.rank}</div>
                <div className="text-4xl">{suitSymbols[card.suit]}</div>
            </div>
            
            <div className="flex-grow flex items-center justify-center">
                <div className={`text-9xl transform transition-all duration-500 ease-in-out 
                    group-hover:scale-110 group-hover:rotate-3 ${cardColor}`}>
                    {suitSymbols[card.suit]}
                </div>
            </div>
            
            <div className={`absolute bottom-6 right-6 flex flex-col items-center transform rotate-180
                transition-all duration-300 ease-in-out group-hover:scale-110 ${cardColor}`}
            >
                <div className="text-4xl font-bold mb-1">{card.rank}</div>
                <div className="text-4xl">{suitSymbols[card.suit]}</div>
            </div>

            <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 
                text-sm font-medium opacity-50 transition-all duration-300 ease-in-out
                group-hover:opacity-75 ${cardColor}`}
            >
                {suitNames[card.suit]}
            </div>

            <div className={`absolute inset-0 rounded-2xl border border-current opacity-5
                transition-all duration-300 ease-in-out group-hover:opacity-10 ${cardColor}`}></div>
            <div className={`absolute inset-[2px] rounded-2xl border border-current opacity-5
                transition-all duration-300 ease-in-out group-hover:opacity-10 ${cardColor}`}></div>
        </div>
    );
} 