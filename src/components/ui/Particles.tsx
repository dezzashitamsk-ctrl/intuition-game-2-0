'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface Particle {
    x: number;
    y: number;
    size: number;
    color: string;
    speed: number;
}

export const Particles = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const requestRef = useRef<number>();

    useGSAP(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const { width, height } = container.getBoundingClientRect();

        // Создаем частицы
        const particleCount = 50;
        const particles: Particle[] = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2 + 1,
                color: `rgba(255, 241, 242, ${Math.random() * 0.2})`,
                speed: Math.random() * 0.5 + 0.2
            });
        }

        particlesRef.current = particles;

        // Анимация частиц
        const animate = () => {
            particlesRef.current = particlesRef.current.map(particle => ({
                ...particle,
                y: particle.y - particle.speed,
                ...(particle.y < 0 ? { y: height } : {})
            }));

            // Обновляем DOM
            const particleElements = container.children;
            particlesRef.current.forEach((particle, index) => {
                if (particleElements[index]) {
                    gsap.set(particleElements[index], {
                        x: particle.x,
                        y: particle.y,
                        opacity: Math.random() * 0.5 + 0.5
                    });
                }
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    return (
        <div 
            ref={containerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none"
        >
            {Array.from({ length: 50 }).map((_, index) => (
                <motion.div
                    key={index}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                        backgroundColor: `rgba(255, 241, 242, ${Math.random() * 0.2})`,
                        width: `${Math.random() * 2 + 1}px`,
                        height: `${Math.random() * 2 + 1}px`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
}; 