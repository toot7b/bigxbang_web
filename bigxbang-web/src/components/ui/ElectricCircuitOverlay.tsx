"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

/**
 * ELECTRIC CIRCUIT OVERLAY (Canvas 2D - Lowered Position)
 * 
 * - Ported the "Canvas Electric System" engine from UnifiedMethodVisual.
 * - Draws jagged lightning lines (Blue).
 * - Draws data packets (White) traveling the lines.
 * - Connects Screen Edges -> Target Element.
 * - ADJUSTED: Circuits positioned LOWER to connect to the card area.
 */

interface ElectricCircuitOverlayProps {
    className?: string;
}

export const ElectricCircuitOverlay = ({ className }: ElectricCircuitOverlayProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // --- ENGINE ---

        // 1. CIRCUIT TRACE (Blue line - PCB style)
        const drawTrace = (p1: { x: number, y: number }, p2: { x: number, y: number }) => {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            // Glow
            ctx.shadowColor = "rgba(48, 110, 232, 0.6)";
            ctx.shadowBlur = 8;

            // More visible line
            ctx.strokeStyle = "rgba(48, 110, 232, 0.55)";
            ctx.lineWidth = 1.5;
            ctx.lineCap = "round";
            ctx.stroke();

            ctx.shadowBlur = 0;
        };

        // 2. DATA PULSE (Simple small dot traveling along the full path)
        const drawPulse = (path: { x: number, y: number }[], time: number, offset: number, duration: number = 5000) => {
            const cycle = (time + offset) % duration;
            const progress = cycle / duration;

            // Calculate total path length
            let totalLength = 0;
            for (let i = 0; i < path.length - 1; i++) {
                const dx = path[i + 1].x - path[i].x;
                const dy = path[i + 1].y - path[i].y;
                totalLength += Math.sqrt(dx * dx + dy * dy);
            }

            // Find position along path
            let targetDist = progress * totalLength;
            let x = path[0].x;
            let y = path[0].y;

            for (let i = 0; i < path.length - 1; i++) {
                const dx = path[i + 1].x - path[i].x;
                const dy = path[i + 1].y - path[i].y;
                const segLen = Math.sqrt(dx * dx + dy * dy);

                if (targetDist <= segLen) {
                    const t = targetDist / segLen;
                    x = path[i].x + dx * t;
                    y = path[i].y + dy * t;
                    break;
                }
                targetDist -= segLen;
            }

            // Small subtle dot
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
        };

        // 3. NODE (Subtle corner point - only at connection to card)
        const drawNode = (pt: { x: number, y: number }) => {
            // Outer ring - very subtle
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(48, 110, 232, 0.3)";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Inner dot
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(48, 110, 232, 0.5)";
            ctx.fill();
        };

        // --- LAYOUT LOGIC ---

        const render = () => {
            // Use parent container dimensions, not window
            const parent = canvas.parentElement;
            if (!parent) return;

            const rect = parent.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }

            ctx.clearRect(0, 0, width, height);
            const realTime = performance.now();

            // Card bounds - traces end closer to center
            const cardCenterY = height * 0.58;
            const cardHeight = height * 0.38;
            const cardTop = cardCenterY - cardHeight / 2;
            const cardBottom = cardCenterY + cardHeight / 2;
            const cardLeft = width * 0.22;
            const cardRight = width * 0.78;

            // LEFT traces - asymmetric positions
            const leftTraces = [
                { startY: height * 0.32, endY: cardTop + cardHeight * 0.15, elbowRatio: 0.25 },
                { startY: height * 0.58, endY: cardTop + cardHeight * 0.55, elbowRatio: 0.40 },
                { startY: height * 0.88, endY: cardBottom - cardHeight * 0.05, elbowRatio: 0.55 }
            ];

            // RIGHT traces - different positions for asymmetry
            const rightTraces = [
                { startY: height * 0.38, endY: cardTop + cardHeight * 0.08, elbowRatio: 0.35 },
                { startY: height * 0.48, endY: cardTop + cardHeight * 0.45, elbowRatio: 0.50 },
                { startY: height * 0.78, endY: cardBottom - cardHeight * 0.12, elbowRatio: 0.30 }
            ];

            // RENDER LEFT TRACES
            leftTraces.forEach((trace, i) => {
                const pStart = { x: 0, y: trace.startY };
                const pEnd = { x: cardLeft, y: trace.endY };

                const midX = cardLeft * trace.elbowRatio;

                const pElbow1 = { x: midX, y: trace.startY };
                const pElbow2 = { x: midX, y: trace.endY };

                // Draw trace segments
                drawTrace(pStart, pElbow1);
                drawTrace(pElbow1, pElbow2);
                drawTrace(pElbow2, pEnd);

                // Only one node at the card connection
                drawNode(pEnd);

                // One pulse per full path (slower: 12s)
                const path = [pStart, pElbow1, pElbow2, pEnd];
                drawPulse(path, realTime, i * 3000, 12000);
            });

            // RENDER RIGHT TRACES
            rightTraces.forEach((trace, i) => {
                const pStart = { x: width, y: trace.startY };
                const pEnd = { x: cardRight, y: trace.endY };

                const space = width - cardRight;
                const midX = width - (space * trace.elbowRatio);

                const pElbow1 = { x: midX, y: trace.startY };
                const pElbow2 = { x: midX, y: trace.endY };

                // Draw trace segments
                drawTrace(pStart, pElbow1);
                drawTrace(pElbow1, pElbow2);
                drawTrace(pElbow2, pEnd);

                // Only one node at the card connection
                drawNode(pEnd);

                // One pulse per full path (slower: 12s)
                const path = [pStart, pElbow1, pElbow2, pEnd];
                drawPulse(path, realTime, i * 3000 + 1500, 12000);
            });
        };

        gsap.ticker.add(render);
        return () => {
            gsap.ticker.remove(render);
        };

    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 pointer-events-none ${className}`}
        />
    );
};
