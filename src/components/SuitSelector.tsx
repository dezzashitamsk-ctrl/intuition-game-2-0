import React from 'react';
import { SUITS } from '../constants/game';
import { CardSuit } from '../types/game';

interface SuitSelectorProps {
    onSelect: (suit: CardSuit) => void;
    selectedSuit?: CardSuit;
    variant?: 'default' | 'compact';
}

export const SuitSelector: React.FC<SuitSelectorProps> = ({ 
    onSelect, 
    selectedSuit,
    variant = 'default'
}) => {
    const sizeClasses = {
        default: {
            button: 'h-[90px]',
            icon: 'text-3xl mb-2',
            text: 'text-sm'
        },
        compact: {
            button: 'h-[90px]',
            icon: 'text-3xl mb-2',
            text: 'text-sm'
        }
    }[variant];

    return (
        <div className="grid grid-cols-2 gap-2">
            {(Object.entries(SUITS) as [CardSuit, typeof SUITS[CardSuit]][]).map(([suit, { icon, text, color }]) => (
                <button
                    key={suit}
                    onClick={() => onSelect(suit)}
                    className={`${sizeClasses.button} flex flex-col items-center justify-center py-2 px-2 rounded-xl bg-white hover:bg-gray-50 
                              border border-gray-100 transition-all duration-300
                              ${selectedSuit === suit ? 'ring-2 ring-blue-500' : ''}`}
                    aria-label={`Выбрать масть: ${text}`}
                    aria-selected={selectedSuit === suit}
                    role="option"
                >
                    <span className={`${sizeClasses.icon} ${color}`}>{icon}</span>
                    <span className={sizeClasses.text}>{text}</span>
                </button>
            ))}
        </div>
    );
}; 