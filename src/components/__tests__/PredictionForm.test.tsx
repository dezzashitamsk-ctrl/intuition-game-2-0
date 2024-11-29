import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PredictionForm } from '../PredictionForm';
import { GAME_MODES, SUITS, RANKS, COLORS } from '../../constants/game';

describe('PredictionForm', () => {
    const mockOnSubmit = jest.fn();

    beforeEach(() => {
        mockOnSubmit.mockClear();
    });

    // Тесты рендеринга
    describe('Рендеринг', () => {
        it('должен отображать начальное состояние с режимами игры', () => {
            render(<PredictionForm onSubmit={mockOnSubmit} />);
            
            // Проверяем заголовок
            expect(screen.getByText('Сделайте предсказание')).toBeInTheDocument();
            
            // Проверяем наличие всех режимов
            Object.values(GAME_MODES).forEach(({ text }) => {
                expect(screen.getByText(text)).toBeInTheDocument();
            });
            
            // Проверяем, что кнопка подтверждения неактивна
            const submitButton = screen.getByText('Сделать выбор');
            expect(submitButton).toBeDisabled();
        });

        it('должен отображать выбор цвета после выбора соответствующего режима', async () => {
            render(<PredictionForm onSubmit={mockOnSubmit} />);
            const user = userEvent.setup();
            
            // Выбираем режим цвета
            await user.click(screen.getByText(GAME_MODES.color.text));
            
            // Проверяем наличие вариантов цвета
            Object.values(COLORS).forEach(({ text }) => {
                expect(screen.getByText(text)).toBeInTheDocument();
            });
        });

        it('должен отображать выбор масти после выбора соответствующего режима', async () => {
            render(<PredictionForm onSubmit={mockOnSubmit} />);
            const user = userEvent.setup();
            
            // Выбираем режим масти
            await user.click(screen.getByText(GAME_MODES.suit.text));
            
            // Проверяем наличие всех мастей
            Object.values(SUITS).forEach(({ text }) => {
                expect(screen.getByText(text)).toBeInTheDocument();
            });
        });
    });

    // Тесты функциональности
    describe('Функциональность', () => {
        it('должен активировать кнопку подтверждения после выбора цвета', async () => {
            render(<PredictionForm onSubmit={mockOnSubmit} />);
            const user = userEvent.setup();
            
            // Выбираем режим цвета
            await user.click(screen.getByText(GAME_MODES.color.text));
            
            // Выбираем красный цвет
            await user.click(screen.getByText(COLORS.red.text));
            
            // Проверяем, что кнопка активна
            const submitButton = screen.getByText('Сделать выбор');
            expect(submitButton).not.toBeDisabled();
        });

        it('должен вызывать onSubmit с правильными данными при подтверждении', async () => {
            render(<PredictionForm onSubmit={mockOnSubmit} />);
            const user = userEvent.setup();
            
            // Выбираем режим масти
            await user.click(screen.getByText(GAME_MODES.suit.text));
            
            // Выбираем пики
            await user.click(screen.getByText(SUITS.spades.text));
            
            // Нажимаем подтвердить
            await user.click(screen.getByText('Сделать выбор'));
            
            // Проверяем вызов onSubmit
            expect(mockOnSubmit).toHaveBeenCalledWith({
                mode: 'suit',
                suit: 'spades',
                color: 'black'
            });
        });

        it('должен возвращаться к выбору режима после нажатия "Назад"', async () => {
            render(<PredictionForm onSubmit={mockOnSubmit} />);
            const user = userEvent.setup();
            
            // Выбираем режим
            await user.click(screen.getByText(GAME_MODES.rank.text));
            
            // Нажимаем "Назад"
            await user.click(screen.getByText('← Назад'));
            
            // Проверяем, что снова видим все режимы
            Object.values(GAME_MODES).forEach(({ text }) => {
                expect(screen.getByText(text)).toBeInTheDocument();
            });
        });
    });

    // Тесты валидации
    describe('Валидация', () => {
        it('должен требовать выбор всех необходимых параметров для полного предсказания', async () => {
            render(<PredictionForm onSubmit={mockOnSubmit} />);
            const user = userEvent.setup();
            
            // Выбираем полный режим
            await user.click(screen.getByText(GAME_MODES.full.text));
            
            // Проверяем, что кнопка неактивна
            expect(screen.getByText('Сделать выбор')).toBeDisabled();
            
            // Выбираем масть
            await user.click(screen.getByText(SUITS.hearts.text));
            
            // Проверяем, что кнопка все еще неактивна
            expect(screen.getByText('Сделать выбор')).toBeDisabled();
            
            // Выбираем номинал
            await user.click(screen.getByText('A'));
            
            // Теперь кнопка должна быть активна
            expect(screen.getByText('Сделать выбор')).not.toBeDisabled();
        });

        it('должен сбрасывать форму после успешной отправки', async () => {
            render(<PredictionForm onSubmit={mockOnSubmit} />);
            const user = userEvent.setup();
            
            // Выбираем режим цвета
            await user.click(screen.getByText(GAME_MODES.color.text));
            
            // Выбираем красный цвет
            await user.click(screen.getByText(COLORS.red.text));
            
            // Отправляем форму
            await user.click(screen.getByText('Сделать выбор'));
            
            // Проверяем, что вернулись к выбору режима
            Object.values(GAME_MODES).forEach(({ text }) => {
                expect(screen.getByText(text)).toBeInTheDocument();
            });
            
            // Проверяем, что кнопка снова неактивна
            expect(screen.getByText('Сделать выбор')).toBeDisabled();
        });
    });
}); 