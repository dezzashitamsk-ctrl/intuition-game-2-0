'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface GlitchTextProps {
    text: string;
    className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = '' }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const layers = container.children;

        // Создаем случайные искажения
        const createGlitch = () => {
            const duration = 0.1;
            const delay = Math.random() * 5;

            layers[0] && gsap.to(layers[0], {
                x: () => Math.random() * 3 - 1.5,
                y: () => Math.random() * 3 - 1.5,
                opacity: 0.8,
                duration,
                delay,
            });

            layers[1] && gsap.to(layers[1], {
                x: () => Math.random() * 3 - 1.5,
                y: () => Math.random() * 3 - 1.5,
                opacity: 0.8,
                duration,
                delay: delay + 0.1,
            });

            layers[2] && gsap.to(layers[2], {
                x: () => Math.random() * 3 - 1.5,
                y: () => Math.random() * 3 - 1.5,
                opacity: 0.8,
                duration,
                delay: delay + 0.2,
            });

            // Возвращаем в исходное положение
            gsap.to(layers, {
                x: 0,
                y: 0,
                opacity: 1,
                duration: 0.1,
                delay: delay + duration,
            });
        };

        // Запускаем искажения периодически
        const interval = setInterval(createGlitch, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Основной текст */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-[#FFF1F2] to-[#FFF1F2]/70 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {text}
            </motion.div>
            
            {/* Слой с красным смещ��нием */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-red-500 to-red-600 bg-clip-text text-transparent mix-blend-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                style={{ clipPath: 'inset(0)' }}
            >
                {text}
            </motion.div>
            
            {/* Слой с синим смещением */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-600 bg-clip-text text-transparent mix-blend-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                style={{ clipPath: 'inset(0)' }}
            >
                {text}
            </motion.div>
        </div>
    );
}; 