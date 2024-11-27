import { Card, CardSuit, CardRank, CardColor, Prediction, PredictionResult } from '../types/card';

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

// Расчет вероятностей для текущей колоды
export function calculateProbabilities(deck: Card[]) {
    const total = deck.length;
    const redCards = deck.filter(card => card.color === 'red').length;
    const blackCards = total - redCards;

    // Подсчет карт каждой масти
    const suitCounts = deck.reduce((acc, card) => {
        acc[card.suit] = (acc[card.suit] || 0) + 1;
        return acc;
    }, {} as Record<CardSuit, number>);

    // Подсчет карт каждого номинала
    const rankCounts = deck.reduce((acc, card) => {
        acc[card.rank] = (acc[card.rank] || 0) + 1;
        return acc;
    }, {} as Record<CardRank, number>);

    return {
        color: {
            red: (redCards / total) * 100,
            black: (blackCards / total) * 100
        },
        suits: Object.entries(suitCounts).reduce((acc, [suit, count]) => {
            acc[suit as CardSuit] = (count / total) * 100;
            return acc;
        }, {} as Record<CardSuit, number>),
        ranks: Object.entries(rankCounts).reduce((acc, [rank, count]) => {
            acc[rank as CardRank] = (count / total) * 100;
            return acc;
        }, {} as Record<CardRank, number>)
    };
}

// Проверка предсказания и подсчет очков по новой системе
export function checkPrediction(prediction: Prediction, actual: Card): PredictionResult {
    // Определяем тип предсказания и проверяем совпадения
    const hasColorPrediction = prediction.color !== undefined;
    const hasSuitPrediction = prediction.suit !== undefined;
    const hasRankPrediction = prediction.rank !== undefined;

    // Проверяем совпадения
    const colorMatch = prediction.color === actual.color;
    const suitMatch = prediction.suit === actual.suit;
    const rankMatch = prediction.rank === actual.rank;
    
    let totalPoints = 0;
    
    // Начисляем очки в зависимости от типа предсказания
    if (hasColorPrediction && !hasSuitPrediction && !hasRankPrediction) {
        // Только цвет: +1 очко
        if (colorMatch) totalPoints = 1;
    } 
    else if (!hasColorPrediction && hasSuitPrediction && !hasRankPrediction) {
        // Только масть: +3 очка
        if (suitMatch) totalPoints = 3;
    }
    else if (!hasColorPrediction && !hasSuitPrediction && hasRankPrediction) {
        // Только номинал: +8 очков
        if (rankMatch) totalPoints = 8;
    }
    else if (hasSuitPrediction && hasRankPrediction) {
        // Масть и номинал: +15 очков (только если оба угаданы)
        if (suitMatch && rankMatch) {
            totalPoints = 15;
        }
    }
    
    return {
        colorMatch,
        suitMatch,
        rankMatch,
        totalPoints
    };
} 