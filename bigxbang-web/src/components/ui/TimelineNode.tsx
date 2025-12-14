"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface TimelineNodeProps {
    isActive: boolean;
    level: 1 | 2 | 3;
    className?: string;
}

export const TimelineNode = ({ isActive, level, className }: TimelineNodeProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasTriggered, setHasTriggered] = useState(false);

    useEffect(() => {
        if (isActive && !hasTriggered) {
            setHasTriggered(true);
            playEntryAnimation();
        } else if (!isActive && hasTriggered) {
            setHasTriggered(false); // Reset if user scrolls back up? User implied "s'allume au fur et à mesure", likely reset is okay.
        }
    }, [isActive]);

    // --- LEVEL 3: WEBGL SPARK LOGIC ---
    useEffect(() => {
        if (level !== 3) return; // Only for level 3

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number = 0;
        let time = 0;
        let isRunning = false;

        const noise = (x: number, z: number) => {
            return Math.sin(x * 12.9898 + z * 78.233) * 43758.5453 - Math.floor(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453);
        };

        const render = () => {
            time += 1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (!isActive) {
                isRunning = false;
                return;
            }

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const maxRadius = 16;

            ctx.beginPath();
            const segments = 12;
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                // High energy jitter
                const jitter = (noise(i, time * 0.15) - 0.5) * 8;
                const r = maxRadius + jitter;
                const x = cx + Math.cos(theta) * r;
                const y = cy + Math.sin(theta) * r;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();

            ctx.strokeStyle = `rgba(180, 220, 255, ${0.8 + Math.random() * 0.2})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Pop Flash
            if (time < 20) {
                ctx.fillStyle = `rgba(255, 255, 255, ${1 - time / 20})`;
                ctx.fill();
            }

            // AUTO-STOP after ~1.5s (90 frames)
            if (time > 90) {
                // Fade out before stopping
                const fadeOut = 1 - ((time - 60) / 30);
                if (fadeOut <= 0) {
                    isRunning = false;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    cancelAnimationFrame(animationFrameId);
                    return;
                }
                ctx.globalAlpha = fadeOut;
            }

            animationFrameId = requestAnimationFrame(render);
        };

        if (isActive) {
            isRunning = true;
            // Reset time if re-triggered
            time = 0;
            render();
            // Pop scale
            gsap.fromTo(canvas, { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(3)" });
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animationFrameId);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [isActive, level]);


    const playEntryAnimation = () => {
        // Common logic if needed
    };

    return (
        <div className={cn("relative flex items-center justify-center w-8 h-8", className)}>

            {/* BASE DOT (Always consistent DA: "le point qu'on atteint c'est toujours le même") */}
            {/* Inactive state: Hollow grey. Active state: Solid White + Glow. */}
            <div className={cn(
                "w-2.5 h-2.5 rounded-full border transition-all duration-500 z-10",
                isActive
                    ? "bg-white border-white shadow-[0_0_10px_rgba(48,110,232,0.8)] scale-110"
                    : "bg-[#0a0a0a] border-white/20"
            )} />

            {/* LEVEL 1: Sublte Glow (CSS) */}
            {level === 1 && isActive && (
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md animate-pulse-slow" />
            )}

            {/* LEVEL 2: Strong Pulse (CSS) */}
            {level === 2 && isActive && (
                <>
                    <div className="absolute inset-0 rounded-full border border-blue-400/50 animate-ping-slow opacity-0" />
                    <div className="absolute -inset-1 rounded-full bg-blue-500/20 blur-md" />
                </>
            )}

            {/* LEVEL 3: WebGL Spark */}
            {level === 3 && (
                <canvas
                    ref={canvasRef}
                    width={64}
                    height={64}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none scale-150"
                />
            )}
        </div>
    );
};
