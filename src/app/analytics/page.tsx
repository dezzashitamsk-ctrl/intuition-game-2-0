'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { analyticsService } from '../../services/AnalyticsService';
import type { AnalyticsData } from '../../types/analytics';
import { AnimatedBackground } from '../../components/ui/AnimatedBackground';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const SECRET_KEY = 'intuition_research_2025';

export default function AnalyticsPage() {
    const searchParams = useSearchParams();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [stats, setStats] = useState<{
        totalUsers: number;
        totalPredictions: number;
        overallAccuracy: number;
        accuracyByMode: { color: number; suit: number; rank: number; full: number };
    } | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const key = searchParams.get('key');
        if (key === SECRET_KEY) {
            setIsAuthorized(true);
            loadData();
        }
    }, [searchParams]);

    const loadData = () => {
        const analyticsData = analyticsService.getAllData();
        setData(analyticsData);

        // Calculate aggregate stats
        const uniqueUsers = new Set(analyticsData.predictions.map(p => p.userId)).size;
        const totalPreds = analyticsData.predictions.length;
        const correctPreds = analyticsData.predictions.filter(p => p.correct).length;
        const accuracy = totalPreds > 0 ? (correctPreds / totalPreds) * 100 : 0;

        const accuracyByMode = {
            color: calculateModeAccuracy(analyticsData.predictions, 'color'),
            suit: calculateModeAccuracy(analyticsData.predictions, 'suit'),
            rank: calculateModeAccuracy(analyticsData.predictions, 'rank'),
            full: calculateModeAccuracy(analyticsData.predictions, 'full'),
        };

        setStats({
            totalUsers: uniqueUsers,
            totalPredictions: totalPreds,
            overallAccuracy: accuracy,
            accuracyByMode,
        });

        // Prepare chart data - accuracy over time (grouped by 10 predictions)
        const groupedData = [];
        const groupSize = 10;
        for (let i = 0; i < analyticsData.predictions.length; i += groupSize) {
            const group = analyticsData.predictions.slice(i, i + groupSize);
            const correct = group.filter(p => p.correct).length;
            const accuracy = (correct / group.length) * 100;

            groupedData.push({
                game: Math.floor(i / groupSize) + 1,
                accuracy: parseFloat(accuracy.toFixed(1)),
                predictions: group.length,
            });
        }
        setChartData(groupedData);
    };

    const calculateModeAccuracy = (
        predictions: any[],
        mode: 'color' | 'suit' | 'rank' | 'full'
    ): number => {
        const modePreds = predictions.filter(p => p.mode === mode);
        if (modePreds.length === 0) return 0;
        const correct = modePreds.filter(p => p.correct).length;
        return (correct / modePreds.length) * 100;
    };

    const handleExport = () => {
        const dataStr = analyticsService.exportData();
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `intuition-analytics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen relative flex items-center justify-center">
                <AnimatedBackground variant="game" />
                <div className="glass-dark rounded-3xl p-12 max-w-md text-center relative z-10">
                    <h1 className="text-4xl font-bold text-red-400 mb-4 font-[family-name:var(--font-orbitron)]">
                        🔒 Access Denied
                    </h1>
                    <p className="text-gray-300">
                        This page requires authorization.
                    </p>
                </div>
            </div>
        );
    }

    const randomBaseline = {
        color: 50,
        suit: 25,
        rank: 7.7,
        full: 1.9,
    };

    return (
        <div className="min-h-screen relative">
            <AnimatedBackground variant="game" />

            <div className="container mx-auto p-4 md:p-8 relative z-10">
                {/* Header */}
                <div className="glass-dark rounded-3xl p-6 md:p-8 mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-blue-400 mb-2 font-[family-name:var(--font-orbitron)]">
                        📊 Analytics Dashboard
                    </h1>
                    <p className="text-gray-300">
                        Intuition Research Data • Private Access
                    </p>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-dark rounded-2xl p-6 border-2 border-blue-500/30">
                        <div className="text-blue-400 text-sm mb-2 font-[family-name:var(--font-orbitron)]">
                            TOTAL USERS
                        </div>
                        <div className="text-5xl font-bold text-white font-[family-name:var(--font-orbitron)]">
                            {stats?.totalUsers || 0}
                        </div>
                    </div>

                    <div className="glass-dark rounded-2xl p-6 border-2 border-purple-500/30">
                        <div className="text-purple-400 text-sm mb-2 font-[family-name:var(--font-orbitron)]">
                            TOTAL PREDICTIONS
                        </div>
                        <div className="text-5xl font-bold text-white font-[family-name:var(--font-orbitron)]">
                            {stats?.totalPredictions || 0}
                        </div>
                    </div>

                    <div className="glass-dark rounded-2xl p-6 border-2 border-green-500/30">
                        <div className="text-green-400 text-sm mb-2 font-[family-name:var(--font-orbitron)]">
                            OVERALL ACCURACY
                        </div>
                        <div className="text-5xl font-bold text-white font-[family-name:var(--font-orbitron)]">
                            {stats?.overallAccuracy.toFixed(1)}%
                        </div>
                    </div>
                </div>

                {/* Progress Chart */}
                {chartData.length > 0 && (
                    <div className="glass-dark rounded-3xl p-6 md:p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-orbitron)]">
                            📈 Accuracy Over Time
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Grouped by 10 predictions • Shows learning curve
                        </p>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis
                                    dataKey="game"
                                    stroke="#9CA3AF"
                                    label={{ value: 'Game Group', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
                                />
                                <YAxis
                                    stroke="#9CA3AF"
                                    label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                                    domain={[0, 100]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                        border: '1px solid rgba(59, 130, 246, 0.5)',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="accuracy"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3B82F6', r: 4 }}
                                    activeDot={{ r: 6 }}
                                    name="Accuracy %"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Accuracy by Mode */}
                <div className="glass-dark rounded-3xl p-6 md:p-8 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-orbitron)]">
                        🎯 Accuracy by Mode
                    </h2>

                    <div className="space-y-6">
                        {/* Color */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-white font-medium">🔴 Color</span>
                                <span className="text-gray-400">
                                    {stats?.accuracyByMode.color.toFixed(1)}%
                                    <span className="text-xs ml-2">
                                        (baseline: {randomBaseline.color}%)
                                    </span>
                                </span>
                            </div>
                            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                    style={{ width: `${Math.min(stats?.accuracyByMode.color || 0, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Suit */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-white font-medium">♠️ Suit</span>
                                <span className="text-gray-400">
                                    {stats?.accuracyByMode.suit.toFixed(1)}%
                                    <span className="text-xs ml-2">
                                        (baseline: {randomBaseline.suit}%)
                                    </span>
                                </span>
                            </div>
                            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                                    style={{ width: `${Math.min(stats?.accuracyByMode.suit || 0, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Rank */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-white font-medium">🎯 Rank</span>
                                <span className="text-gray-400">
                                    {stats?.accuracyByMode.rank.toFixed(1)}%
                                    <span className="text-xs ml-2">
                                        (baseline: {randomBaseline.rank}%)
                                    </span>
                                </span>
                            </div>
                            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-500"
                                    style={{ width: `${Math.min((stats?.accuracyByMode.rank || 0) * 2, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Full */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-white font-medium">🃏 Full Card</span>
                                <span className="text-gray-400">
                                    {stats?.accuracyByMode.full.toFixed(1)}%
                                    <span className="text-xs ml-2">
                                        (baseline: {randomBaseline.full}%)
                                    </span>
                                </span>
                            </div>
                            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                                    style={{ width: `${Math.min((stats?.accuracyByMode.full || 0) * 10, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="glass-dark rounded-3xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-orbitron)]">
                        💾 Data Export
                    </h2>

                    <button
                        onClick={handleExport}
                        className="glass-dark px-8 py-4 rounded-xl
                                 bg-gradient-to-r from-blue-500/20 to-purple-500/20
                                 border-2 border-blue-500/50
                                 hover:border-blue-400
                                 hover:scale-105
                                 active:scale-95
                                 transition-all duration-300
                                 text-white font-bold
                                 font-[family-name:var(--font-orbitron)]"
                    >
                        📥 Export JSON
                    </button>

                    <p className="text-gray-400 text-sm mt-4">
                        Export all data for analysis in Python, R, or Excel
                    </p>
                </div>
            </div>
        </div>
    );
}
