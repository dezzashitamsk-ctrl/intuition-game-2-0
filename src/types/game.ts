import { Card, CardSuit, CardColor, CardRank, Prediction, PredictionResult, PredictionMode } from './card';

export interface Player {
    id: number;
    name: string;
    score: number;
}

export interface GameState {
    players: Player[];
    currentPlayerIndex: number;
    deck: Card[];
    lastPrediction?: Prediction;
    lastResult?: PredictionResult;
    gameOver: boolean;
}

export type {
    Card,
    CardSuit,
    CardColor,
    CardRank,
    Prediction,
    PredictionResult,
    PredictionMode
}; 