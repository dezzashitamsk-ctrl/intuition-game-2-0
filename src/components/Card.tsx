'use client';

import React from 'react';
import { Card as CardType, CardSuit } from '../types/game';

interface CardProps {
    card?: CardType;
    isHidden: boolean;
}

export const Card: React.FC<CardProps> = ({ card, isHidden }) => {
    if (!card) {
        return (
            <div className="card-container">
                <div className="card-wrapper">
                    <div className="card-face card-front">
                        <span className="text-gray-400">Нет карты</span>
                    </div>
                </div>
            </div>
        );
    }

    const suitColor = card.color === 'red' ? 'text-red-500' : 'text-gray-800';
    
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

    return (
        <div className="card-container">
            <div className={`card-wrapper ${isHidden ? '' : 'is-flipped'}`}>
                <div className="card-face card-front">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400">
                        <div className="flex items-center justify-center h-full">
                            <div className="text-white text-8xl font-bold opacity-90 transform -rotate-12
                                drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">?</div>
                        </div>
                    </div>
                </div>

                <div className="card-face card-back bg-white">
                    <div className="absolute top-4 left-4">
                        <div className={`text-4xl font-bold ${suitColor}`}>{card.rank}</div>
                        <div className={`text-3xl ${suitColor}`}>{suitSymbols[card.suit]}</div>
                    </div>

                    <div className={`absolute inset-0 flex items-center justify-center ${suitColor}`}>
                        <div className="text-9xl">
                            {suitSymbols[card.suit]}
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4 rotate-180">
                        <div className={`text-4xl font-bold ${suitColor}`}>{card.rank}</div>
                        <div className={`text-3xl ${suitColor}`}>{suitSymbols[card.suit]}</div>
                    </div>

                    <div className="absolute bottom-4 left-4 text-sm text-gray-500">
                        {suitNames[card.suit]}
                    </div>
                </div>
            </div>
        </div>
    );
}; 