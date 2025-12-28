'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface CompactPlayerProps {
    score: number
    previousScore?: number
    isActive: boolean
    position: 'left' | 'right' | 'inline'
    color: string
    name: string
    isBot?: boolean
    playerChoice?: { type: 'suit' | 'color' | 'value'; value: string; confirmed?: boolean } | null
}

export function CompactPlayer({ score, previousScore, isActive, position, color, name, isBot, playerChoice }: CompactPlayerProps) {
    const scoreChanged = previousScore !== undefined && previousScore !== score

    // Функция для получения красивого текста выбора на русском
    const getChoiceDisplay = (choice: { type: string; value: string }) => {
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
                const colorEmoji = choice.value === 'red' ? '🔴' : '⚫';
                const colorName = choice.value === 'red' ? 'Красная' : 'Черная';
                return { emoji: colorEmoji, text: colorName };

            case 'value':
                if (choice.value.includes(' ')) {
                    const [rank, suit] = choice.value.split(' ');
                    const rankTranslation: Record<string, string> = {
                        'J': 'Валет', 'Q': 'Дама', 'K': 'Король', 'A': 'Туз'
                    };
                    const translatedRank = rankTranslation[rank] || rank;
                    const suitTranslation: Record<string, string> = {
                        'hearts': 'Черви', 'diamonds': 'Бубны',
                        'clubs': 'Трефы', 'spades': 'Пики'
                    };
                    const translatedSuit = suitTranslation[suit] || suit;
                    const suitEmoji = {
                        'hearts': '♥️', 'diamonds': '♦️',
                        'clubs': '♣️', 'spades': '♠️'
                    }[suit] || '';
                    return { emoji: suitEmoji, text: `${translatedRank} ${translatedSuit}` };
                }
                const rankTranslation: Record<string, string> = {
                    'J': 'Валет', 'Q': 'Дама', 'K': 'Король', 'A': 'Туз'
                };
                return { emoji: null, text: rankTranslation[choice.value] || choice.value };

            default:
                return { emoji: null, text: choice.value };
        }
    };

    return (
        <motion.div
            className={`
                relative
                ${position === 'left' || position === 'right'
                    ? `absolute top-1/2 -translate-y-1/2 ${position === 'left' ? '-left-16' : '-right-16'}`
                    : ''}
                flex flex-col items-center gap-2
            `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Player Choice Bubble - только для inline позиции (мобильные) */}
            {position === 'inline' && playerChoice && (() => {
                const { emoji, text } = getChoiceDisplay(playerChoice);
                const isOpponent = name.includes('Оппонент') || name.includes('2') || isBot;

                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`
                            absolute z-20
                            ${isOpponent ? '-left-24 top-0' : '-right-24 top-0'}
                        `}
                    >
                        <div className={`
                            glass-card px-3 py-2 rounded-xl 
                            border-2 shadow-xl backdrop-blur-md 
                            ${isOpponent
                                ? 'border-purple-400/40 shadow-purple-500/30'
                                : 'border-blue-400/40 shadow-blue-500/30'}
                        `}>
                            <p className={`
                                font-bold flex items-center gap-1.5 whitespace-nowrap text-xs
                                ${isOpponent ? 'text-purple-200' : 'text-blue-200'}
                            `}>
                                {emoji && <span className="text-base">{emoji}</span>}
                                <span className="font-[family-name:var(--font-orbitron)]">{text}</span>
                            </p>
                        </div>
                    </motion.div>
                );
            })()}

            {/* Аватарка */}
            <motion.div
                className={`
                    w-12 h-12 rounded-full
                    border-2 transition-all duration-300
                    ${isActive
                        ? `${color} shadow-[0_0_20px_rgba(59,130,246,0.5)]`
                        : 'border-white/20'
                    }
                    p-[2px]
                `}
                animate={isActive ? {
                    scale: [1, 1.1, 1],
                    transition: { duration: 1, repeat: Infinity }
                } : {}}
            >
                <div
                    className="w-full h-full rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                    <img
                        src={
                            isBot
                                ? '/avatars/bot.jpg'
                                : name.includes('2') || name.includes('Игрок 2')
                                    ? '/avatars/player2.jpg'
                                    : '/avatars/player.jpg'
                        }
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
            </motion.div>

            {/* Очки */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={score}
                        initial={scoreChanged ? { scale: 1.5, opacity: 0 } : false}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`
                            px-2 py-1 rounded-lg
                            bg-gradient-to-br from-white/10 to-white/5
                            border border-white/20
                            backdrop-blur-sm
                        `}
                    >
                        <div className="text-lg font-bold text-white font-[family-name:var(--font-orbitron)]">
                            {score}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Звёздочка для активного игрока */}
                {isActive && (
                    <motion.div
                        className="absolute -top-1 -right-1"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                    >
                        <span className="text-yellow-400 text-sm">⭐</span>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}
