'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CatsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 text-center"
            >
                <h1 className="text-4xl font-bold text-[#FFF1F2]">
                    Секретная страница с котиками
                </h1>
                <p className="text-[#FFF1F2]/60">
                    Вы нашли секретную страницу! 🎉
                </p>
                <motion.button
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-[#1A1A1A] text-[#FFF1F2]/90 rounded-lg
                             hover:bg-[#1E1E1E] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Вернуться назад
                </motion.button>
            </motion.div>
        </div>
    );
} 