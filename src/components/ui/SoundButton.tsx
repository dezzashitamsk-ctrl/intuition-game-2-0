import React from 'react';
import { useSound } from '../../hooks/useSound';

export const SoundButton: React.FC = () => {
    const { toggleSound, isSoundEnabled } = useSound();

    return (
        <button
            onClick={toggleSound}
            className="fixed top-4 right-4 w-12 h-12 rounded-full 
                     bg-white shadow-[0_0_15px_rgba(0,0,0,0.2)]
                     hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]
                     transition-all duration-300 flex items-center justify-center 
                     text-2xl transform hover:scale-110"
            aria-label={isSoundEnabled ? 'Выключить звук' : 'Включить звук'}
        >
            {isSoundEnabled ? '🔊' : '🔈'}
        </button>
    );
};