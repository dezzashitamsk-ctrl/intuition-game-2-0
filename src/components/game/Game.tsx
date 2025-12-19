'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PredictionForm } from '../forms/PredictionForm';
import { PredictionResult } from '../ui/PredictionResult';
import { StartMenu } from '../ui/StartMenu';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { PlayerCard } from './PlayerCard';
import { CompactPlayer } from './CompactPlayer';
import { GameOverModal } from './GameOverModal';
import { ExitConfirmModal } from './ExitConfirmModal';
import Card from './Card';
import type { Card as CardType, Prediction } from '../../types/game';
import type { BotDifficulty } from '../../types/bot';
import { useGameLogic } from '../../hooks/useGameLogic';
import { SUITS } from '../../constants/game';
import { checkPrediction } from '../../utils/cardUtils';
import { useSound } from '../../hooks/useSound';
import { BOT_GREETINGS } from '../../constants/botMessages';
import { useBotService } from '../../contexts/BotContext';
import { analyticsService } from '../../services/AnalyticsService';

export const Game: React.FC = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [isSinglePlayer, setIsSinglePlayer] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);
    const [showCardFace, setShowCardFace] = useState(false);
    const [displayedCard, setDisplayedCard] = useState<CardType | undefined>(undefined);
    const [botThinking, setBotThinking] = useState<string | null>(null);
    const [showGameOver, setShowGameOver] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState<BotDifficulty>('medium');
    const [showResult, setShowResult] = useState(false);
    const { playSound, playWin, playLoss } = useSound();
    const [botGreeting, setBotGreeting] = useState<string>('');
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    const { gameState, startGame, makePrediction } = useGameLogic(2);
    const botService = useBotService();

    const isPlayerTurn = !isSinglePlayer || gameState.currentPlayerIndex === 0;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    const handleGameStart = (playerCount: number) => {
        startGame(playerCount);
        setIsSinglePlayer(playerCount === 1);
        setGameStarted(true);
        setShowGameOver(false);
        setDisplayedCard(undefined);
        playSound();

        // Начинаем сессию аналитики
        try {
            const isMobile = window.innerWidth < 768;
            analyticsService.startSession(isMobile ? 'mobile' : 'desktop');
        } catch (error) {
            console.error('Analytics session start error:', error);
        }

        if (playerCount === 1) {
            botService.setDifficulty(selectedDifficulty);
            const randomGreeting = BOT_GREETINGS[Math.floor(Math.random() * BOT_GREETINGS.length)];
            setBotGreeting(randomGreeting);
            setTimeout(() => setBotGreeting(''), 5000);
        }
    };

    const handleGameOver = () => {
        setShowGameOver(true);
        playSound();

        // Завершаем сессию аналитики
        try {
            analyticsService.endSession();
        } catch (error) {
            console.error('Analytics session end error:', error);
        }
    };

    const handleRestart = () => {
        setShowGameOver(false);
        handleGameStart(isSinglePlayer ? 1 : 2);
    };

    const handleExit = () => {
        setGameStarted(false);
        setShowGameOver(false);
    };

    const handleExitClick = () => {
        playSound();
        setShowExitConfirm(true);
    };

    const handleExitConfirm = () => {
        playSound();
        setShowExitConfirm(false);
        handleExit();
    };

    useEffect(() => {
        if (gameState.deck.length > 0 && !displayedCard) {
            setDisplayedCard(gameState.deck[0]);
        }
    }, [gameState.deck, displayedCard]);

    const handlePrediction = async (prediction: Prediction) => {
        if (isFlipping || !displayedCard) return;

        try {
            setIsFlipping(true);

            // Шаг 1: Переворачиваем карту (показываем лицо)
            setShowCardFace(true);
            playSound();

            // Шаг 2: Ждем пока карта перевернется
            await new Promise(resolve => setTimeout(resolve, 800));

            // Шаг 3: Обрабатываем предсказание
            makePrediction(prediction);

            // Шаг 4: Проигрываем звук результата ПОСЛЕ переворота
            // Небольшая задержка чтобы дать React обновить state
            await new Promise(resolve => setTimeout(resolve, 100));

            // Проверяем результат и проигрываем соответствующий звук
            const result = checkPrediction(prediction, displayedCard);
            if (result.correct) {
                playWin();
            } else {
                playLoss();
            }

            // Трекинг аналитики (не должен ломать игру)
            try {
                if (prediction.mode) {
                    const currentStreak = currentPlayer?.streak ?? 0;
                    analyticsService.trackPrediction(
                        prediction.mode,
                        prediction,
                        displayedCard,
                        result.correct,
                        result.totalPoints,
                        currentStreak
                    );
                }
            } catch (error) {
                console.error('Analytics tracking error:', error);
            }

            // Шаг 5: Показываем результат (карта остается лицом вверх)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Шаг 6: Переворачиваем карту обратно (скрываем лицо)
            setShowCardFace(false);
            await new Promise(resolve => setTimeout(resolve, 800));

            // Шаг 7: Меняем карту на следующую
            if (gameState.deck.length <= 1) {
                setDisplayedCard(undefined);
                handleGameOver();
            } else {
                setDisplayedCard(gameState.deck[1]);
            }

            setIsFlipping(false);
        } catch (error) {
            console.error('Ошибка в процессе анимации:', error);
            setIsFlipping(false);
            setShowCardFace(false);
        }
    };

    useEffect(() => {
        if (!isSinglePlayer || gameState.gameOver) {
            console.log('Bot check: skipped', { isSinglePlayer, gameOver: gameState.gameOver });
            return;
        }

        const isBotTurn = gameState.currentPlayerIndex === 1 && !isFlipping && displayedCard;

        console.log('Bot check:', {
            currentPlayerIndex: gameState.currentPlayerIndex,
            isFlipping,
            displayedCard: displayedCard ? 'exists' : 'null',
            isBotTurn
        });

        if (isBotTurn) {
            console.log('Bot is making a move!');
            const botPrediction = botService.generatePrediction(); // Бот НЕ видит карту!

            const getBotChoiceMessage = (prediction: Prediction) => {
                switch (prediction.mode) {
                    case 'color':
                        return `Выбираю цвет: ${prediction.color === 'red' ? 'красный' : 'чёрный'}`;
                    case 'suit':
                        return `Выбираю масть: ${SUITS[prediction.suit!].text}`;
                    case 'rank':
                        return `Выбираю номинал: ${prediction.rank}`;
                    case 'full':
                        return `Выбираю карту: ${SUITS[prediction.suit!].text} ${prediction.rank}`;
                    default:
                        return 'Думаю...';
                }
            };

            setBotThinking('Думаю...');

            const botTimer = setTimeout(() => {
                setBotThinking(getBotChoiceMessage(botPrediction));

                setTimeout(() => {
                    handlePrediction(botPrediction);
                    setBotThinking(null);
                }, 1500);
            }, 1000);

            return () => clearTimeout(botTimer);
        }
    }, [isSinglePlayer, gameState.currentPlayerIndex, isFlipping, displayedCard, gameState.deck.length, gameState.gameOver]);

    if (!gameStarted) {
        return (
            <div className="relative min-h-screen">
                <StartMenu
                    onStart={handleGameStart}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen relative">
            {/* Анимированный фон */}
            <AnimatedBackground variant="game" />

            {/* Главный контейнер */}
            <div className="container mx-auto p-4 md:p-8">
                <div className="glass-dark rounded-3xl p-6 md:p-8 relative">
                    {/* Кнопка выхода - правый верхний угол */}
                    <button
                        onClick={handleExitClick}
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
                            name={gameState.players[0]?.name ?? 'Игрок 1'}
                            score={gameState.players[0]?.score ?? 0}
                            previousScore={gameState.players[0]?.previousScore}
                            isActive={gameState.currentPlayerIndex === 0}
                            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
                        />

                        {/* Карточка бота с речевым пузырём */}
                        <div className="relative">
                            <PlayerCard
                                name={gameState.players[1]?.name ?? (isSinglePlayer ? 'Бот' : 'Игрок 2')}
                                score={gameState.players[1]?.score ?? 0}
                                previousScore={gameState.players[1]?.previousScore}
                                isActive={gameState.currentPlayerIndex === 1}
                                isBot={isSinglePlayer}
                                botThinking={botThinking}
                                botGreeting={botGreeting}
                                gradient="bg-gradient-to-r from-purple-500 to-purple-600"
                            />

                            {/* Речевой пузырь бота - Думаю */}
                            <AnimatePresence>
                                {botThinking && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: 10, scale: 0.9 }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeOut",
                                            scale: { type: "spring", stiffness: 200, damping: 15 }
                                        }}
                                        className="absolute right-full mr-6 top-0 z-30"
                                    >
                                        {/* Треугольный хвостик (справа) - SVG */}
                                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-[-1px]">
                                            <svg width="20" height="20" viewBox="0 0 20 20" className="drop-shadow-lg">
                                                <path
                                                    d="M 0 10 L 20 0 L 20 20 Z"
                                                    fill="rgba(30, 30, 30, 0.8)"
                                                    stroke="rgba(59, 130, 246, 0.3)"
                                                    strokeWidth="1"
                                                />
                                            </svg>
                                        </div>

                                        {/* Окошко сообщения */}
                                        <div className="glass-card px-6 py-4 rounded-3xl border border-blue-400/30 shadow-xl shadow-blue-500/20 backdrop-blur-md">
                                            <p className="text-blue-400 font-medium flex items-center gap-3 whitespace-nowrap text-base">
                                                <motion.span
                                                    animate={{
                                                        rotate: [0, 10, -10, 0],
                                                        scale: [1, 1.1, 1.1, 1]
                                                    }}
                                                    transition={{ duration: 0.6, repeat: Infinity }}
                                                    className="text-xl"
                                                >
                                                    🤔
                                                </motion.span>
                                                {botThinking}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Речевой пузырь бота - Приветствие */}
                            <AnimatePresence>
                                {botGreeting && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: 10, scale: 0.9 }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeOut",
                                            scale: { type: "spring", stiffness: 200, damping: 15 }
                                        }}
                                        className="absolute right-full mr-6 top-16 z-30"
                                    >
                                        {/* Треугольный хвостик (справа) - SVG */}
                                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-[-1px]">
                                            <svg width="20" height="20" viewBox="0 0 20 20" className="drop-shadow-lg">
                                                <path
                                                    d="M 0 10 L 20 0 L 20 20 Z"
                                                    fill="rgba(30, 30, 30, 0.8)"
                                                    stroke="rgba(59, 130, 246, 0.3)"
                                                    strokeWidth="1"
                                                />
                                            </svg>
                                        </div>

                                        {/* Окошко сообщения */}
                                        <div className="glass-card px-6 py-4 rounded-3xl border border-blue-400/30 shadow-xl shadow-blue-500/20 backdrop-blur-md">
                                            <p className="text-gray-300 font-medium flex items-center gap-3 whitespace-nowrap text-sm italic">
                                                <span className="text-lg">💬</span>
                                                {botGreeting}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Карта и форма предсказания */}
                    <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-8 justify-center">
                        <div className="flex flex-col items-center">
                            <div className="card-container mb-4 relative">
                                {/* Компактные индикаторы игроков для мобильных */}
                                <div className="md:hidden">
                                    <CompactPlayer
                                        score={gameState.players[0]?.score ?? 0}
                                        previousScore={gameState.players[0]?.previousScore}
                                        isActive={gameState.currentPlayerIndex === 0}
                                        position="left"
                                        color="border-blue-500"
                                        name={gameState.players[0]?.name ?? 'Игрок 1'}
                                    />
                                    <CompactPlayer
                                        score={gameState.players[1]?.score ?? 0}
                                        previousScore={gameState.players[1]?.previousScore}
                                        isActive={gameState.currentPlayerIndex === 1}
                                        position="right"
                                        color="border-purple-500"
                                        name={gameState.players[1]?.name ?? (isSinglePlayer ? 'Бот' : 'Игрок 2')}
                                        isBot={isSinglePlayer}
                                    />
                                </div>

                                <div className={`card-wrapper ${showCardFace ? 'is-flipped' : ''}`}>
                                    <Card card={displayedCard} isHidden={true} />
                                </div>
                            </div>
                            <div className="glass-dark rounded-xl px-6 py-4 text-center border-2 border-white/10">
                                <div className="text-4xl font-bold text-blue-400 font-[family-name:var(--font-orbitron)]">{gameState.deck.length}</div>
                            </div>
                        </div>
                        <div className="prediction-container">
                            <PredictionForm
                                onSubmit={handlePrediction}
                                disabled={isFlipping || !isPlayerTurn || currentPlayer?.chips < gameState.roundBet}
                            />
                        </div>
                    </div>

                    {/* Результат предсказания */}
                    {gameState.lastPrediction && gameState.lastResult && displayedCard ? (
                        <div className="mt-8 prediction-container">
                            <PredictionResult
                                prediction={gameState.lastPrediction}
                                actual={displayedCard}
                                result={gameState.lastResult}
                                chipsWon={currentPlayer?.chips - (currentPlayer?.previousScore ?? 0)}
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
                    players={gameState.players}
                    onRestart={handleRestart}
                    onExit={handleExit}
                />
            )}

            {/* Модальное окно подтверждения выхода */}
            <ExitConfirmModal
                isOpen={showExitConfirm}
                onConfirm={handleExitConfirm}
                onCancel={() => {
                    playSound();
                    setShowExitConfirm(false);
                }}
            />
        </div>
    );
}; 