'use client';

import React, { useState, useEffect } from 'react';
import { Card as CardComponent } from './Card';
import { PredictionForm } from './PredictionForm';
import { PredictionResult } from './PredictionResult';
import { useGameLogic } from '../hooks/useGameLogic';
import { Prediction } from '../types/game';
import { Card } from '../types/card';

export const Game: React.FC = () => {
    const { gameState, startGame, makePrediction } = useGameLogic(2);
    const [isFlipping, setIsFlipping] = useState(false);
    const [currentCard, setCurrentCard] = useState<Card | undefined>(undefined);

    useEffect(() => {
        startGame(2);
    }, []);

    useEffect(() => {
        if (gameState.deck.length > 0) {
            setCurrentCard(gameState.deck[0]);
        }
    }, [gameState.deck]);

    const handlePrediction = (prediction: Prediction) => {
        if (isFlipping) return;
        
        setIsFlipping(true);
        
        // Показываем карту на 2 секунды
        const card = document.querySelector('.card-component');
        if (card) {
            card.classList.add('flipped');
        }
        
        setTimeout(() => {
            if (card) {
                card.classList.remove('flipped');
            }
            makePrediction(prediction);
            setIsFlipping(false);
        }, 2000);
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
                         }`}>
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
                    <div className="card-component">
                        <CardComponent 
                            card={currentCard}
                            isHidden={!isFlipping}
                        />
                    </div>
                </div>
                <div>
                    <PredictionForm 
                        onSubmit={handlePrediction}
                        disabled={isFlipping}
                    />
                </div>
            </div>

            {gameState.lastPrediction && gameState.lastResult && currentCard && (
                <div className="mt-8 border-t pt-4">
                    <PredictionResult 
                        prediction={gameState.lastPrediction}
                        actual={currentCard}
                        result={gameState.lastResult}
                    />
                </div>
            )}
        </div>
    );
}; 