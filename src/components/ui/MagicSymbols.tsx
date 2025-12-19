import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const MAGIC_SYMBOLS = [
    '🜁', // Воздух (алхимия)
    '🜂', // Огонь (алхимия)
    '🜄', // Вода (алхимия)
    '🜃', // Земля (алхимия)
    '☉', // Солнце
    '☽', // Луна
    '⚹', // Звезда
    '⚶', // Магический символ
    '⚷', // Магический символ
    '⚯', // Магический символ
    '🝳', // Алхимический символ
    '⚸', // Магический символ
];

// Позиции для обычных символов
const POSITIONS = [
    { x: '5%', y: '15%' },
    { x: '3%', y: '35%' },
    { x: '7%', y: '55%' },
    { x: '4%', y: '75%' },
    { x: '95%', y: '20%' },
    { x: '93%', y: '40%' },
    { x: '97%', y: '60%' },
    { x: '94%', y: '80%' },
];

// Позиции для больших символов
const LARGE_POSITIONS = [
    { x: '-5%', y: '10%' },
    { x: '85%', y: '15%' },
    { x: '-10%', y: '60%' },
    { x: '80%', y: '65%' },
];

export const MagicSymbols = () => {
    useGSAP(() => {
        const container = document.querySelector('.magic-symbols-container');
        if (!container) return;

        const createSymbol = (isLarge = false) => {
            const symbol = document.createElement('div');
            const randomSymbol = MAGIC_SYMBOLS[Math.floor(Math.random() * MAGIC_SYMBOLS.length)];
            const position = isLarge 
                ? LARGE_POSITIONS[Math.floor(Math.random() * LARGE_POSITIONS.length)]
                : POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
            
            symbol.textContent = randomSymbol;
            symbol.className = isLarge 
                ? 'absolute text-[20rem] opacity-0 magic-symbol select-none'
                : 'absolute text-4xl opacity-0 magic-symbol select-none';
            symbol.style.left = position.x;
            symbol.style.top = position.y;
            symbol.style.color = 'rgba(255, 241, 242, 0.05)';
            symbol.style.filter = isLarge ? 'blur(2px)' : 'blur(0.5px)';
            symbol.style.textShadow = isLarge 
                ? '0 0 40px rgba(255, 241, 242, 0.03)'
                : '0 0 20px rgba(255, 241, 242, 0.03)';
            container.appendChild(symbol);

            const timeline = gsap.timeline();
            
            if (isLarge) {
                timeline
                    .to(symbol, {
                        opacity: 0.15,
                        scale: 1.2,
                        rotation: gsap.utils.random(-5, 5),
                        duration: 4,
                        ease: "power2.out"
                    })
                    .to(symbol, {
                        opacity: 0,
                        scale: 0.9,
                        rotation: gsap.utils.random(-10, 10),
                        duration: 3,
                        delay: 2,
                        ease: "power2.in",
                        onComplete: () => {
                            symbol.remove();
                        }
                    });
            } else {
                timeline
                    .to(symbol, {
                        opacity: 0.2,
                        scale: 1.4,
                        rotation: gsap.utils.random(-10, 10),
                        duration: 2,
                        ease: "power2.out"
                    })
                    .to(symbol, {
                        opacity: 0,
                        scale: 0.8,
                        rotation: gsap.utils.random(-20, 20),
                        duration: 2,
                        delay: 1.5,
                        ease: "power2.in",
                        onComplete: () => {
                            symbol.remove();
                        }
                    });
            }
        };

        // Создаем начальные символы
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createSymbol(), i * 1000);
        }

        // Создаем большой символ при старте
        setTimeout(() => createSymbol(true), 2000);

        // Создаем новые символы
        const interval = setInterval(() => {
            if (Math.random() > 0.5) { // 50% шанс появления
                const isLarge = Math.random() > 0.85; // 15% шанс большого символа
                createSymbol(isLarge);
            }
        }, gsap.utils.random(3000, 6000));

        return () => clearInterval(interval);
    }, []);

    return <div className="magic-symbols-container absolute inset-0 pointer-events-none z-50" />;
}; 