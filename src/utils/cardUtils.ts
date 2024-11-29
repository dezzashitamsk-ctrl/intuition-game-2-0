import { Card, CardColor, CardRank, CardSuit, Prediction, PredictionResult } from '../types/game';
import { GAME_MODES } from '../constants/game';

// Создание новой колоды карт
export function createDeck(): Card[] {
    // Определяем все возможные масти и номиналы
    const suits: CardSuit[] = ["hearts", "diamonds", "clubs", "spades"];
    const ranks: CardRank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    
    const deck: Card[] = [];
    
    // Создаем карты для каждой комбинации масти и номинала
    for (const suit of suits) {
        // Определяем цвет карты на основе масти
        const color: CardColor = (suit === "hearts" || suit === "diamonds") ? "red" : "black";
        for (const rank of ranks) {
            deck.push({ suit, rank, color });
        }
    }
    
    return deck;
}

// Перемешивание колоды (алгоритм Фишера-Йетса)
export function shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Проверка предсказания и подсчет очков
export function checkPrediction(prediction: Prediction, actual: Card): PredictionResult {
    // Определяем тип предсказания и проверяем совпадения
    const hasColorPrediction = prediction.mode === 'color';
    const hasSuitPrediction = prediction.mode === 'suit' || prediction.mode === 'full';
    const hasRankPrediction = prediction.mode === 'rank' || prediction.mode === 'full';

    // Проверяем совпадения
    const colorMatch = hasColorPrediction ? prediction.color === actual.color : false;
    const suitMatch = hasSuitPrediction ? prediction.suit === actual.suit : false;
    const rankMatch = hasRankPrediction ? prediction.rank === actual.rank : false;
    
    let totalPoints = 0;
    let correct = false;
    let message = '';
    
    // Начисляем очки в зависимости от типа предсказания
    if (prediction.mode) {
        const mode = GAME_MODES[prediction.mode];
        if (prediction.mode === 'color' && colorMatch) {
            totalPoints = mode.points;
            correct = true;
            message = 'Верно! Вы угадали цвет карты!';
        } else if (prediction.mode === 'suit' && suitMatch) {
            totalPoints = mode.points;
            correct = true;
            message = 'Отлично! Вы угадали масть карты!';
        } else if (prediction.mode === 'rank' && rankMatch) {
            totalPoints = mode.points;
            correct = true;
            message = 'Великолепно! Вы угадали номинал карты!';
        } else if (prediction.mode === 'full' && suitMatch && rankMatch) {
            totalPoints = mode.points;
            correct = true;
            message = 'Невероятно! Вы угадали карту полностью!';
        } else {
            message = 'Неправильно! Попробуйте еще раз.';
        }
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