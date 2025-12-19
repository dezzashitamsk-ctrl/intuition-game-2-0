// Analytics data types for intuition research

export interface PredictionRecord {
    // Unique identifiers
    id: string;
    userId: string;
    sessionId: string;
    timestamp: number;

    // Prediction details
    mode: 'color' | 'suit' | 'rank' | 'full';
    prediction: {
        color?: 'red' | 'black';
        suit?: string;
        rank?: string;
    };

    // Actual card
    actual: {
        color: 'red' | 'black';
        suit: string;
        rank: string;
    };

    // Result
    correct: boolean;
    points: number;

    // Context
    previousResult?: boolean;
    currentStreak: number;
    gameNumber: number; // Which game in the session
}

export interface SessionRecord {
    sessionId: string;
    userId: string;
    startTime: number;
    endTime?: number;
    totalPredictions: number;
    correctPredictions: number;
    totalPoints: number;
    deviceType: 'mobile' | 'desktop';
}

export interface UserStats {
    userId: string;
    totalSessions: number;
    totalPredictions: number;
    overallAccuracy: number;
    accuracyByMode: {
        color: number;
        suit: number;
        rank: number;
        full: number;
    };
    bestStreak: number;
    totalPoints: number;
    firstPlayDate: number;
    lastPlayDate: number;
}

export interface AnalyticsData {
    predictions: PredictionRecord[];
    sessions: SessionRecord[];
    version: string; // For future migrations
}
