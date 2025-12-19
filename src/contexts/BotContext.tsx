'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { BotService } from '../services/BotService';
import { IBotService } from '../types/bot';

const BotContext = createContext<IBotService | null>(null);

interface BotProviderProps {
    children: ReactNode;
    initialDifficulty?: 'easy' | 'medium' | 'hard';
}

export const BotProvider: React.FC<BotProviderProps> = ({ 
    children, 
    initialDifficulty = 'medium' 
}) => {
    const botService = new BotService(initialDifficulty);

    return (
        <BotContext.Provider value={botService}>
            {children}
        </BotContext.Provider>
    );
};

export const useBotService = () => {
    const context = useContext(BotContext);
    if (!context) {
        throw new Error('useBotService must be used within a BotProvider');
    }
    return context;
}; 