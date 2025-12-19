import { IBotService, BotDifficulty } from '../types/bot';
import { Card, Prediction } from '../types/card';
import { GAME_MODES } from '../constants/game';

/**
 * Сервис для управления логикой бота
 * Бот НЕ видит следующую карту и делает случайные предсказания
 * Уровень сложности влияет только на выбор режима предсказания
 */
export class BotService implements IBotService {
    private difficulty: BotDifficulty = 'medium';

    constructor(initialDifficulty: BotDifficulty = 'medium') {
        this.difficulty = initialDifficulty;
    }

    setDifficulty(difficulty: BotDifficulty): void {
        this.difficulty = difficulty;
    }

    getDifficulty(): BotDifficulty {
        return this.difficulty;
    }

    choosePredictionMode(): keyof typeof GAME_MODES {
        const modes: (keyof typeof GAME_MODES)[] = ['color', 'suit', 'rank', 'full'];

        // На легком уровне бот предпочитает простые режимы
        if (this.difficulty === 'easy') {
            return Math.random() < 0.7 ? 'color' : modes[Math.floor(Math.random() * 2)];
        }

        // На среднем уровне бот выбирает случайно
        if (this.difficulty === 'medium') {
            return modes[Math.floor(Math.random() * modes.length)];
        }

        // На сложном уровне бот предпочитает сложные режимы
        if (this.difficulty === 'hard') {
            const weightedModes = [...modes, 'rank', 'full', 'full'];
            return weightedModes[Math.floor(Math.random() * weightedModes.length)];
        }

        // На супер-сложном уровне бот почти всегда выбирает самые сложные режимы
        const superHardModes = [...modes, 'rank', 'full', 'full', 'full', 'full'];
        return superHardModes[Math.floor(Math.random() * superHardModes.length)];
    }

    generatePrediction(): Prediction {
        const mode = this.choosePredictionMode();

        // Бот НЕ видит карту и делает случайное предсказание
        switch (mode) {
            case 'color': {
                const colors: ('red' | 'black')[] = ['red', 'black'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                return { mode, color: randomColor };
            }
            case 'suit': {
                const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
                const randomSuit = suits[Math.floor(Math.random() * suits.length)];
                return { mode, suit: randomSuit };
            }
            case 'rank': {
                const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;
                const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
                return { mode, rank: randomRank };
            }
            case 'full': {
                const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
                const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;
                const randomSuit = suits[Math.floor(Math.random() * suits.length)];
                const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
                const color = randomSuit === 'hearts' || randomSuit === 'diamonds' ? 'red' : 'black';
                return {
                    mode,
                    suit: randomSuit,
                    rank: randomRank,
                    color
                };
            }
        }
    }
}