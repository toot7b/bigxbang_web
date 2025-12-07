"use client";
import React, { useRef, useEffect, useMemo } from "react";
import Asterisk from "./Asterisk";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function ArchFocus() {
    const containerRef = useRef<HTMLDivElement>(null);
    const asteriskRef = useRef<HTMLDivElement>(null);
    const pulseRef = useRef<HTMLDivElement>(null); // New Ref for Pulse
    const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
    const particleVisualsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Define key points along the Asterisk outline (extracted from SVG path)
    const asteriskOutlinePoints = useMemo(() => {
        const scale = 192 / 50;
        const centerOffset = -192 / 2;

        const branch1 = [
            { x: 26.88, y: 50.03 },
            { x: 24.38, y: 31.47 },
            { x: 31.42, y: 24.94 },
            { x: 49.74, y: 28.81 },
            { x: 47.09, y: 37.41 },
            { x: 34.00, y: 31.69 },
            { x: 30.92, y: 34.55 },
            { x: 35.65, y: 48.02 }
        ];

        const branch2 = [
            { x: 45.94, y: 11.19 },
            { x: 31.08, y: 22.66 },
            { x: 21.84, y: 19.77 },
            { x: 16.06, y: 1.94 },
            { x: 24.77, y: 0.00 },
            { x: 26.44, y: 14.14 },
            { x: 30.50, y: 15.43 },
            { x: 39.74, y: 4.66 }
        ];

        const branch3 = [
            { x: 2.58, y: 14.46 },
            { x: 19.94, y: 21.54 },
            { x: 22.14, y: 30.97 },
            { x: 9.59, y: 44.94 },
            { x: 3.54, y: 38.27 },
            { x: 14.96, y: 29.85 },
            { x: 13.98, y: 25.71 },
            { x: 0.00, y: 22.00 }
        ];

        const allPoints = [...branch1, ...branch2, ...branch3];

        return allPoints.map(p => ({
            x: (p.x * scale) + centerOffset,
            y: (p.y * scale) + centerOffset
        }));
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top center",
                    end: "center center",
                    scrub: 0.8,
                }
            });

            // 1. Initial State: Asterisk hidden
            gsap.set(asteriskRef.current, {
                scale: 0.8,
                opacity: 0
            });

            // Pulse Animation Initial State
            // Set base filter (soft glow) on the inner wrapper
            gsap.set(pulseRef.current, {
                filter: "drop-shadow(0 0 15px rgba(255,255,255,0.3))",
                scale: 1
            });

            // Pulse Loop (Continuous Background Animation)
            // It will only be visible when the parent (asteriskRef) fades in
            gsap.to(pulseRef.current, {
                scale: 1.05, // Gentle breathe
                filter: "drop-shadow(0 0 25px rgba(255,255,255,0.6))", // Stronger glow
                duration: 4, // SLOWER (was 2)
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            // 2. Set up particles
            if (particlesRef.current.length > 0) {
                // Identify which particles will form the shape (first 24)
                const morphingCount = Math.min(asteriskOutlinePoints.length, particlesRef.current.length);

                particlesRef.current.forEach((p, i) => {
                    if (p) {
                        const angle = Math.random() * Math.PI * 2;
                        const radius = Math.random() * 350;
                        const randomX = Math.cos(angle) * radius;
                        const randomY = Math.sin(angle) * radius;
                        const rotationDeg = angle * (180 / Math.PI);
                        const opacity = 0.3 + Math.random() * 0.5;

                        gsap.set(p, {
                            x: randomX,
                            y: randomY,
                            rotate: rotationDeg,
                            opacity: opacity
                        });
                    }

                    // Floating animation
                    const visual = particleVisualsRef.current[i];
                    if (visual) {
                        gsap.set(visual, { width: 3, height: 2 });

                        gsap.to(visual, {
                            x: (Math.random() - 0.5) * 50,
                            y: (Math.random() - 0.5) * 50,
                            duration: 1.5 + Math.random() * 2,
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut"
                        });
                    }
                });

                // Phase 1: All particles converge 
                tl.to(particlesRef.current, {
                    x: (i) => {
                        if (i < morphingCount) return asteriskOutlinePoints[i].x;
                        return 0;
                    },
                    y: (i) => {
                        if (i < morphingCount) return asteriskOutlinePoints[i].y;
                        return 0;
                    },
                    scale: 1,
                    rotate: 0,
                    duration: 1.5,
                    ease: "power2.inOut",
                    stagger: {
                        amount: 0.3,
                        from: "random"
                    }
                }, 0);

                // Phase 2: Regular particles fade out
                tl.to(particlesRef.current.slice(morphingCount), {
                    opacity: 0,
                    scale: 0.1,
                    duration: 0.8,
                    ease: "power2.in"
                }, 0.6);

                // Morphing particles brighten
                tl.to(particlesRef.current.slice(0, morphingCount), {
                    opacity: 1,
                    scale: 1.2,
                    duration: 0.5,
                    ease: "power2.out"
                }, 0.8);
            }

            // Phase 3: Solid Asterisk fades in 
            tl.to(asteriskRef.current, {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
            }, 1.2);

            // Phase 4: Morphing particles fade out 
            tl.to(particlesRef.current.slice(0, asteriskOutlinePoints.length), {
                opacity: 0,
                duration: 0.4,
                ease: "power1.in"
            }, 1.5);

        }, containerRef);

        return () => ctx.revert();
    }, [asteriskOutlinePoints]);

    const particles = useMemo(() => {
        const colors = [
            "bg-white/80",
            "bg-sky-200/70",
            "bg-purple-200/70",
            "bg-indigo-200/70",
            "bg-slate-200/50"
        ];

        return Array.from({ length: 600 }).map((_, i) => ({
            id: i,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));
    }, []);

    return (
        <div ref={containerRef} className="h-[30rem] w-full rounded-md flex items-center justify-center relative">

            {/* Particles Container */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {particles.map((p, i) => (
                    <div
                        key={p.id}
                        ref={(el) => { if (el) particlesRef.current[i] = el; }}
                        className="absolute flex items-center justify-center"
                    >
                        <div
                            ref={(el) => { if (el) particleVisualsRef.current[i] = el; }}
                            className={`${p.color} rounded-full`}
                        />
                    </div>
                ))}
            </div>

            {/* Central Asterisk (Target) */}
            <div className="relative z-10 flex flex-col items-center justify-center">
                {/* Reveal Wrapper (Hidden initially) */}
                <div ref={asteriskRef} className="text-white">
                    {/* Pulse Wrapper (Always breathing) */}
                    <div ref={pulseRef} className="flex items-center justify-center">
                        {/* Asterisk SVG (No shadow class here, handled by parent) */}
                        <Asterisk className="w-48 h-48 md:w-48 md:h-48 text-white" />
                    </div>
                </div>
            </div>

        </div>
    );
};
