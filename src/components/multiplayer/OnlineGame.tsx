'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMultiplayer } from '../../hooks/useMultiplayer';
import { PredictionForm } from '../forms/PredictionForm';
import { PredictionResult } from '../ui/PredictionResult';
import Card from '../game/Card';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import type { Prediction } from '../../types/game';

interface OnlineGameProps {
    onLeave: () => void;
}

export const OnlineGame: React.FC<OnlineGameProps> = ({ onLeave }) => {
    const {
        room,
        playerRole,
        isMyTurn,
        isFinished,
        currentCard,
        opponent,
        player,
        makeTurn,
    } = useMultiplayer();

    const [showCardFace, setShowCardFace] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);

    // Debug logging
    console.log('OnlineGame render:', JSON.stringify({
        hasRoom: !!room,
        roomStatus: room?.status,
        playerRole,
        hasCurrentCard: !!currentCard,
    }, null, 2));

    if (!room || !playerRole) {
        console.log('OnlineGame: No room or playerRole, returning null');
        return null;
    }

    // Safety check for card
    if (!currentCard) {
        console.log('OnlineGame: No current card, showing loading');
        return (
            <div className="min-h-screen relative flex items-center justify-center">
                <AnimatedBackground variant="game" />
                <div className="glass-dark rounded-3xl p-8 text-center">
                    <div className="text-yellow-400 mb-4">⏳ Loading game...</div>
                    <button onClick={onLeave} className="text-gray-400 hover:text-white">
                        ← Back
                    </button>
                </div>
            </div>
        );
    }

    const handlePrediction = async (prediction: Prediction) => {
        if (!isMyTurn || isFlipping) return;

        setIsFlipping(true);
        setShowCardFace(true);

        // Wait for card flip animation
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            // Make turn via multiplayer service
            await makeTurn(prediction);
        } catch (error) {
            console.error('Error making turn:', error);
        }

        // Wait to show result
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Flip card back
        setShowCardFace(false);
        await new Promise(resolve => setTimeout(resolve, 800));

        setIsFlipping(false);
    };

    const cardsLeft = room.deck.length - room.current_card_index;
    const isGameOver = isFinished || cardsLeft <= 0;

    return (
        <div className="min-h-screen relative">
            <AnimatedBackground variant="game" />

            <div className="container mx-auto p-4 md:p-8 relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="glass-dark rounded-2xl px-6 py-3">
                        <div className="text-sm text-gray-400 mb-1">CARDS LEFT</div>
                        <div className="text-3xl font-bold text-white font-[family-name:var(--font-orbitron)]">
                            {cardsLeft}
                        </div>
                    </div>

                    <button
                        onClick={onLeave}
                        className="glass-dark px-6 py-3 rounded-xl
                                 border-2 border-red-500/50
                                 hover:border-red-400
                                 transition-all
                                 text-red-400 hover:text-red-300
                                 font-[family-name:var(--font-orbitron)]"
                    >
                        ← Exit
                    </button>
                </div>

                {/* Players */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* You */}
                    <div className={`glass-dark rounded-2xl p-6 ${isMyTurn ? 'border-2 border-green-500/50' : 'border-2 border-white/10'}`}>
                        <div className="text-sm text-gray-400 mb-2">YOU ({playerRole === 'host' ? 'Host' : 'Guest'})</div>
                        <div className="text-4xl font-bold text-white font-[family-name:var(--font-orbitron)]">
                            {player.score || 0}
                        </div>
                        <div className="text-sm text-gray-400 mt-2">
                            Streak: {player.streak || 0}
                        </div>
                        {isMyTurn && !isGameOver && (
                            <div className="mt-3 text-green-400 text-sm animate-pulse">
                                ● YOUR TURN
                            </div>
                        )}
                    </div>

                    {/* Opponent */}
                    <div className={`glass-dark rounded-2xl p-6 ${!isMyTurn && !isGameOver ? 'border-2 border-yellow-500/50' : 'border-2 border-white/10'}`}>
                        <div className="text-sm text-gray-400 mb-2">OPPONENT ({playerRole === 'host' ? 'Guest' : 'Host'})</div>
                        <div className="text-4xl font-bold text-white font-[family-name:var(--font-orbitron)]">
                            {opponent.score || 0}
                        </div>
                        <div className="text-sm text-gray-400 mt-2">
                            Streak: {opponent.streak || 0}
                        </div>
                        {!isMyTurn && !isGameOver && (
                            <div className="mt-3 text-yellow-400 text-sm animate-pulse">
                                ⏳ OPPONENT'S TURN
                            </div>
                        )}
                    </div>
                </div>

                {/* Card */}
                <div className="flex justify-center mb-8">
                    <div className={`card-wrapper ${showCardFace ? 'is-flipped' : ''}`}>
                        <Card card={currentCard} isHidden={true} />
                    </div>
                </div>

                {/* Game Over */}
                {isGameOver && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-dark rounded-3xl p-8 text-center mb-8"
                    >
                        <h2 className="text-4xl font-bold mb-4 font-[family-name:var(--font-orbitron)]">
                            {room.winner === playerRole ? (
                                <span className="text-green-400">🎉 YOU WIN!</span>
                            ) : room.winner === 'draw' ? (
                                <span className="text-blue-400">🤝 DRAW!</span>
                            ) : (
                                <span className="text-red-400">😔 YOU LOSE</span>
                            )}
                        </h2>
                        <div className="text-2xl text-gray-300 mb-6">
                            Final Score: {player.score} - {opponent.score}
                        </div>
                        <button
                            onClick={onLeave}
                            className="glass-dark px-8 py-4 rounded-xl
                                     bg-gradient-to-r from-blue-500/20 to-purple-500/20
                                     border-2 border-blue-500/50
                                     hover:border-blue-400
                                     transition-all
                                     text-white font-bold
                                     font-[family-name:var(--font-orbitron)]"
                        >
                            Back to Lobby
                        </button>
                    </motion.div>
                )}

                {/* Prediction Form or Result */}
                {!isGameOver && (
                    <>
                        {room.last_result && room.last_prediction ? (
                            <div className="prediction-container mb-8">
                                <PredictionResult
                                    prediction={room.last_prediction}
                                    actual={currentCard!}
                                    result={room.last_result}
                                    chipsWon={room.last_result.totalPoints}
                                />
                            </div>
                        ) : (
                            <div className="prediction-container mb-8">
                                <div className="glass-dark rounded-3xl p-6 h-[400px] flex items-center justify-center">
                                    <div className="text-gray-400 text-center">
                                        {isMyTurn ? 'Make your prediction below' : 'Waiting for opponent...'}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="prediction-container">
                            <PredictionForm
                                onSubmit={handlePrediction}
                                disabled={!isMyTurn || isFlipping}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
