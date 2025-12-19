import { Card, Prediction } from './card';
import { GAME_MODES } from '../constants/game';

export type BotDifficulty = 'easy' | 'medium' | 'hard' | 'superHard';

export interface IBotService {
    generatePrediction(): Prediction; // Бот НЕ видит карту!
    setDifficulty(difficulty: BotDifficulty): void;
    getDifficulty(): BotDifficulty;
    choosePredictionMode(): keyof typeof GAME_MODES;
} 