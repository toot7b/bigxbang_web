"use client";
import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import Asterisk from "@/components/ui/Asterisk";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const ExecutionVisual = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const singularityRef = useRef<HTMLDivElement>(null);
    const shockwaveRef = useRef<HTMLDivElement>(null);
    const electricRef = useRef<SVGSVGElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);
    const asteriskWrapperRef = useRef<HTMLDivElement>(null);

    // Physics Refs
    const INITIAL_ANGLE = 60; // 3-fold symmetry correction (Vertex Up vs Down)
    const speedRef = useRef(0);
    const rotationRef = useRef(INITIAL_ANGLE);
    const isHoveringRef = useRef(false);
    const hasStartedRef = useRef(false); // Gate for initial rotation

    // UI State
    const [isHovering, setIsHovering] = useState(false);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%", // Wait until it's more visible (closer to center)
                    toggleActions: "play none none reverse"
                },
                onComplete: () => {
                    // Start rotation ONLY when animation finishes (User: "quand l'icône arrivait en bas")
                    hasStartedRef.current = true;
                    speedRef.current = 0.1;
                },
                onReverseComplete: () => {
                    // Stop rotation if we scroll back up
                    hasStartedRef.current = false;
                    speedRef.current = 0;
                    rotationRef.current = INITIAL_ANGLE;
                    if (asteriskWrapperRef.current) {
                        asteriskWrapperRef.current.style.transform = `rotate(${INITIAL_ANGLE}deg)`;
                    }
                }
            });

            // 0. INITIAL STATE (Hidden/Condensed)
            tl.set([shockwaveRef.current, electricRef.current, iconRef.current, particlesRef.current], {
                scale: 0,
                opacity: 0
            });
            tl.set(singularityRef.current, { scale: 0, opacity: 1 });

            // 1. SINGULARITY (The Spark) - Charge up
            tl.to(singularityRef.current, {
                scale: 1.5,
                duration: 0.6,
                ease: "power2.in"
            })

                // 2. THE BIG BANG (Screen Flash + Expansion)
                .to(singularityRef.current, {
                    scale: 3,
                    opacity: 0,
                    duration: 0.1,
                    ease: "power1.out"
                })
                // OVERSHOOT: Expand past the border (Scale 1.1)
                .to([electricRef.current, shockwaveRef.current], {
                    scale: 1.1,
                    opacity: 1,
                    duration: 0.3,
                    ease: "power4.out",
                    stagger: 0.05
                }, "-=0.1")

                // 3. THE SNAP BACK (Return to Base)
                .to([electricRef.current, shockwaveRef.current], {
                    scale: 1,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)" // Wiggle back to 1
                })

                // 4. THE ICON REVEAL (Forged during snap)
                .to(iconRef.current, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.4,
                    ease: "back.out(2)"
                }, "-=0.6") // Inside the snap

                // 5. DEBRIS (Particles Burst)
                .to(particlesRef.current, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out"
                }, "-=0.5");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        let animationFrameId: number;

        const loop = () => {
            const MAX_SPEED = 60; // TURBO MODE
            const ACCEL = 1.5;    // Fast response
            const FRICTION = 0.96; // How slowly it coasts down

            if (isHoveringRef.current) {
                // Accelerate towards max speed
                if (speedRef.current < MAX_SPEED) {
                    speedRef.current += ACCEL;
                }
            } else {
                // Decelerate (Coast)
                speedRef.current *= FRICTION;
            }

            // Apply minimal drift ONLY if started
            if (hasStartedRef.current && Math.abs(speedRef.current) < 0.1 && !isHoveringRef.current) {
                speedRef.current = 0.1;
            }

            // Lock to 0 if not started and not hovering
            if (!hasStartedRef.current && !isHoveringRef.current) {
                speedRef.current = 0;
                rotationRef.current = INITIAL_ANGLE;
            } else {
                rotationRef.current += speedRef.current;
            }

            // Apply transform
            if (asteriskWrapperRef.current) {
                asteriskWrapperRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
            }

            animationFrameId = requestAnimationFrame(loop);
        };

        loop();
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleMouseEnter = () => {
        isHoveringRef.current = true;
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        isHoveringRef.current = false;
        setIsHovering(false);
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-square max-w-[400px] flex items-center justify-center p-4 pointer-events-none"
        // style={{ transform: 'rotate(-0.3deg)' }} // REMOVED: Causes misalignment with Step 2
        >
            {/* 0. SINGULARITY (The Origin Spark) */}
            <div ref={singularityRef} className="absolute w-4 h-4 bg-white rounded-full blur-[2px] z-50 pointer-events-none opacity-0 scale-0" />

            {/* 0. AMBIENT SHOCKWAVES (Pulsing Energy Rings) */}
            <div ref={shockwaveRef} className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 scale-0">
                <div className="absolute w-[220px] h-[220px] rounded-[44px] border border-[#306EE8] opacity-0 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <div className={cn("absolute w-[220px] h-[220px] rounded-[44px] border border-white opacity-0 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1.5s] transition-opacity duration-700", isHovering ? "opacity-100" : "opacity-0")} />
            </div>

            {/* 1. LAYER: THE ELECTRIC ENERGY (SVG STROKE) */}
            {/* Viewport 500px for MAXIMUM overflowing spill */}
            <svg ref={electricRef} className="absolute w-[500px] h-[500px] overflow-visible z-20 pointer-events-none opacity-0 scale-0" style={{ mixBlendMode: 'plus-lighter' }}>
                <defs>
                    {/* CORE BEAM FILTER: High detail, sharp */}
                    <filter id="core-beam" x="-200%" y="-200%" width="500%" height="500%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" seed="0">
                            <animate attributeName="seed" values="0;100" dur="2s" repeatCount="indefinite" />
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" />
                        <feGaussianBlur stdDeviation="0.5" />
                    </filter>

                    {/* WIDE SPILL FILTER: The "Atmosphere" */}
                    <filter id="wide-spill" x="-200%" y="-200%" width="500%" height="500%">
                        {/* Low frequency for big waves */}
                        <feTurbulence type="turbulence" baseFrequency="0.6" numOctaves="4" seed="5">
                            <animate attributeName="baseFrequency" values="0.6;0.5;0.6" dur="0.2s" repeatCount="indefinite" />
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" scale="60" /> {/* Huge displacement */}
                        <feGaussianBlur stdDeviation="1.5" />
                    </filter>

                    {/* Hot Gradient */}
                    <linearGradient id="hot-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#306EE8" />
                        <stop offset="100%" stopColor="#fff" stopOpacity="0.8" />
                    </linearGradient>
                </defs>

                {/* LAYER A: The Wide Atmospheric Plasma (Faint, HUGE) */}
                <rect
                    x="140" y="140"
                    width="220" height="220"
                    rx="44" ry="44"
                    fill="none"
                    stroke="#306EE8"
                    strokeWidth="2"
                    strokeOpacity="0.6"
                    filter="url(#wide-spill)"
                />

                {/* LAYER B: The Core Arcs (Sharp, Hot) */}
                <rect
                    x="140" y="140"
                    width="220" height="220"
                    rx="44" ry="44"
                    fill="none"
                    stroke="url(#hot-gradient)"
                    strokeWidth="3"
                    filter="url(#core-beam)"
                />
            </svg>

            {/* 2. LAYER: FLYING SPARKS (Particles Ejected Outward) */}
            <div ref={particlesRef} className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 scale-0">
                {/* 
                    BASE LAYER: ALWAYS VISIBLE (Idle Power)
                    Just the heavy chunks to show it's "alive"
                 */}
                <div className="absolute w-3.5 h-3.5 bg-white/90 rounded-full animate-[eject_2s_ease-out_infinite]" style={{ '--tx': '-180px', '--ty': '-180px' } as React.CSSProperties} />
                <div className="absolute w-4 h-4 bg-[#306EE8] rounded-full animate-[eject_3s_ease-out_infinite_0.2s]" style={{ '--tx': '200px', '--ty': '100px' } as React.CSSProperties} />
                <div className="absolute w-3 h-3 bg-blue-300 rounded-full animate-[eject_2.5s_ease-out_infinite_1.1s]" style={{ '--tx': '-100px', '--ty': '220px' } as React.CSSProperties} />

                {/* 
                    TURBO LAYER: ON HOVER ONLY (Full Chaos) 
                    Fades in when engine revs up
                 */}
                <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-500", isHovering ? "opacity-100" : "opacity-0")}>
                    {/* LARGE FRAGMENTS */}
                    <div className="absolute w-2.5 h-2.5 bg-white rounded-full animate-[eject_1.8s_ease-out_infinite_0.5s]" style={{ '--tx': '160px', '--ty': '-140px' } as React.CSSProperties} />
                    <div className="absolute w-3 h-3 bg-[#5B8DEF] rounded-full animate-[eject_2.2s_ease-out_infinite_0.8s]" style={{ '--tx': '-200px', '--ty': '50px' } as React.CSSProperties} />
                    <div className="absolute w-2.5 h-2.5 bg-white/90 rounded-full animate-[eject_2s_ease-out_infinite_1.5s]" style={{ '--tx': '80px', '--ty': '-200px' } as React.CSSProperties} />
                    <div className="absolute w-3 h-3 bg-blue-400 rounded-full animate-[eject_3s_ease-out_infinite_0.1s]" style={{ '--tx': '120px', '--ty': '180px' } as React.CSSProperties} />

                    {/* MEDIUM SPARKS (Crisp) */}
                    <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-[eject_1.5s_ease-out_infinite_0.3s]" style={{ '--tx': '-120px', '--ty': '-220px' } as React.CSSProperties} />
                    <div className="absolute w-2 h-2 bg-white rounded-full animate-[eject_1.2s_ease-out_infinite_0.7s]" style={{ '--tx': '220px', '--ty': '-80px' } as React.CSSProperties} />
                    <div className="absolute w-2.5 h-2.5 bg-blue-200 rounded-full animate-[eject_1.6s_ease-out_infinite_1.2s]" style={{ '--tx': '-140px', '--ty': '160px' } as React.CSSProperties} />
                    <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-[eject_1.4s_ease-out_infinite_1.8s]" style={{ '--tx': '60px', '--ty': '240px' } as React.CSSProperties} />

                    {/* EXTRA CHAOS */}
                    <div className="absolute w-3.5 h-3.5 bg-white/80 rounded-full animate-[eject_2.6s_ease-out_infinite_0.4s]" style={{ '--tx': '-240px', '--ty': '-40px' } as React.CSSProperties} />
                    <div className="absolute w-2.5 h-2.5 bg-[#306EE8] rounded-full animate-[eject_2.1s_ease-out_infinite_1.3s]" style={{ '--tx': '240px', '--ty': '40px' } as React.CSSProperties} />
                </div>
            </div>

            {/* 3. LAYER: STABLE BLUR GLOW (The Container) */}
            <div className="absolute w-[220px] h-[220px] bg-[#306EE8] rounded-[44px] blur-[80px] opacity-30 z-0 animate-pulse"></div>

            {/* 4. MAIN APP ICON (The Solid Box) */}
            {/* Matches the SVG dimensions (220x220) */}
            <div
                ref={iconRef}
                className="relative w-[220px] h-[220px] bg-[#050505] rounded-[44px] z-30 flex items-center justify-center overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(48,110,232,0.3)] cursor-pointer pointer-events-auto opacity-0 scale-0"
                onMouseEnter={() => (isHoveringRef.current = true)}
                onMouseLeave={() => (isHoveringRef.current = false)}
            >
                {/* Internal sheen - Vertical to prevent tilt illusion */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black pointer-events-none" />

                {/* Rotating Wrapper for Asterisk */}
                <div ref={asteriskWrapperRef} className="z-40 relative flex items-center justify-center" style={{ transform: `rotate(${INITIAL_ANGLE}deg)` }}>
                    <Asterisk className="w-28 h-28 text-white drop-shadow-[0_0_25px_rgba(48,110,232,1)]" />
                </div>
            </div>

            {/* Grounding Shadow */}
            <div className="absolute bottom-[-20px] w-[180px] h-[25px] bg-[#306EE8]/30 blur-[20px] rounded-[50%]" />

            {/* CSS ANIMATIONS - CLEANED */}
            {/* No custom keyframes needed for the clean version now */}
            <style jsx>{`
                @keyframes lock-in {
                    0%, 100% { transform: scale(1.1); opacity: 0.5; } /* Loose/Drifting */
                    45% { transform: scale(1.1); opacity: 0.5; }
                    50% { transform: scale(1.0); opacity: 1; filter: drop-shadow(0 0 10px white); } /* SNAP TIGHT */
                    55% { transform: scale(1.1); opacity: 0.5; }
                }
                @keyframes snap-in {
                    0% { transform: scale(1.5); opacity: 0; }
                    40% { opacity: 0.5; }
                    50% { transform: scale(1); opacity: 1; border-width: 2px; } /* Hit center */
                    55% { transform: scale(0.9); opacity: 0; } /* Vanish */
                    100% { opacity: 0; }
                }
                @keyframes scan-up {
                    0% { transform: translateY(100%); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(-100%); opacity: 0; }
                }
                @keyframes eject {
                    0% { transform: translate(0, 0) scale(1); opacity: 1; }
                    100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
                }
            `}</style>

        </div>
    );
};
