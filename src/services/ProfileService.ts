/**
 * Сервис для работы с профилями игроков
 * Сохраняет общий счет игроков между играми
 */

export interface PlayerProfile {
    name: string;
    totalScore: number; // Общий счет за все игры
    gamesPlayed: number; // Количество сыгранных игр
    gamesWon: number; // Количество побед
    lastPlayed: number; // Timestamp последней игры
}

const STORAGE_KEY = 'intuition_game_profiles';

class ProfileService {
    /**
     * Получить профиль игрока по имени
     */
    getProfile(playerName: string): PlayerProfile {
        const profiles = this.getAllProfiles();
        const existing = profiles.find(p => p.name === playerName);

        if (existing) {
            return existing;
        }

        // Создаем новый профиль
        return {
            name: playerName,
            totalScore: 0,
            gamesPlayed: 0,
            gamesWon: 0,
            lastPlayed: Date.now()
        };
    }

    /**
     * Получить все профили
     */
    getAllProfiles(): PlayerProfile[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return [];
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading profiles:', error);
            return [];
        }
    }

    /**
     * Сохранить результаты игры
     * @param playerName - имя игрока
     * @param scoreEarned - очки, набранные в этой игре
     * @param isWinner - победил ли игрок
     */
    saveGameResult(playerName: string, scoreEarned: number, isWinner: boolean): PlayerProfile {
        const profiles = this.getAllProfiles();
        const existingIndex = profiles.findIndex(p => p.name === playerName);

        let profile: PlayerProfile;

        if (existingIndex >= 0) {
            // Обновляем существующий профиль
            profile = profiles[existingIndex];
            profile.totalScore += scoreEarned;
            profile.gamesPlayed += 1;
            if (isWinner) profile.gamesWon += 1;
            profile.lastPlayed = Date.now();
            profiles[existingIndex] = profile;
        } else {
            // Создаем новый профиль
            profile = {
                name: playerName,
                totalScore: scoreEarned,
                gamesPlayed: 1,
                gamesWon: isWinner ? 1 : 0,
                lastPlayed: Date.now()
            };
            profiles.push(profile);
        }

        // Сохраняем в localStorage
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
            console.log('Profile saved:', profile);
        } catch (error) {
            console.error('Error saving profile:', error);
        }

        return profile;
    }

    /**
     * Получить топ игроков по общему счету
     */
    getLeaderboard(limit: number = 10): PlayerProfile[] {
        const profiles = this.getAllProfiles();
        return profiles
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, limit);
    }

    /**
     * Очистить все профили (для отладки)
     */
    clearAllProfiles(): void {
        localStorage.removeItem(STORAGE_KEY);
        console.log('All profiles cleared');
    }
}

export const profileService = new ProfileService();
