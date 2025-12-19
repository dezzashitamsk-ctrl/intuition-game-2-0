import { PredictionMode } from './card';

export interface ChipsTransaction {
    playerId: number;
    amount: number;
    type: 'bet' | 'win' | 'loss';
    timestamp: Date;
}

export interface ChipsState {
    pot: number;
    transactions: ChipsTransaction[];
}

export interface ChipsConfig {
    initialChips: number;
    roundBet: number;
    winnings: {
        color: number;
        suit: number;
        rank: number;
    };
}

export interface ChipsService {
    // Основные операции
    collectBets(playerIds: number[]): ChipsTransaction[];
    processWin(playerId: number, predictionMode: PredictionMode): ChipsTransaction;
    
    // Вспомогательные методы
    getPot(): number;
    getPlayerChips(playerId: number): number;
    canMakeBet(playerId: number): boolean;
    
    // Управление состоянием
    resetChips(): void;
    getTransactions(): ChipsTransaction[];
} 