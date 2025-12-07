"use client";
import React from "react";
import Asterisk from "@/components/ui/Asterisk";

export const ExecutionVisual = () => {
    return (
        <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center p-4" style={{ transform: 'rotate(-0.3deg)' }}>

            {/* 0. AMBIENT SHOCKWAVES (Pulsing Energy Rings) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-[220px] h-[220px] rounded-[44px] border border-[#306EE8] opacity-0 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <div className="absolute w-[220px] h-[220px] rounded-[44px] border border-white opacity-0 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1.5s]" />
            </div>

            {/* 1. LAYER: THE ELECTRIC ENERGY (SVG STROKE) */}
            {/* Viewport 500px for MAXIMUM overflowing spill */}
            <svg className="absolute w-[500px] h-[500px] overflow-visible z-20 pointer-events-none" style={{ mixBlendMode: 'plus-lighter' }}>
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
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* 
                    EJECTING PARTICLES - BALANCED DEBRIS 
                 */}

                {/* GIANT CHUNKS (Visible but not cartoonish) */}
                <div className="absolute w-3.5 h-3.5 bg-white/90 rounded-full animate-[eject_2s_ease-out_infinite]" style={{ '--tx': '-180px', '--ty': '-180px' } as React.CSSProperties} />
                <div className="absolute w-4 h-4 bg-[#306EE8] rounded-full animate-[eject_3s_ease-out_infinite_0.2s]" style={{ '--tx': '200px', '--ty': '100px' } as React.CSSProperties} />
                <div className="absolute w-3 h-3 bg-blue-300 rounded-full animate-[eject_2.5s_ease-out_infinite_1.1s]" style={{ '--tx': '-100px', '--ty': '220px' } as React.CSSProperties} />

                {/* LARGE FRAGMENTS */}
                <div className="absolute w-2.5 h-2.5 bg-white rounded-full animate-[eject_1.8s_ease-out_infinite_0.5s]" style={{ '--tx': '160px', '--ty': '-140px' } as React.CSSProperties} />
                <div className="absolute w-3 h-3 bg-[#5B8DEF] rounded-full animate-[eject_2.2s_ease-out_infinite_0.8s]" style={{ '--tx': '-200px', '--ty': '50px' } as React.CSSProperties} />
                <div className="absolute w-2.5 h-2.5 bg-white/90 rounded-full animate-[eject_2s_ease-out_infinite_1.5s]" style={{ '--tx': '80px', '--ty': '-200px' } as React.CSSProperties} />
                <div className="absolute w-3 h-3 bg-blue-400 rounded-full animate-[eject_3s_ease-out_infinite_0.1s]" style={{ '--tx': '120px', '--ty': '180px' } as React.CSSProperties} />

                {/* MEDIUM SPARKS (Crisp) */}
                <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-[eject_1.5s_ease-out_infinite_0.3s]" style={{ '--tx': '-120px', '--ty': '-220px' } as React.CSSProperties} />
                <div className="absolute w-2 h-2 bg-white rounded-full animate-[eject_1.2s_ease-out_infinite_0.7s]" style={{ '--tx': '220px', '--ty': '-80px' } as React.CSSProperties} />
                <div className="absolute w-2 h-2 bg-blue-200 rounded-full animate-[eject_1.6s_ease-out_infinite_1.2s]" style={{ '--tx': '-140px', '--ty': '160px' } as React.CSSProperties} />
                <div className="absolute w-1.5 h-1.5 bg-white rounded-full animate-[eject_1.4s_ease-out_infinite_1.8s]" style={{ '--tx': '60px', '--ty': '240px' } as React.CSSProperties} />

                {/* EXTRA CHAOS */}
                <div className="absolute w-3.5 h-3.5 bg-white/80 rounded-full animate-[eject_2.6s_ease-out_infinite_0.4s]" style={{ '--tx': '-240px', '--ty': '-40px' } as React.CSSProperties} />
                <div className="absolute w-2.5 h-2.5 bg-[#306EE8] rounded-full animate-[eject_2.1s_ease-out_infinite_1.3s]" style={{ '--tx': '240px', '--ty': '40px' } as React.CSSProperties} />
            </div>

            {/* 3. LAYER: STABLE BLUR GLOW (The Container) */}
            <div className="absolute w-[220px] h-[220px] bg-[#306EE8] rounded-[44px] blur-[80px] opacity-30 z-0 animate-pulse"></div>

            {/* 4. MAIN APP ICON (The Solid Box) */}
            {/* Matches the SVG dimensions (220x220) */}
            <div
                className="relative w-[220px] h-[220px] bg-[#050505] rounded-[44px] z-30 flex items-center justify-center overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(48,110,232,0.3)]"
            >
                {/* Internal sheen - Vertical to prevent tilt illusion */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black pointer-events-none" />

                <Asterisk className="w-28 h-28 text-white z-40 relative drop-shadow-[0_0_25px_rgba(48,110,232,1)]" />
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
