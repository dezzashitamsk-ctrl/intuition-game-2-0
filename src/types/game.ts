import { Card, CardSuit, CardColor, CardRank, Prediction, PredictionResult, PredictionMode } from './card';

export interface Player {
    id: number;
    name: string;
    score: number;
    previousScore?: number;
    streak: number;
    chips: number;
    previousChips: number;
}

export interface GameState {
    players: Player[];
    currentPlayerIndex: number;
    deck: Card[];
    lastPrediction?: Prediction;
    lastResult?: PredictionResult;
    gameOver: boolean;
    pot: number;
    roundBet: number;
    chipsState: {
        pot: number;
        transactions: any[];
    };
    winner?: Player;
    winAnimation: {
        show: boolean;
        amount: number;
        playerId: number;
    };
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