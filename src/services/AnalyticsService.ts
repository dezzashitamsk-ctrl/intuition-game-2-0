'use client';

import { v4 as uuidv4 } from 'uuid';
import type { PredictionRecord, SessionRecord, AnalyticsData, UserStats } from '../types/analytics';
import type { Card, Prediction } from '../types/game';

const STORAGE_KEY = 'intuition_analytics';
const USER_ID_KEY = 'intuition_user_id';
const SESSION_ID_KEY = 'intuition_session_id';
const VERSION = '1.0.0';

class AnalyticsService {
    private userId: string;
    private sessionId: string;
    private gameNumber: number = 0;

    constructor() {
        this.userId = this.getOrCreateUserId();
        this.sessionId = this.getOrCreateSessionId();
    }

    /**
     * Get or create anonymous user ID
     */
    private getOrCreateUserId(): string {
        if (typeof window === 'undefined') return 'server';

        let userId = localStorage.getItem(USER_ID_KEY);
        if (!userId) {
            userId = `user_${uuidv4()}`;
            localStorage.setItem(USER_ID_KEY, userId);
        }
        return userId;
    }

    /**
     * Get or create session ID
     */
    private getOrCreateSessionId(): string {
        if (typeof window === 'undefined') return 'server';

        let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
        if (!sessionId) {
            sessionId = `session_${uuidv4()}`;
            sessionStorage.setItem(SESSION_ID_KEY, sessionId);
        }
        return sessionId;
    }

    /**
     * Get all analytics data from localStorage
     */
    private getData(): AnalyticsData {
        if (typeof window === 'undefined') {
            return { predictions: [], sessions: [], version: VERSION };
        }

        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) {
                return { predictions: [], sessions: [], version: VERSION };
            }
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading analytics data:', error);
            return { predictions: [], sessions: [], version: VERSION };
        }
    }

    /**
     * Save analytics data to localStorage
     */
    private saveData(data: AnalyticsData): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving analytics data:', error);
            // If quota exceeded, remove oldest predictions
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                this.cleanupOldData();
            }
        }
    }

    /**
     * Remove oldest data to free up space
     */
    private cleanupOldData(): void {
        const data = this.getData();
        // Keep only last 1000 predictions
        if (data.predictions.length > 1000) {
            data.predictions = data.predictions.slice(-1000);
            this.saveData(data);
        }
    }

    /**
     * Track a prediction
     */
    trackPrediction(
        mode: 'color' | 'suit' | 'rank' | 'full',
        prediction: Prediction,
        actual: Card,
        correct: boolean,
        points: number,
        currentStreak: number,
        previousResult?: boolean
    ): void {
        const data = this.getData();

        const record: PredictionRecord = {
            id: `pred_${uuidv4()}`,
            userId: this.userId,
            sessionId: this.sessionId,
            timestamp: Date.now(),
            mode,
            prediction: {
                color: prediction.color,
                suit: prediction.suit,
                rank: prediction.rank,
            },
            actual: {
                color: actual.color,
                suit: actual.suit,
                rank: actual.rank,
            },
            correct,
            points,
            previousResult,
            currentStreak,
            gameNumber: this.gameNumber,
        };

        data.predictions.push(record);
        this.saveData(data);
        this.gameNumber++;
    }

    /**
     * Start a new session
     */
    startSession(deviceType: 'mobile' | 'desktop' = 'desktop'): void {
        const data = this.getData();

        const session: SessionRecord = {
            sessionId: this.sessionId,
            userId: this.userId,
            startTime: Date.now(),
            totalPredictions: 0,
            correctPredictions: 0,
            totalPoints: 0,
            deviceType,
        };

        data.sessions.push(session);
        this.saveData(data);
        this.gameNumber = 0;
    }

    /**
     * End current session
     */
    endSession(): void {
        const data = this.getData();
        const session = data.sessions.find(s => s.sessionId === this.sessionId);

        if (session) {
            session.endTime = Date.now();

            // Calculate session stats
            const sessionPredictions = data.predictions.filter(
                p => p.sessionId === this.sessionId
            );
            session.totalPredictions = sessionPredictions.length;
            session.correctPredictions = sessionPredictions.filter(p => p.correct).length;
            session.totalPoints = sessionPredictions.reduce((sum, p) => sum + p.points, 0);

            this.saveData(data);
        }
    }

    /**
     * Get user statistics
     */
    getUserStats(): UserStats {
        const data = this.getData();
        const userPredictions = data.predictions.filter(p => p.userId === this.userId);

        if (userPredictions.length === 0) {
            return {
                userId: this.userId,
                totalSessions: 0,
                totalPredictions: 0,
                overallAccuracy: 0,
                accuracyByMode: { color: 0, suit: 0, rank: 0, full: 0 },
                bestStreak: 0,
                totalPoints: 0,
                firstPlayDate: Date.now(),
                lastPlayDate: Date.now(),
            };
        }

        const correct = userPredictions.filter(p => p.correct).length;
        const accuracy = (correct / userPredictions.length) * 100;

        const accuracyByMode = {
            color: this.calculateModeAccuracy(userPredictions, 'color'),
            suit: this.calculateModeAccuracy(userPredictions, 'suit'),
            rank: this.calculateModeAccuracy(userPredictions, 'rank'),
            full: this.calculateModeAccuracy(userPredictions, 'full'),
        };

        const bestStreak = Math.max(...userPredictions.map(p => p.currentStreak), 0);
        const totalPoints = userPredictions.reduce((sum, p) => sum + p.points, 0);

        return {
            userId: this.userId,
            totalSessions: data.sessions.filter(s => s.userId === this.userId).length,
            totalPredictions: userPredictions.length,
            overallAccuracy: accuracy,
            accuracyByMode,
            bestStreak,
            totalPoints,
            firstPlayDate: userPredictions[0].timestamp,
            lastPlayDate: userPredictions[userPredictions.length - 1].timestamp,
        };
    }

    /**
     * Calculate accuracy for specific mode
     */
    private calculateModeAccuracy(
        predictions: PredictionRecord[],
        mode: 'color' | 'suit' | 'rank' | 'full'
    ): number {
        const modePredictions = predictions.filter(p => p.mode === mode);
        if (modePredictions.length === 0) return 0;

        const correct = modePredictions.filter(p => p.correct).length;
        return (correct / modePredictions.length) * 100;
    }

    /**
     * Get all analytics data (for admin dashboard)
     */
    getAllData(): AnalyticsData {
        return this.getData();
    }

    /**
     * Export data as JSON
     */
    exportData(): string {
        return JSON.stringify(this.getData(), null, 2);
    }

    /**
     * Clear all analytics data
     */
    clearData(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEY);
    }
}

// Singleton instance
export const analyticsService = new AnalyticsService();
