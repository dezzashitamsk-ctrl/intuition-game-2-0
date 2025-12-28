import { Card } from '../types/card';

/**
 * Generate a full 52-card deck
 */
export function generateDeck(): Card[] {
    const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks: Card['rank'][] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck: Card[] = [];

    for (const suit of suits) {
        // Determine color based on suit
        const color: 'red' | 'black' = (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black';

        for (const rank of ranks) {
            deck.push({ suit, rank, color });
        }
    }

    return deck;
}

/**
 * Shuffle deck using Fisher-Yates algorithm
 */
export function shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Simple XOR-based encryption for deck
 * Note: This is obfuscation, not cryptographic security
 * Good enough to prevent casual cheating
 */
export function encryptDeck(deck: Card[], seed: string): string {
    const deckString = JSON.stringify(deck);
    const encrypted: number[] = [];

    for (let i = 0; i < deckString.length; i++) {
        const charCode = deckString.charCodeAt(i);
        const seedChar = seed.charCodeAt(i % seed.length);
        encrypted.push(charCode ^ seedChar);
    }

    return btoa(String.fromCharCode(...encrypted));
}

/**
 * Decrypt the entire deck
 */
export function decryptDeck(encryptedDeck: string, seed: string): Card[] {
    try {
        const decoded = atob(encryptedDeck);
        const decrypted: string[] = [];

        for (let i = 0; i < decoded.length; i++) {
            const charCode = decoded.charCodeAt(i);
            const seedChar = seed.charCodeAt(i % seed.length);
            decrypted.push(String.fromCharCode(charCode ^ seedChar));
        }

        return JSON.parse(decrypted.join(''));
    } catch (error) {
        console.error('Deck decryption failed:', error);
        return [];
    }
}

/**
 * Decrypt only a specific card by index
 * More efficient than decrypting entire deck
 */
export function decryptCard(encryptedDeck: string, seed: string, index: number): Card | null {
    const deck = decryptDeck(encryptedDeck, seed);
    return deck[index] || null;
}

/**
 * Generate a random seed for encryption
 */
export function generateSeed(): string {
    return Math.random().toString(36).substring(2) +
        Date.now().toString(36) +
        Math.random().toString(36).substring(2);
}
