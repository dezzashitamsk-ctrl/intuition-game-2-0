export type CardColor = 'red' | 'black';
export type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type CardRank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type PredictionMode = 'color' | 'suit' | 'rank' | 'full' | null;

export interface Prediction {
    color?: CardColor;
    suit?: CardSuit;
    rank?: CardRank;
}

export interface Card {
    suit: CardSuit;
    rank: CardRank;
    isVisible: boolean;
} 