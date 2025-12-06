"use client";

import React, { useEffect, useRef } from "react";
import Asterisk from "@/components/ui/Asterisk";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export const Radar = () => {
    const scannerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Scanner Rotation: Continuous smooth loop
            // Use local timeline to prevent sync issues
            const scanner = scannerRef.current;
            const tl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });

            tl.to(scanner, {
                rotation: 360,
                duration: 8.0, // Slower (was 6.0)
                ease: "none"
            });

            // 2. Stars & Ripples: Independent Loops
            // Cycle Duration = 8s.
            // The "Phosphor" effect needs a specific feel:
            // 1. Flash (0.05s) - Instant hit
            // 2. Stable (0.1s) - Persistence
            // 3. Decay (1.5s) - Fading out + BLUR

            // 3. Decay (1.5s) - Fading out + BLUR

            const totalAnimDuration = 1.65;
            const cycleDuration = 8.0; // Slower rotation (was 6.0)
            const repeatDelay = cycleDuration - totalAnimDuration;

            // Helper to animate items (Star + Ripple)
            // Removed "Flash" selector - too aggressive/cheap.
            const animateTarget = (starSelector: string, rippleSelector: string, startDelay: number) => {
                // Star Timeline (Phosphor Decay)
                const sl = gsap.timeline({
                    repeat: -1,
                    repeatDelay: repeatDelay,
                    delay: startDelay
                });

                // 1. The HIT (Clean Reveal)
                // Instant appear white, then decay.
                // Fix: Start from opacity 0 (not 0.2) so they are completely invisible before the first hit.
                sl.fromTo(starSelector,
                    { opacity: 0, scale: 0.8, filter: "blur(4px)", color: "#306EE8" }, // Start invisible
                    { opacity: 1, scale: 1, filter: "blur(0px)", color: "#FFFFFF", duration: 0.1, ease: "power2.out" } // Snap to bright white
                );

                // 2. The DECAY (Cool down)
                sl.to(starSelector,
                    {
                        opacity: 0,
                        scale: 0.9,
                        filter: "blur(2px)",
                        color: "#306EE8", // Return to blue
                        duration: 1.5,
                        ease: "power2.in"
                    },
                    ">0.1" // Hold white briefly
                );

                // Ripple Timeline (Subtle Echo)
                // Fix: Start from opacity 0 to avoid "ghost circles" on first pass.
                // It will only become visible (to 0.4) momentarily as it expands.
                const rippleDuration = 1.5;
                const rippleRepeatDelay = cycleDuration - rippleDuration;

                const rl = gsap.timeline({
                    repeat: -1,
                    repeatDelay: rippleRepeatDelay,
                    delay: startDelay
                });

                // Animate from invisible to visible echo
                rl.fromTo(rippleSelector,
                    { opacity: 0, scale: 0.5, borderColor: "rgba(255,255,255,0.4)", borderWidth: "1px" }, // Start invisible
                    {
                        keyframes: [
                            { opacity: 0.4, duration: 0.1 }, // Quickly flash to visible
                            { opacity: 0, scale: 1.8, duration: 1.4, ease: "expo.out" } // Expand and fade
                        ]
                    }
                );
            };

            // Calculate precise hit times based on angles (0° = Right/3 o'clock, CW)
            // Cycle = 8s (Slower).

            // 1. Star A (Right-Bottom): ~30° -> (30/360)*8 = 0.66s
            animateTarget(".star-1", ".ripple-1", 0.66);

            // 2. Star B (Bottom): ~90° -> (90/360)*8 = 2.0s
            animateTarget(".star-2", ".ripple-2", 2.0);

            // 3. Star C (Bottom-Left): ~150° -> (150/360)*8 = 3.33s
            animateTarget(".star-3", ".ripple-3", 3.33);

            // 4. Star D (Left-Top): ~210° -> (210/360)*8 = 4.66s
            animateTarget(".star-4", ".ripple-4", 4.66);

            // 5. Star E (Top): ~270° -> (270/360)*8 = 6.0s
            animateTarget(".star-5", ".ripple-5", 6.0);

            // 6. Star F (Top-Right): ~330° -> (330/360)*8 = 7.33s
            animateTarget(".star-6", ".ripple-6", 7.33);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Generate HUD Ticks
    const ticks = Array.from({ length: 60 }).map((_, i) => {
        const isCardinal = i % 15 === 0; // Every 90 deg (60 / 4 = 15)
        const isMajor = i % 5 === 0;
        return (
            <div
                key={i}
                className="absolute top-0 left-0 w-full h-full flex justify-center"
                style={{
                    transform: `rotate(${i * 6}deg)`
                }}
            >
                {/* The tick mark positioned at the top rim */}
                <div className={cn(
                    "mt-[2px]", // Small offset from edge
                    isCardinal ? "h-[12px] w-[2px] bg-white/40" :
                        isMajor ? "h-[8px] w-[1px] bg-white/20" :
                            "h-[4px] w-[1px] bg-white/10"
                )} />
            </div>
        );
    });

    return (
        <div ref={containerRef} className="relative w-full aspect-square max-w-[400px] flex items-center justify-center p-4">

            {/* HUD Scale Rings - CONTAINER */}
            {/* HUD Scale Rings - CONTAINER */}
            {/* Added subtle "blue nuit" interior glow (inset_0_0_120px_rgba(48,110,232,0.05)) as requested for depth */}
            {/* Fix: Moved blue glow to FIRST position so it sits ON TOP of the black vignette, and increased opacity to 15% */}
            <div className="absolute inset-0 rounded-full border border-white/10 bg-[#0a0a0a] shadow-[inset_0_0_120px_rgba(48,110,232,0.15),inset_0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(48,110,232,0.1)] overflow-hidden flex items-center justify-center z-0">

                {/* 1. DEEP BACKGROUND GRADIENT (The "Screen" look) */}
                <div className="absolute inset-0 bg-radial-gradient from-[#306EE8]/10 via-transparent to-black opacity-80" />

                {/* 2. POLAR GRID (Texture & Depth) */}
                {/* Concentric circles */}
                <div className="absolute w-[85%] h-[85%] border border-white/5 rounded-full" />
                <div className="absolute w-[65%] h-[65%] border border-white/5 rounded-full" />
                <div className="absolute w-[45%] h-[45%] border border-white/5 rounded-full" />
                <div className="absolute w-[25%] h-[25%] border border-white/10 rounded-full bg-[#306EE8]/5" /> {/* Inner Core Highlight */}

                {/* Crosshairs (Axis) - Kept but subtle */}
                <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                {/* 3. HUD TICKS (The "Bezel") */}
                <div className="absolute inset-2 z-0 opacity-60">
                    {ticks}
                </div>

                {/* 4. SCANNER (The "Beam") */}
                <div ref={scannerRef} className="absolute w-[50%] h-[2px] left-[50%] top-[50%] origin-left z-20">
                    {/* The sharp leading edge (Needle) - CENTERED */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[#306EE8] to-white/90 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-20" />

                    {/* The wide cone beam (Centered on needle) */}
                    {/* Rotated back by -25deg approx to center the ~50deg cone around the needle */}
                    <div className="absolute top-1/2 left-0 w-[400px] h-[300px] bg-gradient-to-r from-transparent via-[#306EE8]/40 to-transparent origin-left"
                        style={{
                            transform: "translateY(-50%) rotate(-15deg) skewX(-15deg)",
                            filter: "blur(25px)",
                            opacity: 0.6
                        }}
                    />
                </div>

                {/* 5. DATA/STARS (Content) */}
                {/* Stars positioned using polar coordinates: center (50%, 50%) + radius 35% */}

                {/* Star 1: 30deg -> left: 80%, top: 67% */}
                <div className="absolute left-[80%] top-[67%] z-30">
                    <div className="ripple-1 absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 border border-white rounded-full opacity-0" />
                    <div className="star-1 opacity-0">
                        <Asterisk className="w-6 h-6 text-white/70 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
                    </div>
                </div>

                {/* Star 2: 90deg -> left: 50%, top: 85% */}
                <div className="absolute left-[50%] top-[85%] -translate-x-1/2 z-30">
                    <div className="ripple-2 absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 border border-white rounded-full opacity-0" />
                    <div className="star-2 opacity-0">
                        <Asterisk className="w-5 h-5 text-white/50 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                    </div>
                </div>

                {/* Star 3: 150deg -> left: 20%, top: 67% */}
                <div className="absolute left-[20%] top-[67%] z-30">
                    <div className="ripple-3 absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 border border-white rounded-full opacity-0" />
                    <div className="star-3 opacity-0">
                        <Asterisk className="w-4 h-4 text-white/60 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                    </div>
                </div>

                {/* Star 4: 210deg -> left: 20%, top: 33% */}
                <div className="absolute left-[20%] top-[33%] z-30">
                    <div className="ripple-4 absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 border border-white rounded-full opacity-0" />
                    <div className="star-4 opacity-0">
                        <Asterisk className="w-3 h-3 text-white/40 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                    </div>
                </div>

                {/* Star 5: 270deg -> left: 50%, top: 15% */}
                <div className="absolute left-[50%] top-[15%] -translate-x-1/2 z-30">
                    <div className="ripple-5 absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 border border-white rounded-full opacity-0" />
                    <div className="star-5 opacity-0">
                        <Asterisk className="w-5 h-5 text-white/60 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                    </div>
                </div>

                {/* Star 6: 330deg -> left: 80%, top: 33% */}
                <div className="absolute left-[80%] top-[33%] z-30">
                    <div className="ripple-6 absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 border border-white rounded-full opacity-0" />
                    <div className="star-6 opacity-0">
                        <Asterisk className="w-4 h-4 text-white/50 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                    </div>
                </div>

            </div>

            {/* External Glow Halo (Ambient) */}
            <div className="absolute inset-0 bg-[#306EE8]/5 rounded-full blur-[80px] -z-10" />

            {/* Removed Corner Labels as requested */}

            <style jsx>{`
                .bg-radial-gradient {
                    background: radial-gradient(circle, rgba(48, 110, 232, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
                }
            `}</style>
        </div>
    );
};

