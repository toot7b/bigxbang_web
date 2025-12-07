"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export const Ripple = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [grid, setGrid] = useState<{ rows: number; cols: number }>({ rows: 0, cols: 0 });
    const cellsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Calculate grid size based on container
    useEffect(() => {
        const calculateGrid = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.offsetWidth;
            const height = containerRef.current.offsetHeight;
            const size = 50; // Cell size px

            const cols = Math.ceil(width / size);
            const rows = Math.ceil(height / size);

            setGrid({ rows, cols });
        };

        calculateGrid();
        window.addEventListener("resize", calculateGrid);
        return () => window.removeEventListener("resize", calculateGrid);
    }, []);

    // Animation Logic
    const animateRipple = (index: number) => {
        if (!cellsRef.current[index]) return;

        // Simple scale/flash for now, could be expanded to true ripple BFS
        gsap.fromTo(cellsRef.current[index],
            { backgroundColor: "rgba(48, 110, 232, 0.4)" }, // Brand Blue hover
            { backgroundColor: "transparent", duration: 1, ease: "power1.out" }
        );
    };

    // Random sparkling for background texture
    useEffect(() => {
        if (cellsRef.current.length === 0) return;

        const interval = setInterval(() => {
            const randomIdx = Math.floor(Math.random() * cellsRef.current.length);
            const cell = cellsRef.current[randomIdx];
            if (cell) {
                gsap.to(cell, {
                    opacity: 0.3,
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1,
                    ease: "sine.inOut"
                });
            }
        }, 100); // Sparkle frequency

        return () => clearInterval(interval);
    }, [grid]);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
            <div
                className="grid w-full h-full"
                style={{
                    gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
                    gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
                }}
            >
                {Array.from({ length: grid.rows * grid.cols }).map((_, i) => (
                    <div
                        key={i}
                        ref={(el) => { if (el) cellsRef.current[i] = el; }}
                        className="border-[0.5px] border-white/5 hover:bg-[#306EE8]/30 transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => animateRipple(i)}
                    />
                ))}
            </div>
        </div>
    );
};
