import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface WinAnimationProps {
    amount: number;
    position: { x: number; y: number };
    onComplete?: () => void;
}

export const WinAnimation: React.FC<WinAnimationProps> = ({ amount, position, onComplete }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ 
                    opacity: 0,
                    scale: 0.5,
                    x: position.x,
                    y: position.y
                }}
                animate={{ 
                    opacity: 1,
                    scale: 1.2,
                    y: position.y - 50
                }}
                exit={{ 
                    opacity: 0,
                    scale: 0.5,
                    y: position.y - 100
                }}
                transition={{ 
                    duration: 1,
                    ease: "easeOut"
                }}
                onAnimationComplete={onComplete}
                className="fixed pointer-events-none text-2xl font-bold text-yellow-400 z-50 text-shadow-lg"
                style={{ 
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    whiteSpace: 'nowrap'
                }}
            >
                +{amount} 💰
            </motion.div>
        </AnimatePresence>
    );
}; 