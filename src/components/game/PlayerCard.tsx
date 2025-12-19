import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerCardProps {
    name: string;
    score: number;
    previousScore?: number;
    isActive: boolean;
    isBot?: boolean;
    botThinking?: string | null;
    botGreeting?: string;
    gradient: string;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
    name,
    score,
    previousScore,
    isActive,
    isBot = false,
    botThinking,
    botGreeting,
    gradient
}) => {
    const scoreDiff = previousScore !== undefined ? score - previousScore : 0;
    const [showScoreDiff, setShowScoreDiff] = useState(false);

    // Показываем прибавку очков на 3 секунды
    useEffect(() => {
        if (scoreDiff > 0) {
            setShowScoreDiff(true);
            const timer = setTimeout(() => {
                setShowScoreDiff(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [scoreDiff, score]);

    return (
        <motion.div
            className="relative w-full md:w-72"
            animate={{
                y: isActive ? -3 : 0
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
        >
            {/* Glassmorphism карточка - Золотистый фон для активного */}
            <div className={`
                glass-card rounded-2xl p-5 relative overflow-visible
                transition-all duration-250 will-change-transform
                ${isActive
                    ? '!bg-gradient-to-br !from-yellow-500/15 !via-amber-500/10 !to-yellow-500/5 shadow-[0_0_40px_rgba(251,191,36,0.4)]'
                    : 'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]'}
            `}>
                {/* Контент - Премиум Зеркальный Layout */}
                <div className={`relative z-10 flex gap-5 ${isBot ? 'flex-row-reverse' : 'flex-row'} items-center`}>
                    {/* Аватарка - Премиум стиль */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.1,
                            type: "spring",
                            stiffness: 200,
                            damping: 15
                        }}
                        className="relative flex-shrink-0 group"
                    >
                        {/* Градиентная рамка */}
                        <div className={`
                            w-[84px] h-[84px] rounded-full p-[2px] transition-all duration-300
                            ${isActive
                                ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                                : 'bg-gradient-to-br from-white/20 to-white/5'}
                        `}>
                            <div className="w-full h-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                <img
                                    src={
                                        isBot
                                            ? '/avatars/bot.jpg'
                                            : name.includes('2') || name.includes('Игрок 2')
                                                ? '/avatars/player2.jpg'
                                                : '/avatars/player.jpg'
                                    }
                                    alt={name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Информация - Улучшенная типографика */}
                    <div className="flex-1 space-y-2.5">
                        {/* Имя - Крупнее и выразительнее */}
                        <h3 className="text-3xl font-bold text-white tracking-tight leading-none font-[family-name:var(--font-orbitron)]">
                            {name}
                        </h3>

                        {/* Очки - Более яркие */}
                        <div className="relative">
                            <div className="space-y-1">
                                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Очки</span>
                                <div className="flex items-baseline gap-2.5">
                                    <motion.span
                                        key={score}
                                        initial={{ scale: 1.2, opacity: 0.5 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: [0.34, 1.56, 0.64, 1]
                                        }}
                                        className="text-4xl font-extrabold text-white tabular-nums font-[family-name:var(--font-orbitron)]"
                                    >
                                        {score}
                                    </motion.span>
                                    <motion.span
                                        animate={{
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.1, 1.1, 1]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="text-2xl"
                                    >
                                        ⭐
                                    </motion.span>
                                </div>
                            </div>

                            {/* Анимация прибавки очков - Улучшенная */}
                            <AnimatePresence>
                                {showScoreDiff && scoreDiff > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20, scale: 0.5 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -25, scale: 0.5 }}
                                        transition={{
                                            duration: 0.4,
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20
                                        }}
                                        className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-3 py-1.5 shadow-lg shadow-green-500/50"
                                    >
                                        <span className="text-white text-sm font-bold">
                                            +{scoreDiff}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Индикатор хода убран - теперь на контуре блока */}
            </div>
        </motion.div>
    );
};