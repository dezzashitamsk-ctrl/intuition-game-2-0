import { useReducer } from 'react';
import { Card, Prediction, PredictionResult, Player, GameState } from '../types/game';
import { createDeck, shuffleDeck, checkPrediction } from '../utils/cardUtils';

type GameAction =
    | { type: 'START_GAME'; playerCount: number }
    | { type: 'MAKE_PREDICTION'; prediction: Prediction }
    | { type: 'END_GAME' };

const initialState: GameState = {
    players: [],
    currentPlayerIndex: 0,
    deck: [],
    lastPrediction: undefined,
    lastResult: undefined,
    gameOver: false,
    pot: 0,
    roundBet: 0,
    chipsState: {
        pot: 0,
        transactions: []
    },
    winner: undefined,
    winAnimation: {
        show: false,
        amount: 0,
        playerId: 0
    }
};

const createInitialPlayers = (count: number): Player[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Игрок ${i + 1}`,
        score: 0,
        previousScore: 0,
        streak: 0,
        chips: 0,
        previousChips: 0
    }));
};

const checkGameOver = (state: GameState): [boolean, Player | undefined] => {
    // Игра заканчивается когда колода пуста
    if (state.deck.length === 0) {
        const winner = [...state.players].sort((a, b) => b.score - a.score)[0];
        return [true, winner];
    }

    return [false, undefined];
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'START_GAME': {
            const deck = shuffleDeck(createDeck());
            // Всегда создаем 2 игроков
            const actualPlayerCount = 2;
            const players = createInitialPlayers(actualPlayerCount);

            // Если одиночная игра, второй игрок - бот
            if (action.playerCount === 1) {
                players[1].name = 'Бот';
            }

            return {
                ...initialState,
                players,
                deck,
                currentPlayerIndex: 0,
                gameOver: false,
                winner: undefined
            };
        }

        case 'MAKE_PREDICTION': {
            if (state.deck.length === 0) return state;

            const currentCard = state.deck[0];
            const result = checkPrediction(action.prediction, currentCard);
            const newDeck = state.deck.slice(1);
            const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;

            console.log('REDUCER: MAKE_PREDICTION', {
                currentCard,
                prediction: action.prediction,
                result,
                currentPlayer: state.players[state.currentPlayerIndex]
            });

            // Обновляем очки текущего игрока
            const updatedPlayers = state.players.map((player, index) => {
                if (index === state.currentPlayerIndex) {
                    const newStreak = result.correct ? player.streak + 1 : 0;
                    const streakBonus = newStreak >= 3 ? Math.floor(newStreak / 3) : 0;
                    const totalPoints = result.totalPoints + (streakBonus * 2);

                    console.log('REDUCER: Updating player score', {
                        playerName: player.name,
                        previousScore: player.score,
                        totalPoints,
                        resultPoints: result.totalPoints,
                        streakBonus,
                        newScore: player.score + totalPoints
                    });

                    return {
                        ...player,
                        previousScore: player.score,
                        score: player.score + totalPoints,
                        streak: newStreak
                    };
                }
                return player;
            });

            // Проверяем условия окончания игры
            const [gameOver, winner] = checkGameOver({
                ...state,
                deck: newDeck,
                players: updatedPlayers
            });

            console.log('REDUCER: Switching player', {
                currentPlayerIndex: state.currentPlayerIndex,
                nextPlayerIndex,
                playersCount: state.players.length
            });

            return {
                ...state,
                deck: newDeck,
                players: updatedPlayers,
                lastPrediction: action.prediction,
                lastResult: result,
                currentPlayerIndex: nextPlayerIndex,
                gameOver,
                winner
            };
        }

        case 'END_GAME': {
            const winner = [...state.players].sort((a, b) => b.score - a.score)[0];
            return {
                ...state,
                gameOver: true,
                winner
            };
        }

        default:
            return state;
    }
};

export const useGameLogic = (initialPlayerCount: number = 2) => {
    const [gameState, dispatch] = useReducer(gameReducer, initialState);

    const startGame = (playerCount: number) => {
        console.log('Starting game with', playerCount, 'players');
        dispatch({ type: 'START_GAME', playerCount });
    };

    const makePrediction = (prediction: Prediction) => {
        if (gameState.gameOver) return;

        console.log('Making prediction:', {
            player: gameState.players[gameState.currentPlayerIndex],
            prediction,
            card: gameState.deck[0]
        });

        dispatch({ type: 'MAKE_PREDICTION', prediction });
    };

    return {
        gameState,
        startGame,
        makePrediction
    };
};