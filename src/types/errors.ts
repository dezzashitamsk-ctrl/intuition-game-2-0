// Базовый класс для ошибок игры
export class GameError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'GameError';
    }
}

// Ошибка пустой колоды
export class EmptyDeckError extends GameError {
    constructor() {
        super('Колода пуста');
        this.name = 'EmptyDeckError';
    }
}

// Ошибка неверного предсказания
export class InvalidPredictionError extends GameError {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidPredictionError';
    }
}

// Ошибка неверного состояния игры
export class InvalidGameStateError extends GameError {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidGameStateError';
    }
}

// Ошибка неверного количества игроков
export class InvalidPlayersCountError extends GameError {
    constructor(count: number) {
        super(`Неверное количество игроков: ${count}. Должно быть от 2 до 4`);
        this.name = 'InvalidPlayersCountError';
    }
} 