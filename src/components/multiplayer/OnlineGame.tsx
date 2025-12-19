'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PredictionForm } from '../forms/PredictionForm';
import { PredictionResult } from '../ui/PredictionResult';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { PlayerCard } from '../game/PlayerCard';
import { CompactPlayer } from '../game/CompactPlayer';
import { GameOverModal } from '../game/GameOverModal';
import Card from '../game/Card';
import type { Card as CardType, Prediction } from '../../types/game';
import { useSound } from '../../hooks/useSound';
import type { GameRoom } from '../../lib/supabase';

interface OnlineGameProps {
    room: GameRoom;
    playerRole: 'host' | 'guest';
    isMyTurn: boolean;
    isFinished: boolean;
    currentCard: any;
    opponent: { id: string | null | undefined; score: number | null | undefined; streak: number | null | undefined };
    player: { id: string | null | undefined; score: number | null | undefined; streak: number | null | undefined };
    makeTurn: (prediction: Prediction) => Promise<{ correct: boolean; totalPoints: number }>;
    onLeave: () => void;
}

export const OnlineGame: React.FC<OnlineGameProps> = ({
    room,
    playerRole,
    isMyTurn,
    isFinished,
    currentCard,
    opponent,
    player,
    makeTurn,
    onLeave
}) => {
    const [isFlipping, setIsFlipping] = useState(false);
    const [showCardFace, setShowCardFace] = useState(false);
    const [lastRevealedCard, setLastRevealedCard] = useState<CardType | undefined>(undefined);
    const [showGameOver, setShowGameOver] = useState(false);
    const [frozenCard, setFrozenCard] = useState<CardType | undefined>(undefined);
    const { playSound, playWin, playLoss } = useSound();

    // Freeze card during animation to prevent updates
    const displayCard = isFlipping ? frozenCard : currentCard;

    // Check for game over
    useEffect(() => {
        if (isFinished && !showGameOver) {
            setShowGameOver(true);
            playSound();
        }
    }, [isFinished, showGameOver, playSound]);

    const handlePrediction = async (prediction: Prediction) => {
        if (isFlipping || !currentCard) return;

        try {
            setIsFlipping(true);

            // Freeze current card for animation
            setFrozenCard(currentCard);

            // Сохраняем текущую карту как последнюю открытую
            setLastRevealedCard(currentCard);

            // Шаг 1: Переворачиваем карту (показываем лицо)
            setShowCardFace(true);
            playSound();

            // Шаг 2: Ждем пока карта перевернется
            await new Promise(resolve => setTimeout(resolve, 800));

            // Шаг 3: Отправляем ход на сервер и получаем результат
            const result = await makeTurn(prediction);

            // Шаг 4: Проигрываем звук СРАЗУ на основе результата
            if (result.correct) {
                playWin(); // Правильно - играем звук победы
            } else {
                playLoss(); // Неправильно - играем звук поражения
            }

            // Шаг 5: Показываем результат (карта остается лицом вверх)
            await new Promise(resolve => setTimeout(resolve, 2500));

            // Шаг 6: Переворачиваем карту обратно (скрываем лицо)
            setShowCardFace(false);
            await new Promise(resolve => setTimeout(resolve, 800));

            // Unfreeze card - теперь можно показать следующую
            setFrozenCard(undefined);
            setIsFlipping(false);
        } catch (error) {
            console.error('Ошибка в процессе анимации:', error);
            setFrozenCard(undefined);
            setIsFlipping(false);
            setShowCardFace(false);
        }
    };

    const handleRestart = () => {
        // В онлайн режиме перезапуск не поддерживается
        onLeave();
    };

    const handleExit = () => {
        onLeave();
    };

    // Создаем объекты игроков в формате, совместимом с GameOverModal
    const players = [
        {
            name: playerRole === 'host' ? 'Вы' : 'Вы',
            score: player.score ?? 0,
            chips: player.score ?? 0,
            streak: player.streak ?? 0,
            previousScore: 0
        },
        {
            name: 'Оппонент',
            score: opponent.score ?? 0,
            chips: opponent.score ?? 0,
            streak: opponent.streak ?? 0,
            previousScore: 0
        }
    ];

    return (
        <div className="min-h-screen relative">
            {/* Анимированный фон */}
            <AnimatedBackground variant="game" />

            {/* Главный контейнер */}
            <div className="container mx-auto p-4 md:p-8">
                <div className="glass-dark rounded-3xl p-6 md:p-8 relative">
                    {/* Кнопка выхода - правый верхний угол */}
                    <button
                        onClick={onLeave}
                        className="absolute top-6 -right-6 z-20
                                 w-12 h-12 rounded-full
                                 bg-gradient-to-br from-red-500/20 to-red-500/10
                                 border-2 border-red-500/40
                                 hover:border-red-500
                                 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]
                                 hover:scale-110
                                 active:scale-95
                                 transition-all duration-300
                                 flex items-center justify-center group"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-red-400 transform 
                                     transition-transform duration-300 
                                     group-hover:rotate-90"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    {/* Карточки игроков - скрыты на мобильных */}
                    <div className="hidden md:flex justify-between items-center mb-8 relative">
                        <PlayerCard
                            name={playerRole === 'host' ? 'Вы (Хост)' : 'Вы (Гость)'}
                            score={player.score ?? 0}
                            previousScore={0}
                            isActive={isMyTurn}
                            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
                        />

                        <PlayerCard
                            name="Оппонент"
                            score={opponent.score ?? 0}
                            previousScore={0}
                            isActive={!isMyTurn}
                            gradient="bg-gradient-to-r from-purple-500 to-purple-600"
                        />
                    </div>

                    {/* Карта и форма предсказания */}
                    <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-8 justify-center">
                        <div className="flex flex-col items-center">
                            <div className="card-container mb-4 relative">
                                {/* Компактные индикаторы игроков для мобильных */}
                                <div className="md:hidden">
                                    <CompactPlayer
                                        score={player.score ?? 0}
                                        previousScore={0}
                                        isActive={isMyTurn}
                                        position="left"
                                        color="border-blue-500"
                                        name="Вы"
                                    />
                                    <CompactPlayer
                                        score={opponent.score ?? 0}
                                        previousScore={0}
                                        isActive={!isMyTurn}
                                        position="right"
                                        color="border-purple-500"
                                        name="Оппонент"
                                    />
                                </div>

                                <div className={`card-wrapper ${showCardFace ? 'is-flipped' : ''}`}>
                                    <Card card={displayCard} isHidden={true} />
                                </div>
                            </div>
                            <div className="glass-dark rounded-xl px-6 py-4 text-center border-2 border-white/10">
                                <div className="text-4xl font-bold text-blue-400 font-[family-name:var(--font-orbitron)]">
                                    {room.deck.length - room.current_card_index}
                                </div>
                            </div>
                        </div>
                        <div className="prediction-container">
                            <PredictionForm
                                onSubmit={handlePrediction}
                                disabled={isFlipping || !isMyTurn}
                            />
                        </div>
                    </div>

                    {/* Результат предсказания */}
                    {room.last_prediction && room.last_result && lastRevealedCard ? (
                        <div className="mt-8 prediction-container">
                            <PredictionResult
                                prediction={room.last_prediction}
                                actual={lastRevealedCard}
                                result={room.last_result}
                                chipsWon={room.last_result.totalPoints}
                            />
                        </div>
                    ) : (
                        <div className="mt-8 prediction-container">
                            <div className="glass-dark rounded-3xl p-6 shadow-xl h-[400px] flex flex-col justify-center items-center text-center">
                                {/* Пустой блок до начала игры */}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Модальное окно Game Over */}
            {showGameOver && (
                <GameOverModal
                    players={players}
                    onRestart={handleRestart}
                    onExit={handleExit}
                />
            )}
        </div>
    );
};
