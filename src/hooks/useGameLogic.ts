import { useReducer } from 'react';
import { Card, Prediction, PredictionResult, Player, GameState } from '../types/game';
import { createDeck, shuffleDeck, checkPrediction } from '../utils/cardUtils';

type GameAction = 
    | { type: 'START_GAME'; playerCount: number }
    | { type: 'MAKE_PREDICTION'; prediction: Prediction };

/**
 * Начальное состояние игры
 */
const initialState: GameState = {
    players: [],
    currentPlayerIndex: 0,
    deck: [],
    lastPrediction: undefined,
    lastResult: undefined,
    gameOver: false
};

/**
 * Создает массив игроков с начальными очками
 */
const createInitialPlayers = (count: number = 2): Player[] => 
    Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Игрок ${i + 1}`,
        score: 0
    }));

/**
 * Обновляет очки игрока
 */
const updatePlayerScore = (
    players: Player[], 
    currentPlayerIndex: number, 
    points: number
): Player[] => {
    return players.map((player, index) => 
        index === currentPlayerIndex
            ? { ...player, score: player.score + points }
            : player
    );
};

/**
 * Редуктор для управления состоянием игры
 */
const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'START_GAME': {
            const deck = shuffleDeck(createDeck());
            const players = createInitialPlayers(action.playerCount);
            return {
                ...initialState,
                players,
                deck,
                gameOver: false
            };
        }

        case 'MAKE_PREDICTION': {
            if (state.deck.length === 0) return state;

            const currentCard = state.deck[0];
            const result = checkPrediction(action.prediction, currentCard);
            const updatedPlayers = updatePlayerScore(
                state.players, 
                state.currentPlayerIndex, 
                result.totalPoints
            );

            return {
                ...state,
                players: updatedPlayers,
                lastPrediction: action.prediction,
                lastResult: result,
                deck: state.deck.slice(1),
                currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
                gameOver: state.deck.length <= 1
            };
        }

        default:
            return state;
    }
};

/**
 * Хук для управления логикой игры
 */
export function useGameLogic(initialPlayers: number = 2) {
    const [gameState, dispatch] = useReducer(gameReducer, {
        ...initialState,
        players: createInitialPlayers(initialPlayers)
    });

    const startGame = (playerCount: number = 2) => {
        dispatch({ type: 'START_GAME', playerCount });
    };

    const makePrediction = (prediction: Prediction) => {
        dispatch({ type: 'MAKE_PREDICTION', prediction });
    };

    return {
        gameState,
        startGame,
        makePrediction
    };
} 