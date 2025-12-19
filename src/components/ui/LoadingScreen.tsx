import React from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
    return (
        <motion.div
            className="fixed inset-0 bg-[#111111] flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="text-center">
                <motion.div
                    className="text-6xl text-[#333333] mb-4"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    ♣
                </motion.div>
                <p className="text-[#FFF1F2]/60 text-sm tracking-[0.2em] uppercase">
                    Загрузка игры...
                </p>
            </div>
        </motion.div>
    );
}; 