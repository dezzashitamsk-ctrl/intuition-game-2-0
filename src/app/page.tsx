'use client';

import dynamic from 'next/dynamic';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const Game = dynamic(() => import('../components/game/Game').then(mod => ({ default: mod.Game })), {
    ssr: false,
    loading: () => <LoadingScreen />,
    suspense: false
});

export default function Home() {
    return (
        <>
            <ThemeToggle />
            <Game />
        </>
    );
}
