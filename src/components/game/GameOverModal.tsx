import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profileService, PlayerProfile } from '../../services/ProfileService';

interface GameOverModalProps {
    players: Array<{
        score: number;
        name: string;
    }>;
    onRestart: () => void;
    onExit: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
    players,
    onRestart,
    onExit
}) => {
    const [savedProfiles, setSavedProfiles] = useState<PlayerProfile[]>([]);

    const winner = players.reduce((prev, current) =>
        prev.score > current.score ? prev : current
    );

    // Сохраняем результаты игры при открытии модального окна
    useEffect(() => {
        const profiles = players.map(player => {
            const isWinner = player.name === winner.name;
            return profileService.saveGameResult(player.name, player.score, isWinner);
        });
        setSavedProfiles(profiles);
        console.log('Game results saved:', profiles);
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 50 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="glass-dark rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden border-2 border-white/10"
                >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-purple-500/10" />

                    {/* Контент */}
                    <div className="relative z-10">
                        {/* Заголовок */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="text-center mb-6"
                        >
                            <div className="text-6xl mb-3">🏆</div>
                            <h2 className="text-4xl font-bold text-white mb-2 font-[family-name:var(--font-orbitron)]">
                                Игра окончена!
                            </h2>
                        </motion.div>

                        {/* Победитель */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-dark rounded-2xl p-5 mb-6 text-center border-2 border-green-400/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                        >
                            <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider">Победитель</div>
                            <div className="text-3xl font-bold text-yellow-400 flex items-center justify-center gap-2 font-[family-name:var(--font-orbitron)]">
                                <span>👑</span>
                                <span>{winner.name}</span>
                            </div>
                        </motion.div>

                        {/* Результаты */}
                        <div className="space-y-3 mb-6">
                            <h3 className="text-xl font-semibold text-white mb-4 font-[family-name:var(--font-orbitron)]">Результаты игры:</h3>
                            {players.map((player, index) => {
                                const profile = savedProfiles.find(p => p.name === player.name);
                                const isWinner = player.name === winner.name;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className={`
                                            glass-dark rounded-xl p-4 border-2
                                            ${isWinner ? 'border-yellow-400/40 shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'border-white/10'}
                                        `}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium text-white flex items-center gap-2 font-[family-name:var(--font-orbitron)]">
                                                {isWinner && <span>👑</span>}
                                                {player.name}
                                            </span>
                                            <span className="font-bold text-2xl text-green-400 font-[family-name:var(--font-orbitron)]">
                                                +{player.score} ⭐
                                            </span>
                                        </div>
                                        {profile && (
                                            <div className="text-xs text-gray-400 flex gap-3">
                                                <span>Всего: {profile.totalScore}</span>
                                                <span>•</span>
                                                <span>Игр: {profile.gamesPlayed}</span>
                                                <span>•</span>
                                                <span>Побед: {profile.gamesWon}</span>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Кнопки */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-3"
                        >
                            <button
                                onClick={onRestart}
                                className="flex-1 glass-dark hover:glass-card hover:border-green-400/50
                                         border-2 border-white/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]
                                         text-white font-medium py-3 px-4 rounded-xl
                                         transition-all duration-300 hover:scale-105
                                         flex items-center justify-center gap-2"
                            >
                                <span>🎮</span>
                                <span>Играть снова</span>
                            </button>
                            <button
                                onClick={onExit}
                                className="flex-1 glass-dark hover:glass-card
                                         border-2 border-white/10 hover:border-red-400/50
                                         text-gray-300 hover:text-white font-medium py-3 px-4 rounded-xl
                                         transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(248,113,113,0.2)]
                                         flex items-center justify-center gap-2"
                            >
                                <span>🏠</span>
                                <span>Выход</span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Анимированная полоса */}
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-purple-500 to-yellow-500"
                        initial={{ scaleX: 0 }}
                        animate={{ 
                            scaleX: 1,
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                        }}
                        transition={{
                            scaleX: { duration: 1, delay: 0.5 },
                            backgroundPosition: {
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear"
                            }
                        }}
                        style={{ transformOrigin: 'left', backgroundSize: '200% 100%' }}
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};