"use client";

import React from "react";
import { motion } from "framer-motion";

interface ElectricScannerProps {
    color: string;
}

export const ElectricScanner = ({ color }: ElectricScannerProps) => {
    // Unique ID for the filter to avoid conflicts if multiple scanners existed (though here we have one)
    const filterId = "scanner-turbulence";

    return (
        <div className="relative w-full h-12 flex items-center justify-center pointer-events-none select-none">
            {/* SVG Filter Definition */}
            <svg className="absolute w-0 h-0">
                <defs>
                    <filter id={filterId}>
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.5"
                            numOctaves="2"
                            result="noise"
                        >
                            <animate
                                attributeName="baseFrequency"
                                values="0.02 0.15; 0.05 0.2; 0.01 0.15"
                                dur="0.2s"
                                repeatCount="indefinite"
                            />
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" />

                        {/* Glow / Bloom simulation via Gaussian Blur + Merge */}
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>

            {/* THE BEAM CORE (White Hot) */}
            <motion.div
                className="absolute w-[120%] h-1 bg-white shadow-[0_0_10px_white]"
                style={{
                    filter: `url(#${filterId})`
                }}
            />

            {/* THE COLOR GLOW (Outer Aura) */}
            <div
                className="absolute w-[120%] h-2 opacity-80 mix-blend-screen"
                style={{
                    backgroundColor: color,
                    boxShadow: `0 0 30px 5px ${color}`,
                    filter: `url(#${filterId}) blur(4px)`
                }}
            ></div>

            {/* SCANLINES / PARTICLES (Trailing Effect) */}
            {/* Pure CSS particles for performance */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
                        backgroundSize: "100% 4px",
                        opacity: 0.3
                    }}
                ></div>
            </div>

        </div>
    );
};
