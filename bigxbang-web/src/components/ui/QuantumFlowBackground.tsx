"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

// Generate random stars
const generateStars = (count: number) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
        stars.push({
            id: i,
            cx: Math.random() * 100,
            cy: Math.random() * 100,
            r: Math.random() * 0.8 + 0.2, // 0.2 to 1px
            opacity: Math.random() * 0.5 + 0.2, // 0.2 to 0.7
        });
    }
    return stars;
};

export default function QuantumFlowBackground({ className }: { className?: string }) {
    const stars = useMemo(() => generateStars(150), []);

    return (
        <div className={`w-full h-full overflow-hidden pointer-events-none ${className}`}>
            {/* Base black */}
            <div className="absolute inset-0 bg-black" />

            {/* Stars SVG */}
            <svg
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                {stars.map((star) => (
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

            {/* Top left glow */}
            <motion.div
                className="absolute"
                style={{
                    width: '120vw',
                    height: '120vh',
                    background: 'radial-gradient(ellipse at center, rgba(48, 110, 232, 0.4) 0%, transparent 70%)',
                    left: '-50%',
                    top: '-50%',
                }}
                animate={{
                    x: [0, 40, 0],
                    y: [0, 50, 0],
                    opacity: [0.7, 1, 0.7],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Top right glow */}
            <motion.div
                className="absolute"
                style={{
                    width: '110vw',
                    height: '110vh',
                    background: 'radial-gradient(ellipse at center, rgba(48, 110, 232, 0.35) 0%, transparent 70%)',
                    right: '-45%',
                    top: '-45%',
                }}
                animate={{
                    x: [0, -35, 0],
                    y: [0, 40, 0],
                    opacity: [0.6, 1, 0.6],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Bottom left glow */}
            <motion.div
                className="absolute"
                style={{
                    width: '130vw',
                    height: '120vh',
                    background: 'radial-gradient(ellipse at center, rgba(48, 110, 232, 0.45) 0%, transparent 70%)',
                    left: '-55%',
                    bottom: '-55%',
                }}
                animate={{
                    x: [0, 50, 0],
                    y: [0, -60, 0],
                    opacity: [0.7, 1, 0.7],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Bottom right glow */}
            <motion.div
                className="absolute"
                style={{
                    width: '120vw',
                    height: '115vh',
                    background: 'radial-gradient(ellipse at center, rgba(48, 110, 232, 0.38) 0%, transparent 70%)',
                    right: '-50%',
                    bottom: '-50%',
                }}
                animate={{
                    x: [0, -45, 0],
                    y: [0, -50, 0],
                    opacity: [0.6, 1, 0.6],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Center glow */}
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
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.9, 0.5],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Soft vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.3) 80%)',
                }}
            />
        </div>
    );
}
