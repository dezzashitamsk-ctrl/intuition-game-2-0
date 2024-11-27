'use client';

import React, { useState } from 'react';
import { Card as CardComponent } from './Card';
import { PredictionForm } from './PredictionForm';
import { PredictionResult } from './PredictionResult';
import { GameState } from '../types/game';
import { Prediction } from '../types/card';
import { createDeck, shuffleDeck, checkPrediction } from '../utils/cardUtils';

export const Game: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        players: [
            { id: 1, name: 'Игрок 1', score: 0 },
            { id: 2, name: 'Игрок 2', score: 0 }
        ],
        currentPlayerIndex: 0,
        deck: shuffleDeck(createDeck()),
        currentCard: undefined,
        isCardRevealed: false,
        gameOver: false
    });

    const handlePrediction = (prediction: Prediction) => {
        if (gameState.deck.length === 0) return;

        const currentCard = gameState.deck[0];
        const result = checkPrediction(prediction, currentCard);
        
        const newPlayers = [...gameState.players];
        newPlayers[gameState.currentPlayerIndex].score += result.totalPoints;

        setGameState(prev => ({
            ...prev,
            players: newPlayers,
            currentCard: currentCard,
            lastPrediction: prediction,
            lastResult: result,
            deck: prev.deck.slice(1),
            isCardRevealed: true,
            currentPlayerIndex: (prev.currentPlayerIndex + 1) % 2,
            gameOver: prev.deck.length <= 1
        }));
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="flex justify-between mb-8">
                {gameState.players.map((player, index) => (
                    <div key={player.id} 
                        className={`p-4 rounded-xl shadow-md ${
                            index === gameState.currentPlayerIndex 
                                ? 'bg-blue-100 border-2 border-blue-300' 
                                : 'bg-gray-50'
                        }`}
                    >
                        <h3 className="font-bold text-lg">{player.name}</h3>
                        <p className="text-2xl font-bold text-blue-600">{player.score}</p>
                    </div>
                ))}
            </div>

            <div className="mb-6 text-center">
                <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg">
                    <span className="font-medium">Осталось карт: </span>
                    <span className="text-lg font-bold text-blue-600">{gameState.deck.length}</span>
                </div>
            </div>

            <div className="grid grid-cols-[400px_800px] gap-8 justify-center">
                <div className="flex justify-center items-start">
                    <CardComponent 
                        card={gameState.currentCard} 
                        isHidden={!gameState.isCardRevealed}
                    />
                </div>

                <div>
                    <PredictionForm onSubmit={handlePrediction} />
                </div>
            </div>

            {gameState.lastPrediction && gameState.currentCard && gameState.lastResult && (
                <div className="mt-8 border-t pt-4">
                    <PredictionResult 
                        prediction={gameState.lastPrediction}
                        actual={gameState.currentCard}
                        result={gameState.lastResult}
                    />
                </div>
            )}

            {gameState.gameOver && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                        <h2 className="text-2xl font-bold mb-4">🎮 Игра окончена!</h2>
                        <p className="text-xl mb-4">
                            Победитель: {
                                gameState.players.reduce((prev, current) => 
                                    prev.score > current.score ? prev : current
                                ).name
                            }
                        </p>
                        <div className="space-y-4">
                            {gameState.players.map(player => (
                                <div key={player.id} className="flex justify-between items-center">
                                    <span className="font-medium">{player.name}:</span>
                                    <span className="text-lg font-bold text-blue-600">{player.score}</span>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                                transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                            Начать новую игру
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}; 