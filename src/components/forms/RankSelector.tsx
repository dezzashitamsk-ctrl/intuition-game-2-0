import React from 'react';
import { RANKS } from '../../constants/game';
import { CardRank } from '../../types/game';

interface RankSelectorProps {
    onSelect: (rank: CardRank) => void;
    selectedRank?: CardRank;
    variant?: 'default' | 'compact';
}

export const RankSelector: React.FC<RankSelectorProps> = ({ 
    onSelect, 
    selectedRank,
    variant = 'default'
}) => {
    const sizeClasses = {
        default: {
            button: 'h-[50px]',
            text: 'text-lg'
        },
        compact: {
            button: 'h-[50px]',
            text: 'text-lg'
        }
    }[variant];

    return (
        <div className="grid grid-cols-4 gap-2">
            {RANKS.map((rank) => (
                <button
                    key={rank}
                    onClick={() => onSelect(rank)}
                    className={`${sizeClasses.button} flex items-center justify-center py-2 px-2 rounded-xl bg-white hover:bg-gray-50 
                              border border-gray-100 transition-all duration-300
                              ${selectedRank === rank ? 'ring-2 ring-blue-500' : ''}`}
                    aria-label={`Выбрать номинал: ${rank}`}
                    aria-selected={selectedRank === rank}
                    role="option"
                >
                    <span className={`${sizeClasses.text} font-medium text-gray-700`}>{rank}</span>
                </button>
            ))}
        </div>
    );
}; 