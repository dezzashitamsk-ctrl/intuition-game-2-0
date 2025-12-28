import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../../hooks/useSound';

interface TurnTimerProps {
    timeLeft: number; // seconds
    totalTime: number; // seconds
    onTimeout: () => void;
}

export const TurnTimer: React.FC<TurnTimerProps> = ({ timeLeft, totalTime, onTimeout }) => {
    const { playSound } = useSound();
    const [lastTimeLeft, setLastTimeLeft] = useState(timeLeft);

    // Play sound every second when ≤5 seconds
    useEffect(() => {
        if (timeLeft <= 5 && timeLeft > 0 && timeLeft !== lastTimeLeft) {
            playSound();
            setLastTimeLeft(timeLeft);
        }
    }, [timeLeft, lastTimeLeft, playSound]);

    // Call onTimeout and play sound when time runs out
    useEffect(() => {
        if (timeLeft <= 0) {
            playSound(); // Timeout sound
            onTimeout();
        }
    }, [timeLeft, onTimeout, playSound]);

    // Calculate progress percentage
    const progress = (timeLeft / totalTime) * 100;

    // Determine color based on time left
    const getColor = () => {
        if (timeLeft <= 5) return 'text-red-400';
        if (timeLeft <= 10) return 'text-yellow-400';
        return 'text-green-400';
    };

    const getGlowColor = () => {
        if (timeLeft <= 5) return 'shadow-[0_0_30px_rgba(239,68,68,0.6)]';
        if (timeLeft <= 10) return 'shadow-[0_0_30px_rgba(251,191,36,0.6)]';
        return 'shadow-[0_0_30px_rgba(34,197,94,0.6)]';
    };

    const getStrokeColor = () => {
        if (timeLeft <= 5) return '#ef4444';
        if (timeLeft <= 10) return '#fbbf24';
        return '#22c55e';
    };

    // SVG circle parameters
    const size = 120;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`
                glass-dark rounded-2xl p-4
                border-2 border-white/10
                ${getGlowColor()}
                transition-all duration-300
            `}
        >
            <div className="flex flex-col items-center gap-2">
                {/* Timer Icon */}
                <div className="text-2xl">⏱️</div>

                {/* Circular Progress */}
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
                                text-5xl font-bold
                                ${getColor()}
                                font-[family-name:var(--font-orbitron)]
                                tabular-nums
                            `}
                        >
                            {timeLeft}
                        </motion.div>
                    </div>
                </div>

                {/* Label */}
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Ваш ход
                </div>
            </div>
        </motion.div>
    );
};
