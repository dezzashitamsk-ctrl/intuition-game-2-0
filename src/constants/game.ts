export const GAME_MODES = {
    color: {
        icon: '🎨',
        text: 'Угадать цвет',
        points: 2,
        description: 'Красное или черное? Проще простого!'
    },
    suit: {
        icon: '🃏',
        text: 'Угадать масть',
        points: 5,
        description: 'Четыре масти, одна удача!'
    },
    rank: {
        icon: '🎴',
        text: 'Угадать номинал',
        points: 15,
        description: 'От двойки до туза - испытай свою интуицию!'
    },
    full: {
        icon: '🎯',
        text: 'Масть и номинал',
        points: 30,
        description: 'Джекпот! Угадай карту целиком, если ты настоящий экстрасенс!'
    }
} as const;

export const SUITS = {
    hearts: {
        icon: '❤️',
        text: 'Червы',
        color: 'text-red-500'
    },
    diamonds: {
        icon: '♦️',
        text: 'Бубны',
        color: 'text-red-500'
    },
    clubs: {
        icon: '♣️',
        text: 'Трефы',
        color: 'text-[#6B4E9D]'
    },
    spades: {
        icon: '♠️',
        text: 'Пики',
        color: 'text-[#6B4E9D]'
    }
} as const;

export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;

export const COLORS = {
    red: {
        icon: '🔴',
        text: 'Красная'
    },
    black: {
        icon: '⚫',
        text: 'Черная'
    }
} as const; 