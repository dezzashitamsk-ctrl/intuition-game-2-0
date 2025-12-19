'use client';

import { ReactNode, useEffect } from 'react';
import { BotProvider } from '../contexts/BotContext';

export default function ClientProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        // Удаляем атрибуты Grammarly после монтирования
        const body = document.body;
        if (body.hasAttribute('data-new-gr-c-s-check-loaded')) {
            body.removeAttribute('data-new-gr-c-s-check-loaded');
        }
        if (body.hasAttribute('data-gr-ext-installed')) {
            body.removeAttribute('data-gr-ext-installed');
        }
    }, []);

    return (
        <BotProvider initialDifficulty="medium">
            {children}
        </BotProvider>
    );
} 