"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";

interface Star {
    id: number;
    cx: number;
    cy: number;
    r: number;
    opacity: number;
}

// Generate random stars - called ONCE at module load
const generateStars = (count: number): Star[] => {
    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
        stars.push({
            id: i,
            cx: Math.random() * 100,
            cy: Math.random() * 100,
            r: Math.random() * 0.8 + 0.2,
            opacity: Math.random() * 0.5 + 0.2,
        });
    }
    return stars;
};

// Pre-generate stars ONCE (not on each render)
const STATIC_STARS = generateStars(150);

function QuantumFlowBackgroundComponent({ className }: { className?: string }) {
    return (
        <div className={`w-full h-full overflow-hidden pointer-events-none ${className}`}>
            <div className="absolute inset-0 bg-black" />

            <svg
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                {STATIC_STARS.map((star) => (
                    <circle
                        key={star.id}
                        cx={`${star.cx}%`}
                        cy={`${star.cy}%`}
                        r={star.r}
                        fill="white"
                        opacity={star.opacity}
                    />
                ))}
            </svg>

            <motion.div
                className="absolute"
                style={{
                    width: '120vw',
                    height: '120vh',
                    background: 'radial-gradient(ellipse at center, rgba(48, 110, 232, 0.4) 0%, transparent 70%)',
                    left: '-50%',
                    top: '-50%',
                }}
                animate={{ x: [0, 40, 0], y: [0, 50, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute"
                style={{
                    width: '110vw',
                    height: '110vh',
                    background: 'radial-gradient(ellipse at center, rgba(48, 110, 232, 0.35) 0%, transparent 70%)',
                    right: '-45%',
                    top: '-45%',
                }}
                animate={{ x: [0, -35, 0], y: [0, 40, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute"
                style={{
                    width: '130vw',
                    height: '120vh',
                    background: 'radial-gradient(ellipse at center, rgba(48, 110, 232, 0.45) 0%, transparent 70%)',
                    left: '-55%',
                    bottom: '-55%',
                }}
                animate={{ x: [0, 50, 0], y: [0, -60, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute"
                style={{
                    width: '120vw',
                    height: '115vh',
                    background: 'radial-gradient(ellipse at center, rgba(48, 110, 232, 0.38) 0%, transparent 70%)',
                    right: '-50%',
                    bottom: '-50%',
                }}
                animate={{ x: [0, -45, 0], y: [0, -50, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute"
                style={{
                    width: '100vw',
                    height: '100vh',
                    background: 'radial-gradient(ellipse at center, rgba(48, 110, 232, 0.25) 0%, transparent 65%)',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />

            <div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.3) 80%)' }}
            />
        </div>
    );
}

export default memo(QuantumFlowBackgroundComponent);
