import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../../hooks/useSound';

interface CompactTimerProps {
    timeLeft: number;
    totalTime: number;
    isActive: boolean; // показывать ли таймер активным
    onTimeout?: () => void;
}

export const CompactTimer: React.FC<CompactTimerProps> = ({
    timeLeft,
    totalTime,
    isActive,
    onTimeout
}) => {
    const { playSound } = useSound();
    const [lastTimeLeft, setLastTimeLeft] = useState(timeLeft);

    // Play sound every second when ≤5 seconds and timer is active
    useEffect(() => {
        if (isActive && timeLeft <= 5 && timeLeft > 0 && timeLeft !== lastTimeLeft) {
            playSound();
            setLastTimeLeft(timeLeft);
        }
    }, [timeLeft, lastTimeLeft, playSound, isActive]);

    // Call onTimeout and play sound when time runs out
    useEffect(() => {
        if (isActive && timeLeft <= 0 && onTimeout) {
            playSound();
            onTimeout();
        }
    }, [timeLeft, onTimeout, playSound, isActive]);

    // Calculate progress percentage
    const progress = isActive ? (timeLeft / totalTime) * 100 : 100;

    // Determine color based on time left
    const getStrokeColor = () => {
        if (!isActive) return '#6b7280'; // Gray when inactive
        if (timeLeft <= 5) return '#ef4444'; // Red
        if (timeLeft <= 10) return '#fbbf24'; // Yellow
        return '#22c55e'; // Green
    };

    const getTextColor = () => {
        if (!isActive) return 'text-gray-500';
        if (timeLeft <= 5) return 'text-red-400';
        if (timeLeft <= 10) return 'text-yellow-400';
        return 'text-green-400';
    };

    // SVG circle parameters - компактный размер
    const size = 70;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            {/* Background circle */}
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={getStrokeColor()}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    animate={{
                        strokeDashoffset,
                    }}
                    transition={{ duration: 0.5, ease: "linear" }}
                />
            </svg>

            {/* Time text in center */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    key={timeLeft}
                    initial={{ scale: 1.2, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`
                        text-3xl font-bold
                        ${getTextColor()}
                        font-[family-name:var(--font-orbitron)]
                        tabular-nums
                    `}
                >
                    {isActive ? timeLeft : '—'}
                </motion.div>
            </div>
        </div>
    );
};
