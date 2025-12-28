// Telegram WebApp utilities
export interface TelegramWebApp {
    ready: () => void;
    expand: () => void;
    enableClosingConfirmation: () => void;
    disableClosingConfirmation: () => void;
    close: () => void;
    MainButton: {
        text: string;
        color: string;
        textColor: string;
        isVisible: boolean;
        isActive: boolean;
        show: () => void;
        hide: () => void;
        enable: () => void;
        disable: () => void;
        onClick: (callback: () => void) => void;
    };
    initDataUnsafe: {
        user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
        };
    };
    colorScheme: 'light' | 'dark';
}

/**
 * Initialize Telegram WebApp
 * Call this on app startup to enable Telegram-specific features
 */
export function initTelegramWebApp(): TelegramWebApp | null {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;

        // Initialize WebApp
        tg.ready();

        // Expand to full height
        tg.expand();

        // Enable closing confirmation
        tg.enableClosingConfirmation();

        console.log('✅ Telegram WebApp initialized');
        console.log('User:', tg.initDataUnsafe.user);
        console.log('Theme:', tg.colorScheme);

        return tg;
    }

    console.log('ℹ️ Not running in Telegram WebApp');
    return null;
}

/**
 * Check if running in Telegram
 */
export function isTelegramWebApp(): boolean {
    return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
}

/**
 * Get Telegram user data
 */
export function getTelegramUser() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        return window.Telegram.WebApp.initDataUnsafe.user;
    }
    return null;
}
