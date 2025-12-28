'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PredictionForm } from '../forms/PredictionForm';
import { CollapsiblePredictionPanel } from '../forms/CollapsiblePredictionPanel';
import { PredictionResult } from '../ui/PredictionResult';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { PlayerCard } from '../game/PlayerCard';
import { CompactPlayer } from '../game/CompactPlayer';
import { GameOverModal } from '../game/GameOverModal';
import Card from '../game/Card';
import { CompactTimer } from './CompactTimer';
import { DisconnectionModal } from '../game/DisconnectionModal';
import { ReconnectingModal } from '../game/ReconnectingModal';
import { ExitConfirmModal } from '../game/ExitConfirmModal';
import { ReconnectedToast } from '../game/ReconnectedToast';
import type { Card as CardType, Prediction } from '../../types/game';
import { useSound } from '../../hooks/useSound';
import { useHeartbeat } from '../../hooks/useHeartbeat';
import type { GameRoom } from '../../lib/supabase';
import { multiplayerService } from '../../services/MultiplayerService';

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
    const [timeLeft, setTimeLeft] = useState(room.turn_timeout_seconds);
    const [showDisconnectionModal, setShowDisconnectionModal] = useState(false);
    const [reconnectionDeadline, setReconnectionDeadline] = useState<Date | null>(null);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const [reconnectAttempt, setReconnectAttempt] = useState(0);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [showReconnectedToast, setShowReconnectedToast] = useState(false);
    const processingRef = useRef(false); // Immediate lock to prevent double-click
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null); // Track timer interval
    const { playSound, playWin, playLoss } = useSound();

    // Heartbeat - send every 5 seconds
    useHeartbeat(room.id, playerRole);

    // Disconnect detection - check opponent heartbeat
    useEffect(() => {
        console.log('[Disconnect Check] useEffect triggered', {
            hasRoom: !!room,
            playerRole,
            roomId: room?.id
        });

        if (!room || !playerRole) {
            console.log('[Disconnect Check] Skipping - no room or playerRole');
            return;
        }

        console.log('[Disconnect Check] Setting up interval for', playerRole);

        const checkOpponentHeartbeat = () => {
            const opponentField = playerRole === 'host'
                ? 'guest_last_heartbeat'
                : 'host_last_heartbeat';

            const lastBeat = room[opponentField];

            console.log('[Disconnect Check]', {
                playerRole,
                opponentField,
                lastBeat,
                hasDisconnectedPlayer: !!room.disconnected_player
            });

            if (!lastBeat) {
                console.log('[Disconnect Check] No heartbeat yet from opponent');
                return; // No heartbeat yet
            }

            const lastBeatTime = new Date(lastBeat).getTime();
            const now = Date.now();
            const secondsSinceLastBeat = (now - lastBeatTime) / 1000;

            console.log('[Disconnect Check] Seconds since last beat:', secondsSinceLastBeat);

            // If no heartbeat for 15 seconds → disconnected
            if (secondsSinceLastBeat > 15 && !room.disconnected_player) {
                console.log('[Disconnect] Opponent heartbeat timeout:', secondsSinceLastBeat, 's');
                const opponentRole = playerRole === 'host' ? 'guest' : 'host';
                multiplayerService.handleDisconnect(opponentRole, room.id);
            }
        };

        // Check immediately
        checkOpponentHeartbeat();

        // Then check every 5 seconds
        const interval = setInterval(checkOpponentHeartbeat, 5000);

        return () => {
            console.log('[Disconnect Check] Cleanup interval');
            clearInterval(interval);
        };
    }, [room.id, playerRole]); // FIXED: Only room.id, not entire room object
    // Presence tracking - DISABLED until properly implemented
    // const { isOnline, opponentOnline } = usePresence(
    //     room.id,
    //     playerRole === 'host' ? room.host_id : room.guest_id || '',
    //     playerRole,
    //     async () => {
    //         // Opponent disconnected
    //         try {
    //             console.log('[OnlineGame] Opponent disconnected');
    //             const opponentRole = playerRole === 'host' ? 'guest' : 'host';
    //             await multiplayerService.handleDisconnect(opponentRole);
    //         } catch (error) {
    //             console.error('[OnlineGame] Error handling disconnect:', error);
    //         }
    //     },
    //     async () => {
    //         // Opponent reconnected
    //         try {
    //             console.log('[OnlineGame] Opponent reconnected');
    //             await multiplayerService.handleReconnect();
    //             setShowDisconnectionModal(false);
    //         } catch (error) {
    //             console.error('[OnlineGame] Error handling reconnect:', error);
    //         }
    //     }
    // );

    // Freeze card during animation to prevent updates
    // When card is revealed (flipped), show frozen card
    // When card is hidden (back), show last revealed card to prevent showing next card
    const displayCard = room.card_revealed
        ? (frozenCard || currentCard)  // Revealed: show frozen or current
        : (frozenCard || lastRevealedCard || currentCard);  // Hidden: show frozen/last to avoid next

    // Can only make move if it's my turn AND not currently flipping
    const canMakeMove = isMyTurn && !isFlipping && !processingRef.current;

    // Heartbeat - update presence every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            multiplayerService.updatePlayerPresence();
        }, 5000);

        // Initial heartbeat
        multiplayerService.updatePlayerPresence();

        return () => clearInterval(interval);
    }, []);

    // Turn timer countdown - обновляется для обоих игроков
    useEffect(() => {
        // Clear any existing interval first
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }

        // Pause timer during animation or if turn not started
        // OR if card is revealed (someone is making a turn)
        if (room.card_revealed || !room.turn_started_at || isFlipping) {
            setTimeLeft(room.turn_timeout_seconds);
            return;
        }

        // Also pause if it's not my turn (safety check)
        if (!isMyTurn) {
            setTimeLeft(room.turn_timeout_seconds);
            return;
        }

        const startTime = new Date(room.turn_started_at).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = Math.max(0, room.turn_timeout_seconds - elapsed);

        setTimeLeft(remaining);

        // Start new interval and store ref
        timerIntervalRef.current = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            const remaining = Math.max(0, room.turn_timeout_seconds - elapsed);
            setTimeLeft(remaining);
        }, 1000);

        // Cleanup
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        };
    }, [isFlipping, room.card_revealed, room.turn_started_at, room.turn_timeout_seconds, isMyTurn]);

    // Sync card flip with room state (both players see flip)
    useEffect(() => {
        setShowCardFace(room.card_revealed);
    }, [room.card_revealed]);

    // Simple animation sync for second player (without sound loops)
    const lastCardRevealedRef = useRef(false);
    useEffect(() => {
        // Skip if we're the one processing
        if (processingRef.current) return;

        // Card just revealed
        if (room.card_revealed && !lastCardRevealedRef.current) {
            lastCardRevealedRef.current = true;
            setIsFlipping(true);
            setFrozenCard(room.current_card);
            setLastRevealedCard(room.current_card);
        }

        // Card just hidden
        if (!room.card_revealed && lastCardRevealedRef.current) {
            lastCardRevealedRef.current = false;
            setTimeout(() => {
                setIsFlipping(false);
                setFrozenCard(undefined);
            }, 800);
        }
    }, [room.card_revealed, room.current_card]);

    // Freeze/unfreeze card for both players based on card_revealed
    useEffect(() => {
        if (room.card_revealed && currentCard && !frozenCard) {
            setFrozenCard(currentCard);
            setLastRevealedCard(currentCard); // Save for both players
        } else if (!room.card_revealed && frozenCard) {
            setFrozenCard(undefined);
        }
    }, [room.card_revealed, currentCard, frozenCard]);

    // Reset isFlipping when turn changes (prevents brief card activation)
    useEffect(() => {
        if (!isMyTurn && isFlipping) {
            setIsFlipping(false);
            processingRef.current = false;
        }
    }, [isMyTurn, isFlipping]);

    // Check for disconnection and set deadline
    useEffect(() => {
        console.log('[Disconnection useEffect]', {
            disconnected_player: room.disconnected_player,
            playerRole,
            reconnection_deadline: room.reconnection_deadline,
            showDisconnectionModal
        });

        if (room.disconnected_player && room.disconnected_player !== playerRole) {
            // Opponent disconnected
            console.log('[Disconnection] Opponent disconnected, showing modal');
            setShowDisconnectionModal(true);
            if (room.reconnection_deadline) {
                const deadline = new Date(room.reconnection_deadline);
                console.log('[Disconnection] Setting deadline:', deadline);
                setReconnectionDeadline(deadline);
            }
        } else {
            // Check if opponent just reconnected
            if (showDisconnectionModal) {
                // Was showing disconnection modal, now opponent is back
                console.log('[Disconnection] Opponent reconnected!');
                setShowReconnectedToast(true);
                // Reset timer to full time
                setTimeLeft(room.turn_timeout_seconds);
            }
            setShowDisconnectionModal(false);
            setReconnectionDeadline(null);
        }
    }, [room.disconnected_player, room.reconnection_deadline, playerRole, showDisconnectionModal, room.turn_timeout_seconds]);

    // Check for game over
    useEffect(() => {
        if (isFinished && !showGameOver) {
            setShowGameOver(true);
            playSound();
        }
    }, [isFinished, showGameOver, playSound]);

    const handlePrediction = async (prediction: Prediction) => {
        if (isFlipping || !currentCard || processingRef.current) return;
        processingRef.current = true;

        // IMMEDIATELY stop timer
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }

        try {
            setIsFlipping(true);
            setFrozenCard(currentCard);
            setLastRevealedCard(currentCard);

            // Play flip sound
            playSound();

            // Wait for flip animation
            await new Promise(resolve => setTimeout(resolve, 800));

            // Call server
            const result = await makeTurn(prediction);

            // Play result sound immediately
            if (result.correct) {
                playWin();
            } else {
                playLoss();
            }

            // Show result
            await new Promise(resolve => setTimeout(resolve, 2500));

            // Hide card
            await multiplayerService.hideCard();

            // Wait for flip back
            await new Promise(resolve => setTimeout(resolve, 800));

            // Cleanup
            setFrozenCard(undefined);
            setIsFlipping(false);
            processingRef.current = false;
        } catch (error) {
            console.error('Error making turn:', error);
            setFrozenCard(undefined);
            setIsFlipping(false);
            processingRef.current = false;
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
                        onClick={() => setShowExitConfirm(true)}
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
                        {/* Мой таймер (слева) */}
                        <div className="flex items-center gap-4">
                            <PlayerCard
                                name="Вы"
                                score={player.score ?? 0}
                                previousScore={0}
                                isActive={isMyTurn}
                                timeLeft={isMyTurn ? timeLeft : undefined}
                                gradient="bg-gradient-to-r from-blue-500 to-blue-600"
                                playerChoice={playerRole === 'host' ? room.host_current_choice : room.guest_current_choice}
                            />
                            {/* Мой таймер - активен когда мой ход */}
                            <CompactTimer
                                timeLeft={timeLeft}
                                totalTime={room.turn_timeout_seconds}
                                isActive={isMyTurn}
                                onTimeout={() => multiplayerService.skipTurn()}
                            />
                        </div>

                        {/* Таймер оппонента (справа) */}
                        <div className="flex items-center gap-4">
                            {/* Таймер оппонента - активен когда НЕ мой ход */}
                            <CompactTimer
                                timeLeft={timeLeft}
                                totalTime={room.turn_timeout_seconds}
                                isActive={!isMyTurn}
                            />
                            <PlayerCard
                                name={playerRole === 'host' ? 'Гость' : 'Хост'}
                                score={opponent.score ?? 0}
                                previousScore={0}
                                isActive={!isMyTurn}
                                gradient="bg-gradient-to-r from-purple-500 to-purple-600"
                                playerChoice={playerRole === 'host' ? room.guest_current_choice : room.host_current_choice}
                                timeLeft={!isMyTurn ? timeLeft : undefined}
                            />
                        </div>
                    </div>

                    {/* Карта и форма предсказания */}
                    <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-8 justify-center">
                        <div className="flex flex-col items-center gap-4">
                            {/* Карта */}
                            <div className="card-container relative">
                                {/* Компактные индикаторы игроков для мобильных - СТАРЫЙ ВАРИАНТ (скрыт) */}
                                <div className="hidden">
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

                            {/* Счетчик карт с игроками - НОВЫЙ МОБИЛЬНЫЙ LAYOUT */}
                            <div className="flex items-center gap-3 md:hidden">
                                {/* Игрок 1 */}
                                <CompactPlayer
                                    score={player.score ?? 0}
                                    previousScore={0}
                                    isActive={isMyTurn}
                                    position="inline"
                                    color="border-blue-500"
                                    name="Вы"
                                    playerChoice={playerRole === 'host' ? room.host_current_choice : room.guest_current_choice}
                                />

                                {/* Счетчик карт */}
                                <div className="glass-dark rounded-xl px-6 py-4 text-center border-2 border-white/10">
                                    <div className="text-4xl font-bold text-blue-400 font-[family-name:var(--font-orbitron)]">
                                        {52 - room.current_card_index}
                                    </div>
                                </div>

                                {/* Игрок 2 */}
                                <CompactPlayer
                                    score={opponent.score ?? 0}
                                    previousScore={0}
                                    isActive={!isMyTurn}
                                    position="inline"
                                    color="border-purple-500"
                                    name="Оппонент"
                                    playerChoice={playerRole === 'host' ? room.guest_current_choice : room.host_current_choice}
                                />
                            </div>

                            {/* Таймер для мобильных */}
                            <div className="md:hidden mt-4 flex justify-center">
                                <CompactTimer
                                    timeLeft={timeLeft}
                                    totalTime={room.turn_timeout_seconds}
                                    isActive={true}
                                    onTimeout={() => multiplayerService.skipTurn()}
                                />
                            </div>

                            {/* Счетчик карт для десктопа */}
                            <div className="hidden md:block glass-dark rounded-xl px-6 py-4 text-center border-2 border-white/10">
                                <div className="text-4xl font-bold text-blue-400 font-[family-name:var(--font-orbitron)]">
                                    {52 - room.current_card_index}
                                </div>
                            </div>
                        </div>

                        {/* Форма предсказания - десктоп */}
                        <div className="prediction-container hidden md:block">
                            <PredictionForm
                                onSubmit={handlePrediction}
                                onChange={(prediction) => {
                                    // Save choice in real-time so opponent can see it
                                    multiplayerService.savePlayerChoice(prediction);
                                }}
                                disabled={isFlipping || !isMyTurn}
                            />
                        </div>

                        {/* Collapsible Panel - мобильные */}
                        <div className="md:hidden">
                            <CollapsiblePredictionPanel
                                onSubmit={handlePrediction}
                                onChange={(prediction) => {
                                    multiplayerService.savePlayerChoice(prediction);
                                }}
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

            {/* Disconnection Modal */}
            {showDisconnectionModal && reconnectionDeadline && (
                <DisconnectionModal
                    disconnectedPlayer={room.disconnected_player!}
                    deadline={reconnectionDeadline}
                    onWait={() => {
                        // Just wait - modal will auto-close on reconnect
                    }}
                    onLeave={onLeave}
                />
            )}

            {/* Reconnecting Modal */}
            {isReconnecting && (
                <ReconnectingModal
                    attempt={reconnectAttempt}
                    maxAttempts={5}
                />
            )}

            {/* Exit Confirmation Modal */}
            <ExitConfirmModal
                isOpen={showExitConfirm}
                onConfirm={() => {
                    setShowExitConfirm(false);
                    onLeave();
                }}
                onCancel={() => setShowExitConfirm(false)}
            />

            {/* Reconnected Toast Notification */}
            <ReconnectedToast
                show={showReconnectedToast}
                onClose={() => setShowReconnectedToast(false)}
            />
        </div>
    );
};
