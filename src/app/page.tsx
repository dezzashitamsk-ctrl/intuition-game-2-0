import { Game } from '../components/Game';

// Корневой компонент приложения
export default function Home() {
    return (
        // Основной контейнер с минимальной высотой экрана и светлым фоном
        <main className="min-h-screen bg-gray-50 py-8">
            <Game />
        </main>
    );
}
