'use client';

import dynamicImport from 'next/dynamic';
import { LoadingScreen } from '../components/ui/LoadingScreen';

const Game = dynamicImport(() => import('../components/game/Game').then(mod => ({ default: mod.Game })), {
    ssr: false,
    loading: () => <LoadingScreen />
});

const ThemeToggle = dynamicImport(() => import('../components/ui/ThemeToggle').then(mod => ({ default: mod.ThemeToggle })), {
    ssr: false
});

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic';

export default function Home() {
    return (
        <>
            <ThemeToggle />
            <Game />
        </>
    );
}
