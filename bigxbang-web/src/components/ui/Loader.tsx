"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import Asterisk from "@/components/ui/Asterisk";
import { cn } from "@/lib/utils";

const LOGS = [
    "> allumage_des_rétro-fusées...",
    "> cookies_mangés_par_erreur...",
    "> début de l'expérience"
];

interface LoaderProps {
    onComplete?: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
    const [progress, setProgress] = useState(0);
    const [currentLine, setCurrentLine] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isFinished, setIsFinished] = useState(false); // Finished loading, starting wait
    const [isFading, setIsFading] = useState(false); // Actually fading out
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef({ value: 0 });
    const ringRef = useRef<SVGCircleElement>(null);

    // Ring Configuration
    const RING_SIZE = 120;
    const STROKE_WIDTH = 3;
    const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    // Easter Egg Console Log
    useEffect(() => {
        console.clear();
        console.log(
            "%cHey you.\n%cWelcome to the source code, traveler.\nNo bugs here, just features in disguise.",
            "color: #306EE8; font-weight: bold; font-size: 16px; margin-bottom: 5px;",
            "color: #888; font-size: 12px;"
        );
    }, []);

    // 1. MASTER TIMELINE
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(progressRef.current, {
                value: 100,
                duration: 4.8, // Adjusted total duration
                ease: "power1.inOut",
                onUpdate: () => {
                    const currentVal = progressRef.current.value;
                    setProgress(currentVal);

                    // Sync logs with progress - WEIGHTED
                    // Log 0: 0-25%
                    // Log 1: 25-75% (Cookies gets 50% of the time)
                    // Log 2: 75-100%
                    let logIndex = 0;
                    if (currentVal > 25) logIndex = 1;
                    if (currentVal > 75) logIndex = 2;

                    setCurrentLine(prev => {
                        if (prev !== logIndex) return logIndex;
                        return prev;
                    });

                    if (ringRef.current) {
                        const offset = CIRCUMFERENCE - (currentVal / 100) * CIRCUMFERENCE;
                        ringRef.current.style.strokeDashoffset = `${offset}`;
                    }
                },
                onComplete: () => {
                    setIsFinished(true); // Show waiting dots

                    // WAIT phase - MINIMAL (0.2s)
                    setTimeout(() => {
                        setIsFading(true);
                        if (containerRef.current) {
                            gsap.to(containerRef.current, {
                                opacity: 0,
                                duration: 0.5,
                                ease: "power2.inOut",
                                onComplete: () => {
                                    if (onComplete) onComplete();
                                }
                            });
                        }
                    }, 200);
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, [onComplete, CIRCUMFERENCE]);

    // 2. LOGS CYCLING - Removed (synced with progress above)

    // 3. TYPING EFFECT (Regular Logs)
    useEffect(() => {
        if (isFinished) return; // Stop typing regular logs when finished

        const textToType = LOGS[currentLine];
        setCurrentText("");

        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex <= textToType.length) {
                setCurrentText(textToType.substring(0, charIndex));
                charIndex++;
            } else {
                clearInterval(typeInterval);
            }
        }, 30);

        return () => clearInterval(typeInterval);
    }, [currentLine, isFinished]);

    const isComplete = progress >= 99;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden font-space text-white"
        >
            {/* NOISE TEXTURE */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* 1. CENTER: ORBIT RING + ASTERISK */}
            <div className="relative mb-12 z-20" style={{ width: RING_SIZE, height: RING_SIZE }}>

                {/* Background Circle (Track) */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
                    <circle
                        cx={RING_SIZE / 2}
                        cy={RING_SIZE / 2}
                        r={RADIUS}
                        fill="transparent"
                        stroke="rgba(48, 110, 232, 0.15)"
                        strokeWidth={STROKE_WIDTH}
                    />
                </svg>

                {/* Progress Circle (Fill) */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
                    <circle
                        ref={ringRef}
                        cx={RING_SIZE / 2}
                        cy={RING_SIZE / 2}
                        r={RADIUS}
                        fill="transparent"
                        stroke="#306EE8"
                        strokeWidth={STROKE_WIDTH}
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={CIRCUMFERENCE} // Start at 0%
                        className="transition-shadow duration-300"
                        style={{ filter: isComplete ? 'drop-shadow(0 0 8px #306EE8)' : 'none' }}
                    />
                </svg>

                {/* Center Circle (Fill on complete) */}
                <div className={cn(
                    "absolute inset-[10%] rounded-full flex items-center justify-center transition-all duration-500 ease-out",
                    isComplete
                        ? "bg-[#306EE8] shadow-[0_0_60px_rgba(48,110,232,0.7)] scale-105"
                        : "bg-transparent"
                )}>
                    <Asterisk className={cn(
                        "transition-all duration-300",
                        isComplete ? "text-white w-12 h-12" : "text-white/70 w-10 h-10"
                    )} />
                </div>
            </div>

            {/* 2. LOGS - Compact & Centered (Fades out only when really done) */}
            <div className={cn(
                "flex flex-col items-center transition-opacity duration-300",
                isFading ? "opacity-0" : "opacity-100"
            )}>
                <div className="relative z-20 h-12 flex flex-col items-center justify-start text-center w-full max-w-md px-4">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs sm:text-sm text-gray-400 font-mono h-5">
                            {currentText}<span className="animate-pulse">_</span>
                        </span>
                    </div>
                </div>

                {/* Percentage - Hide when finished/waiting */}
                <div className={cn(
                    "mt-4 font-mono text-[#306EE8]/50 text-xs transition-opacity duration-300",
                    isFinished ? "opacity-0" : "opacity-100"
                )}>
                    {Math.round(progress)}%
                </div>
            </div>

        </div>
    );
}
