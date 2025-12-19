'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

export const ParallaxBackground = () => {
    const ref = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (event: React.MouseEvent) => {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;
        
        // Нормализуем координаты мыши от -1 до 1
        const normalizedX = (clientX / innerWidth) * 2 - 1;
        const normalizedY = (clientY / innerHeight) * 2 - 1;
        
        mouseX.set(normalizedX * 20); // Множитель определяет силу эффекта
        mouseY.set(normalizedY * 20);
    };

    // Плавное движение для параллакса
    const springConfig = { damping: 25, stiffness: 100 };
    const rotateX = useSpring(useTransform(mouseY, [-1, 1], [5, -5]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), springConfig);

    return (
        <motion.div 
            ref={ref}
            onMouseMove={handleMouseMove}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: "1000px"
            }}
            className="absolute inset-0 overflow-hidden"
        >
            {/* Сетка */}
            <motion.div 
                className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.15]"
                style={{
                    translateZ: "-50px",
                }}
            />

            {/* Градиентные круги */}
            <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem]
                          bg-[#FFEEB3] rounded-full mix-blend-soft-light filter blur-[120px] opacity-[0.07]"
                style={{
                    translateZ: "50px",
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.07, 0.1, 0.07],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Дополнительные градиентные эффекты */}
            <motion.div 
                className="absolute inset-0"
                style={{
                    translateZ: "30px",
                }}
            >
                <motion.div 
                    className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full mix-blend-soft-light filter blur-3xl"
                    animate={{
                        y: [0, 100, 0],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div 
                    className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full mix-blend-soft-light filter blur-3xl"
                    animate={{
                        x: [0, -50, 0],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>
        </motion.div>
    );
}; 