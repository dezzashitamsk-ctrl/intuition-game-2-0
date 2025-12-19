'use client';

import { useCallback, useState, useEffect } from 'react';

// Синглтоны для аудио элементов
let clickAudioInstance: HTMLAudioElement | null = null;
let winAudioInstance: HTMLAudioElement | null = null;
let lossAudioInstance: HTMLAudioElement | null = null;

// Глобальное состояние звука
let isGlobalSoundEnabled = true;

export const useSound = () => {
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);

    // Инициализация аудио при первом использовании
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!clickAudioInstance) {
                clickAudioInstance = new Audio('/sounds/click.mp3');
                clickAudioInstance.volume = 0.1;
            }
            if (!winAudioInstance) {
                winAudioInstance = new Audio('/sounds/win.mp3');
                winAudioInstance.volume = 0.3;
            }
            if (!lossAudioInstance) {
                lossAudioInstance = new Audio('/sounds/over.mp3');
                lossAudioInstance.volume = 0.3;
            }

            // Восстанавливаем состояние из localStorage
            const savedState = localStorage.getItem('soundEnabled');
            if (savedState !== null) {
                const enabled = savedState === 'true';
                isGlobalSoundEnabled = enabled;
                setIsSoundEnabled(enabled);
            }
        }
    }, []);

    const toggleSound = useCallback(() => {
        const newState = !isSoundEnabled;
        isGlobalSoundEnabled = newState;
        setIsSoundEnabled(newState);
        localStorage.setItem('soundEnabled', String(newState));
    }, [isSoundEnabled]);

    const playSound = useCallback(() => {
        if (isGlobalSoundEnabled && clickAudioInstance) {
            try {
                clickAudioInstance.currentTime = 0;
                clickAudioInstance.play().catch(error => {
                    console.error('Ошибка воспроизведения звука клика:', error);
                });
            } catch (error) {
                console.error('Ошибка звука клика:', error);
            }
        }
    }, []);

    const playWin = useCallback(() => {
        if (isGlobalSoundEnabled && winAudioInstance) {
            try {
                winAudioInstance.currentTime = 0;
                winAudioInstance.play().catch(error => {
                    console.error('Ошибка воспроизведения звука победы:', error);
                });
            } catch (error) {
                console.error('Ошибка звука победы:', error);
            }
        }
    }, []);

    const playLoss = useCallback(() => {
        if (isGlobalSoundEnabled && lossAudioInstance) {
            try {
                lossAudioInstance.currentTime = 0;
                lossAudioInstance.play().catch(error => {
                    console.error('Ошибка воспроизведения звука поражения:', error);
                });
            } catch (error) {
                console.error('Ошибка звука поражения:', error);
            }
        }
    }, []);

    return { playSound, playWin, playLoss, toggleSound, isSoundEnabled };
}; 