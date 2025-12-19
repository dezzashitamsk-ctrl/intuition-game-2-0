import { renderHook, act } from '@testing-library/react-hooks';
import { useGameLogic } from '../useGameLogic';
import type { Prediction } from '../../types/card';

describe('useGameLogic', () => {
    // Тест инициализации игры для двух игроков
    it('должен создать начальное состояние игры для двух игроков', () => {
        const { result } = renderHook(() => useGameLogic(2));
        
        expect(result.current.gameState.players).toHaveLength(2);
        expect(result.current.gameState.players[0].name).toBe('Игрок 1');
        expect(result.current.gameState.players[1].name).toBe('Игрок 2');
        expect(result.current.gameState.currentPlayerIndex).toBe(0);
        expect(result.current.gameState.deck).toHaveLength(52);
        expect(result.current.gameState.gameOver).toBe(false);
    });

    // Тест инициализации игры с ботом
    it('должен создать начальное состояние игры с ботом', () => {
        const { result } = renderHook(() => useGameLogic(1));
        
        expect(result.current.gameState.players).toHaveLength(2);
        expect(result.current.gameState.players[0].name).toBe('Игрок 1');
        expect(result.current.gameState.players[1].name).toBe('Бот 🤖');
        expect(result.current.gameState.currentPlayerIndex).toBe(0);
        expect(result.current.gameState.deck).toHaveLength(52);
        expect(result.current.gameState.gameOver).toBe(false);
    });

    // Тест предсказания
    it('должен правильно обрабатывать предсказание', () => {
        const { result } = renderHook(() => useGameLogic(2));
        
        const prediction: Prediction = {
            mode: 'color',
            color: 'red'
        };
        
        act(() => {
            result.current.makePrediction(prediction);
        });

        expect(result.current.gameState.lastPrediction).toEqual(prediction);
        expect(result.current.gameState.lastResult).toBeDefined();
        expect(result.current.gameState.deck).toHaveLength(51);
    });

    // Тест переключения игроков
    it('должен правильно переключать игроков', () => {
        const { result } = renderHook(() => useGameLogic(2));
        
        const initialPlayer = result.current.gameState.currentPlayerIndex;
        
        act(() => {
            result.current.makePrediction({ 
                mode: 'color',
                color: 'red'
            });
        });

        expect(result.current.gameState.currentPlayerIndex).toBe((initialPlayer + 1) % 2);
    });

    // Тест старта новой игры
    it('должен правильно начинать новую игру', () => {
        const { result } = renderHook(() => useGameLogic(2));
        
        // Делаем ход
        act(() => {
            result.current.makePrediction({ 
                mode: 'color',
                color: 'red'
            });
        });

        // Начинаем новую игру
        act(() => {
            result.current.startGame(2);
        });

        expect(result.current.gameState.players[0].score).toBe(0);
        expect(result.current.gameState.players[1].score).toBe(0);
        expect(result.current.gameState.deck).toHaveLength(52);
        expect(result.current.gameState.currentPlayerIndex).toBe(0);
        expect(result.current.gameState.gameOver).toBe(false);
    });

    // Тест окончания игры
    it('должен определять конец игры', () => {
        const { result } = renderHook(() => useGameLogic(2));
        
        // Делаем 51 ход
        for (let i = 0; i < 51; i++) {
            act(() => {
                result.current.makePrediction({ 
                    mode: 'color',
                    color: 'red'
                });
            });
        }

        // Последний ход
        act(() => {
            result.current.makePrediction({ 
                mode: 'color',
                color: 'red'
            });
        });

        expect(result.current.gameState.gameOver).toBe(true);
        expect(result.current.gameState.deck).toHaveLength(0);
    });

    // Тест подсчета очков
    it('должен правильно подсчитывать очки', () => {
        const { result } = renderHook(() => useGameLogic(2));
        
        const initialScore = result.current.gameState.players[0].score;
        
        act(() => {
            result.current.makePrediction({ 
                mode: 'color',
                color: result.current.gameState.deck[0].color // Гарантированно правильное предсказание
            });
        });

        expect(result.current.gameState.players[0].score).toBeGreaterThan(initialScore);
    });
}); 