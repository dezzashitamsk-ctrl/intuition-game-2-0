import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerChoiceBubbleProps {
    choice: {
        type: 'suit' | 'color' | 'value';
        value: string;
        confirmed?: boolean; // Подтверждено ли (нажата кнопка "Сделать выбор")
    } | null;
    position?: 'left' | 'right';
}

export const PlayerChoiceBubble: React.FC<PlayerChoiceBubbleProps> = ({
    choice,
    position = 'right'
}) => {
    if (!choice) return null;

    // Определяем эмодзи и текст
    const getChoiceDisplay = () => {
        switch (choice.type) {
            case 'suit':
                const suitEmoji = {
                    'hearts': '♥️',
                    'diamonds': '♦️',
                    'clubs': '♣️',
                    'spades': '♠️'
                }[choice.value] || '?';

                const suitName = {
                    'hearts': 'Черви',
                    'diamonds': 'Бубны',
                    'clubs': 'Трефы',
                    'spades': 'Пики'
                }[choice.value] || choice.value;

                return { emoji: suitEmoji, text: suitName };

            case 'color':
                // Эмодзи цвета + текст
                const colorEmoji = choice.value === 'red' ? '🔴' : '⚫';
                const colorName = choice.value === 'red' ? 'Красная' : 'Черная';
                return { emoji: colorEmoji, text: colorName };

            case 'value':
                // Проверяем формат "rank suit" для полной карты
                if (choice.value.includes(' ')) {
                    const [rank, suit] = choice.value.split(' ');

                    // Переводим номинал
                    const rankTranslation: Record<string, string> = {
                        'J': 'Валет',
                        'Q': 'Дама',
                        'K': 'Король',
                        'A': 'Туз'
                    };
                    const translatedRank = rankTranslation[rank] || rank;

                    // Переводим масть
                    const suitTranslation: Record<string, string> = {
                        'hearts': 'Черви',
                        'diamonds': 'Бубны',
                        'clubs': 'Трефы',
                        'spades': 'Пики'
                    };
                    const translatedSuit = suitTranslation[suit] || suit;

                    // Эмодзи масти
                    const suitEmoji = {
                        'hearts': '♥️',
                        'diamonds': '♦️',
                        'clubs': '♣️',
                        'spades': '♠️'
                    }[suit] || '';

                    return { emoji: suitEmoji, text: `${translatedRank} ${translatedSuit}` };
                }

                // Обычный номинал
                const rankTranslation: Record<string, string> = {
                    'J': 'Валет',
                    'Q': 'Дама',
                    'K': 'Король',
                    'A': 'Туз'
                };
                const translatedValue = rankTranslation[choice.value] || choice.value;
                return { emoji: null, text: translatedValue };

            default:
                return { emoji: null, text: '' };
        }
    };

    const { emoji, text } = getChoiceDisplay();
    const isConfirmed = choice.confirmed || false;

    // Проверяем, является ли значение числом (2-10)
    const isNumeric = /^\d+$/.test(text);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.7, y: -15 }}
                animate={{
                    opacity: 1,
                    scale: isConfirmed ? 1.1 : 1, // Увеличение при подтверждении
                    y: 0
                }}
                exit={{ opacity: 0, scale: 0.7, y: -15 }}
                transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    scale: {
                        type: "spring",
                        stiffness: isConfirmed ? 150 : 180,
                        damping: isConfirmed ? 10 : 12
                    }
                }}
                className={`absolute ${position === 'left' ? 'left-full ml-6' : 'right-full mr-6'} top-1/2 -translate-y-1/2 z-30`}
            >
                {/* Треугольный хвостик */}
                <div className={`absolute ${position === 'left' ? 'right-full mr-[-1px]' : 'left-full ml-[-1px]'} top-1/2 -translate-y-1/2`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" className="drop-shadow-lg">
                        <path
                            d={position === 'left' ? 'M 16 8 L 0 0 L 0 16 Z' : 'M 0 8 L 16 0 L 16 16 Z'}
                            fill="rgba(30, 30, 30, 0.9)"
                            stroke={isConfirmed ? 'rgba(34, 197, 94, 0.6)' : 'rgba(147, 51, 234, 0.4)'}
                            strokeWidth="1.5"
                        />
                    </svg>
                </div>

                {/* Пузырь с выбором - ОЧЕНЬ БОЛЬШОЙ + ЗЕЛЕНЫЙ при подтверждении */}
                <div className={`glass-dark px-8 py-4 rounded-2xl border-2 backdrop-blur-md transition-all duration-300
                    ${isConfirmed
                        ? 'border-green-400/60 shadow-[0_0_40px_rgba(34,197,94,0.5)]'
                        : 'border-purple-400/40 shadow-xl shadow-purple-500/30'
                    }`}>
                    <p className={`font-bold flex items-center gap-4 whitespace-nowrap transition-colors duration-300
                        ${isConfirmed ? 'text-green-100' : 'text-purple-100'}`}>
                        {emoji && <span className="text-4xl">{emoji}</span>}
                        {/* Используем Orbitron только для текста, не для цифр. Цифры крупнее */}
                        <span className={`${isNumeric ? 'text-2xl' : 'text-xl font-[family-name:var(--font-orbitron)]'}`}>
                            {text}
                        </span>
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
