import React from 'react';
import { COLORS } from '../../constants/game';
import { CardColor } from '../../types/game';

interface ColorSelectorProps {
    onSelect: (color: CardColor) => void;
    selectedColor?: CardColor;
    disabled?: boolean;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({ 
    onSelect, 
    selectedColor,
    disabled = false 
}) => {
    return (
        <div className="grid grid-cols-2 gap-6">
            {(Object.entries(COLORS) as [CardColor, typeof COLORS[CardColor]][]).map(([color, { icon, text }]) => (
                <button
                    key={color}
                    onClick={() => onSelect(color)}
                    disabled={disabled}
                    className={`card-button group ${
                        selectedColor === color ? 'ring-2 ring-blue-500' : ''
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={`Выбрать цвет: ${text}`}
                    aria-selected={selectedColor === color}
                    role="option"
                >
                    <span className="card-icon text-7xl">{icon}</span>
                    <span className="card-text">{text}</span>
                </button>
            ))}
        </div>
    );
}; 