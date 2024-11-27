import { Card, Prediction } from './card';

export interface Player {
    id: number;
    name: string;
    score: number;
}

export interface GameState {
    players: Player[];
    currentPlayerIndex: number;
    deck: Card[];
    currentCard?: Card;
    lastPrediction?: Prediction;
    lastResult?: any;
    isCardRevealed: boolean;
    gameOver: boolean;
} 