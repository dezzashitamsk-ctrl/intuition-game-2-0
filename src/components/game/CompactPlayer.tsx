'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface CompactPlayerProps {
    score: number
    previousScore?: number
    isActive: boolean
    position: 'left' | 'right'
    color: string
    name: string
    isBot?: boolean
}

export function CompactPlayer({ score, previousScore, isActive, position, color, name, isBot }: CompactPlayerProps) {
    const scoreChanged = previousScore !== undefined && previousScore !== score

    return (
        <motion.div
            className={`
                absolute top-1/2 -translate-y-1/2
                ${position === 'left' ? '-left-16' : '-right-16'}
                flex flex-col items-center gap-2
            `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
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
