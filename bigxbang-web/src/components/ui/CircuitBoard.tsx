"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

interface CircuitBoardProps {
    cardRef?: React.RefObject<HTMLDivElement | null>;
    className?: string;
}

/**
 * CIRCUIT BOARD BACKGROUND
 *
 * PCB-style traces that converge toward the ServiceCard.
 * Traces come from the edges and "plug in" to the browser window.
 * Animated pulses travel along the traces.
 */
export const CircuitBoard: React.FC<CircuitBoardProps> = ({ className }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    // Define the circuit traces - paths that go from edges toward center
    // Each trace: start from edge, make 90° turns, end near center
    const traces = [
        // LEFT SIDE TRACES
        {
            id: "trace-l1",
            path: "M 0 20 L 15 20 L 15 35 L 30 35",
            delay: 0,
        },
        {
            id: "trace-l2",
            path: "M 0 40 L 10 40 L 10 50 L 25 50 L 25 45 L 32 45",
            delay: 0.3,
        },
        {
            id: "trace-l3",
            path: "M 0 60 L 20 60 L 20 55 L 33 55",
            delay: 0.6,
        },
        {
            id: "trace-l4",
            path: "M 0 75 L 12 75 L 12 65 L 31 65",
            delay: 0.9,
        },
        // RIGHT SIDE TRACES
        {
            id: "trace-r1",
            path: "M 100 25 L 85 25 L 85 38 L 70 38",
            delay: 0.15,
        },
        {
            id: "trace-r2",
            path: "M 100 45 L 90 45 L 90 48 L 75 48 L 75 44 L 68 44",
            delay: 0.45,
        },
        {
            id: "trace-r3",
            path: "M 100 65 L 80 65 L 80 58 L 67 58",
            delay: 0.75,
        },
        {
            id: "trace-r4",
            path: "M 100 80 L 88 80 L 88 68 L 69 68",
            delay: 1.05,
        },
        // TOP TRACES
        {
            id: "trace-t1",
            path: "M 35 0 L 35 12 L 40 12 L 40 28",
            delay: 0.2,
        },
        {
            id: "trace-t2",
            path: "M 55 0 L 55 8 L 50 8 L 50 26",
            delay: 0.5,
        },
        {
            id: "trace-t3",
            path: "M 65 0 L 65 15 L 60 15 L 60 27",
            delay: 0.8,
        },
        // BOTTOM TRACES
        {
            id: "trace-b1",
            path: "M 40 100 L 40 85 L 45 85 L 45 75",
            delay: 0.25,
        },
        {
            id: "trace-b2",
            path: "M 60 100 L 60 88 L 55 88 L 55 74",
            delay: 0.55,
        },
    ];

    // Vias (connection points) - placed at trace endpoints and intersections
    const vias = [
        // Left connection points
        { cx: 30, cy: 35, size: 1.5 },
        { cx: 32, cy: 45, size: 1.2 },
        { cx: 33, cy: 55, size: 1.5 },
        { cx: 31, cy: 65, size: 1.2 },
        // Right connection points
        { cx: 70, cy: 38, size: 1.5 },
        { cx: 68, cy: 44, size: 1.2 },
        { cx: 67, cy: 58, size: 1.5 },
        { cx: 69, cy: 68, size: 1.2 },
        // Top connection points
        { cx: 40, cy: 28, size: 1.3 },
        { cx: 50, cy: 26, size: 1.5 },
        { cx: 60, cy: 27, size: 1.3 },
        // Bottom connection points
        { cx: 45, cy: 75, size: 1.3 },
        { cx: 55, cy: 74, size: 1.5 },
        // Corner vias (decorative)
        { cx: 15, cy: 20, size: 0.8 },
        { cx: 15, cy: 35, size: 0.8 },
        { cx: 10, cy: 40, size: 0.8 },
        { cx: 10, cy: 50, size: 0.8 },
        { cx: 25, cy: 50, size: 0.8 },
        { cx: 20, cy: 60, size: 0.8 },
        { cx: 12, cy: 75, size: 0.8 },
        { cx: 85, cy: 25, size: 0.8 },
        { cx: 85, cy: 38, size: 0.8 },
        { cx: 90, cy: 45, size: 0.8 },
        { cx: 75, cy: 48, size: 0.8 },
        { cx: 80, cy: 65, size: 0.8 },
        { cx: 88, cy: 80, size: 0.8 },
        { cx: 35, cy: 12, size: 0.8 },
        { cx: 55, cy: 8, size: 0.8 },
        { cx: 65, cy: 15, size: 0.8 },
        { cx: 40, cy: 85, size: 0.8 },
        { cx: 60, cy: 88, size: 0.8 },
    ];

    useEffect(() => {
        if (!svgRef.current) return;

        const ctx = gsap.context(() => {
            // Animate each trace's stroke
            traces.forEach((trace) => {
                const path = svgRef.current?.querySelector(`#${trace.id}`) as SVGPathElement;
                if (!path) return;

                const length = path.getTotalLength();

                // Set initial state
                gsap.set(path, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                });

                // Animate the trace drawing
                gsap.to(path, {
                    strokeDashoffset: 0,
                    duration: 1.5,
                    delay: trace.delay,
                    ease: "power2.out",
                });

                // Pulse animation along the path
                const pulse = svgRef.current?.querySelector(`#pulse-${trace.id}`) as SVGCircleElement;
                if (pulse) {
                    gsap.to(pulse, {
                        motionPath: {
                            path: path,
                            align: path,
                            alignOrigin: [0.5, 0.5],
                        },
                        duration: 2 + Math.random() * 1.5,
                        delay: trace.delay + 1.5,
                        repeat: -1,
                        ease: "none",
                    });
                }
            });

            // Vias glow animation
            vias.forEach((_, i) => {
                const viaEl = svgRef.current?.querySelector(`#via-${i}`) as SVGCircleElement;
                if (!viaEl) return;

                gsap.to(viaEl, {
                    opacity: 0.4 + Math.random() * 0.4,
                    duration: 1 + Math.random() * 2,
                    repeat: -1,
                    yoyo: true,
                    delay: Math.random() * 2,
                    ease: "sine.inOut",
                });
            });

        }, svgRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
            <svg
                ref={svgRef}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
                style={{ opacity: 0.6 }}
            >
                <defs>
                    {/* Glow filter for traces */}
                    <filter id="trace-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="0.3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Strong glow for pulses */}
                    <filter id="pulse-glow" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Via glow */}
                    <filter id="via-glow" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="0.4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Gradient for traces */}
                    <linearGradient id="trace-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#306EE8" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#306EE8" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#306EE8" stopOpacity="0.3" />
                    </linearGradient>
                </defs>

                {/* TRACES */}
                <g className="traces">
                    {traces.map((trace) => (
                        <path
                            key={trace.id}
                            id={trace.id}
                            d={trace.path}
                            fill="none"
                            stroke="#306EE8"
                            strokeWidth="0.15"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#trace-glow)"
                            opacity="0.7"
                        />
                    ))}
                </g>

                {/* VIAS (Connection Points) */}
                <g className="vias">
                    {vias.map((via, i) => (
                        <g key={i}>
                            {/* Outer ring */}
                            <circle
                                cx={via.cx}
                                cy={via.cy}
                                r={via.size}
                                fill="none"
                                stroke="#306EE8"
                                strokeWidth="0.1"
                                opacity="0.5"
                            />
                            {/* Inner dot */}
                            <circle
                                id={`via-${i}`}
                                cx={via.cx}
                                cy={via.cy}
                                r={via.size * 0.5}
                                fill="#306EE8"
                                filter="url(#via-glow)"
                                opacity="0.6"
                            />
                        </g>
                    ))}
                </g>

                {/* PULSES (Animated dots traveling along traces) */}
                <g className="pulses">
                    {traces.map((trace) => (
                        <circle
                            key={`pulse-${trace.id}`}
                            id={`pulse-${trace.id}`}
                            r="0.4"
                            fill="#ffffff"
                            filter="url(#pulse-glow)"
                            opacity="0.9"
                        />
                    ))}
                </g>
            </svg>
        </div>
    );
};
