import { Card, CardColor, CardRank, CardSuit, Prediction, PredictionResult } from '../types/card';
import { GAME_MODES } from '../constants/game';

// Создание новой колоды карт
export function createDeck(): Card[] {
    const suits: CardSuit[] = ["hearts", "diamonds", "clubs", "spades"];
    const ranks: CardRank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    
    const deck: Card[] = [];
    
    for (const suit of suits) {
        const color: CardColor = (suit === "hearts" || suit === "diamonds") ? "red" : "black";
        for (const rank of ranks) {
            deck.push({ suit, rank, color });
        }
    }
    
    return deck;
}

// Перемешивание колоды
export function shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Проверка предсказания
export function checkPrediction(prediction: Prediction, actual: Card): PredictionResult {
    let correct = false;
    let totalPoints = 0;
    let message = '';

    // Проверяем совпадения
    const colorMatch = prediction.color === actual.color;
    const suitMatch = prediction.suit === actual.suit;
    const rankMatch = prediction.rank === actual.rank;

    // Проверяем в зависимости от режима
    switch (prediction.mode) {
        case 'color':
            if (colorMatch) {
                correct = true;
                totalPoints = GAME_MODES.color.points;
                message = '🎯 В точку! Цвет угадан!';
            } else {
                message = `❌ Упс! Это была ${actual.color === 'red' ? 'красная' : 'черная'} карта`;
            }
            break;

        case 'suit':
            if (suitMatch) {
                correct = true;
                totalPoints = GAME_MODES.suit.points;
                message = '🎯 Браво! Масть угадана!';
            } else {
                message = `❌ Мимо! Это была карта масти ${actual.suit}`;
            }
            break;

        case 'rank':
            if (rankMatch) {
                correct = true;
                totalPoints = GAME_MODES.rank.points;
                message = '🎯 Ва��! Номинал угадан!';
            } else {
                message = `❌ Не угадали! Это был(а) ${actual.rank}`;
            }
            break;

        case 'full':
            if (suitMatch && rankMatch) {
                correct = true;
                totalPoints = GAME_MODES.full.points;
                message = '🎯 НЕВЕРОЯТНО! Полное попадание!';
            } else {
                message = `❌ Мимо! Это был(а) ${actual.rank} масти ${actual.suit}`;
            }
            break;
    }

    return {
        colorMatch,
        suitMatch,
        rankMatch,
        totalPoints,
        correct,
        message
    };
} 