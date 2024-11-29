import { renderHook, act } from '@testing-library/react-hooks';
import { useGameLogic } from '../useGameLogic';

describe('useGameLogic', () => {
    // Тест инициализации игры
    it('должен создать начальное состояние игры', () => {
        const { result } = renderHook(() => useGameLogic(2));
        
        expect(result.current.gameState.players).toHaveLength(2);
        expect(result.current.gameState.currentPlayerIndex).toBe(0);
        expect(result.current.gameState.deck).toHaveLength(52);
        expect(result.current.gameState.isCardRevealed).toBe(false);
        expect(result.current.gameState.gameOver).toBe(false);
    });

    // Тест предсказания
    it('должен правильно обрабатывать предсказание', () => {
        const { result } = renderHook(() => useGameLogic(2));
        
        act(() => {
            result.current.handlePrediction({ 
                mode: 'color',
                color: 'red'
            });
        });

        expect(result.current.gameState.isCardRevealed).toBe(true);
        expect(result.current.gameState.lastPrediction).toBeDefined();
        expect(result.current.gameState.lastResult).toBeDefined();
        expect(result.current.gameState.deck).toHaveLength(51);
    });

    // Тест переключения игроков
    it('должен правильно переключать игроков', () => {
        const { result } = renderHook(() => useGameLogic(2));
        
        const initialPlayer = result.current.gameState.currentPlayerIndex;
        
        act(() => {
            result.current.handlePrediction({ 
                mode: 'color',
                color: 'red'
            });
        });

        expect(result.current.gameState.currentPlayerIndex).not.toBe(initialPlayer);
    });

    // Тест сброса игры
    it('должен правильно сбрасывать игру', () => {
        const { result } = renderHook(() => useGameLogic(2));
        
        // Делаем ход
        act(() => {
            result.current.handlePrediction({ 
                mode: 'color',
                color: 'red'
            });
        });

        // Сбрасываем игру
        act(() => {
            result.current.resetGame();
        });

        expect(result.current.gameState.players[0].score).toBe(0);
        expect(result.current.gameState.players[1].score).toBe(0);
        expect(result.current.gameState.deck).toHaveLength(52);
        expect(result.current.gameState.currentPlayerIndex).toBe(0);
    });

    // Тест окончания игры
    it('должен определять конец игры', () => {
        const { result } = renderHook(() => useGameLogic(2));
        
        // Делаем 51 ход
        for (let i = 0; i < 51; i++) {
            act(() => {
                result.current.handlePrediction({ 
                    mode: 'color',
                    color: 'red'
                });
            });
        }

        expect(result.current.gameState.gameOver).toBe(true);
    });
}); 