"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ElectricNodeProps {
    type: "spark" | "arc" | "burst";
    active: boolean;
    className?: string;
}

/**
 * ELECTRIC NODE COMPONENT
 * Uses Framer Motion for animations and SVG Filters for the "Electric" look.
 * 
 * - Spark: Jittery, intense, unstable (High Frequency).
 * - Arc: Stabilized, rotating, magnetic (Mid Frequency).
 * - Burst: Expanding, explosive shockwave (Low Frequency).
 */
export const ElectricNode: React.FC<ElectricNodeProps> = ({ type, active, className }) => {

    // Global filter definition (rendered once per node, but functionally idempotent if ID matches)
    // Ideally this goes in layout, but for portability we keep it here.
    const filters = (
        <svg className="absolute w-0 h-0 pointer-events-none">
            <defs>
                <filter id="electric-turbulence">
                    <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves={2} result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
                </filter>
                <filter id="electric-glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
        </svg>
    );

    return (
        <div className={cn("relative flex items-center justify-center w-24 h-24 pointer-events-none", className)}>
            {filters}

            <AnimatePresence>
                {active && (
                    <>
                        {/* --- TYPE: SPARK (Analysis) --- */}
                        {type === "spark" && (
                            <motion.div
                                key="spark"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: [0.8, 1.2, 0.9, 1.1],
                                    opacity: 1,
                                    rotate: [0, 45, -45, 0]
                                }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{
                                    duration: 0.2,
                                    repeat: Infinity,
                                    repeatType: "mirror"
                                }}
                                className="absolute w-4 h-4 rounded-full bg-blue-400 shadow-[0_0_20px_#306EE8]"
                                style={{ filter: "url(#electric-turbulence)" }}
                            >
                                <div className="absolute inset-0 bg-white rounded-full blur-[1px]" />
                            </motion.div>
                        )}

                        {/* --- TYPE: ARC (Structure) --- */}
                        {type === "arc" && (
                            <motion.div
                                key="arc"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                className="absolute w-12 h-12 flex items-center justify-center"
                            >
                                {/* Rotating Ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute w-full h-full rounded-full border-2 border-blue-500/80 border-t-transparent shadow-[0_0_15px_#306EE8]"
                                />
                                {/* Counter-Rotating Inner Ring */}
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute w-8 h-8 rounded-full border border-white/50 border-b-transparent"
                                />
                                {/* Core */}
                                <div className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_white]" />
                            </motion.div>
                        )}

                        {/* --- TYPE: BURST (Delivery) --- */}
                        {type === "burst" && (
                            <motion.div
                                key="burst"
                                className="absolute flex items-center justify-center"
                            >
                                {/* Shockwave Ring */}
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0, borderWidth: "4px" }}
                                    animate={{
                                        scale: [1, 2.5],
                                        opacity: [1, 0],
                                        borderWidth: ["4px", "0px"]
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                                    className="absolute w-8 h-8 rounded-full border-[#8B5CF6] shadow-[0_0_30px_#8B5CF6]"
                                />
                                {/* Plasma Core */}
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_20px_#8B5CF6]"
                                />
                                {/* Spikes */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute w-16 h-1 bg-gradient-to-r from-transparent via-[#8B5CF6]/50 to-transparent rotate-45"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute w-16 h-1 bg-gradient-to-r from-transparent via-[#8B5CF6]/50 to-transparent -rotate-45"
                                />
                            </motion.div>
                        )}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
