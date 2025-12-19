// Типы для мастей, цветов и номиналов карт
export type CardSuit = "hearts" | "diamonds" | "clubs" | "spades";  // Масти карт
export type CardColor = "red" | "black";                           // Цвета карт
export type CardRank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";  // Номиналы карт
export type PredictionMode = 'color' | 'suit' | 'rank' | 'full' | null;

// Интерфейс для карты
export interface Card {
    suit: CardSuit;   // Масть карты
    rank: CardRank;   // Номинал карты
    color: CardColor; // Цвет карты
}

// Интерфейс для предсказания карты
export interface Prediction {
    mode: PredictionMode;
    suit?: CardSuit;   // Предсказанная масть (опционально)
    rank?: CardRank;   // Предсказанный номинал (опционально)
    color?: CardColor; // Предсказанный цвет (опционально)
}

// Интерфейс для результата проверки предсказания
export interface PredictionResult {
    colorMatch: boolean;  // Совпадение по цвету
    suitMatch: boolean;   // Совпадение по масти
    rankMatch: boolean;   // Совпадение по номиналу
    totalPoints: number;  // Общее количество очков
    correct: boolean;     // Было ли предсказание полностью верным
    message: string;      // Сообщение о результате
} 