"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface SparkPointProps {
    isActive: boolean;
    className?: string;
}

export const SparkPoint = ({ isActive, className }: SparkPointProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        // Noise function for jitter
        const noise = (x: number, z: number) => {
            return Math.sin(x * 12.9898 + z * 78.233) * 43758.5453 - Math.floor(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453);
        };

        const render = () => {
            time += 1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (!isActive) return;

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const maxRadius = 14;

            // Draw Electric Burst
            ctx.beginPath();
            const segments = 12;
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                // Jitter for spark effect
                const jitter = (noise(i, time * 0.1) - 0.5) * 6;
                const r = maxRadius + jitter;

                const x = cx + Math.cos(theta) * r;
                const y = cy + Math.sin(theta) * r;

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();

            // Style: Bright Blue/White Spark
            ctx.strokeStyle = `rgba(180, 210, 255, ${0.6 + Math.random() * 0.4})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Core Glow
            ctx.shadowColor = "#306EE8";
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.fillStyle = "rgba(48, 110, 232, 0.2)";
            ctx.shadowBlur = 0;

            animationFrameId = requestAnimationFrame(render);
        };

        if (isActive) {
            render();
            // Pop effect on entry
            gsap.fromTo(canvas, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" });
        } else {
            // Fade out
            gsap.to(canvas, { scale: 0, opacity: 0, duration: 0.2 });
            cancelAnimationFrame(animationFrameId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isActive]);

    return (
        <div ref={containerRef} className={className}>
            {/* Base Dot (Always visible, inactive state) */}
            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-white/20 transition-all duration-300 ${isActive ? 'bg-white scale-0' : 'bg-transparent'}`} />

            {/* Active Spark Canvas */}
            <canvas
                ref={canvasRef}
                width={64}
                height={64}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            />
        </div>
    );
};
