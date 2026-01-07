"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Asterisk from "@/components/ui/Asterisk";
import ToolsOrbitShockwave from "./ToolsOrbitShockwave";

interface ToolsOrbitProps {
    className?: string;
}

export default function ToolsOrbit({ className }: ToolsOrbitProps) {
    // State for animations and interactions
    const [hoveredOrbit, setHoveredOrbit] = useState<number | null>(null);
    const [isCenterHovered, setIsCenterHovered] = useState(false);

    // NEW: We need to track exactly WHICH icon is hovered to show the correct tooltip
    // across the Z-index split layers.
    const [hoveredIconId, setHoveredIconId] = useState<string | null>(null);

    return (
        <div className={cn("relative flex items-center justify-center w-[550px] h-[550px]", className)}>

            {/* --- Center: Core --- */}
            <div className="absolute z-10 w-64 h-64 rounded-full bg-[#306EE8]/30 blur-[80px] pointer-events-none" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] z-10 pointer-events-none">
                <ToolsOrbitShockwave active={isCenterHovered} />
            </div>
            <div
                className="absolute z-[110] flex items-center justify-center w-24 h-24 rounded-full bg-[#306EE8] shadow-[0_0_80px_30px_rgba(48,110,232,0.6)] ring-4 ring-white/10 cursor-pointer transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_100px_40px_rgba(48,110,232,0.8)]"
                onMouseEnter={() => setIsCenterHovered(true)}
                onMouseLeave={() => setIsCenterHovered(false)}
            >
                <Asterisk className="w-10 h-10 text-white" />
            </div>

            {/* =========================================================
                LAYER 1: TOOLTIPS ONLY (Z-20)
                These will ALWAYS be behind icons (Z-30).
               ========================================================= */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                {/* Inner Orbit Tooltips */}
                <div
                    className="absolute inset-[160px] animate-spin-reverse-slower"
                    style={{ animationPlayState: hoveredOrbit === 1 ? "paused" : "running" }}
                >
                    <OrbitIcon
                        id="nextjs" src="/icons/tools/nextjs_icon_dark.svg" alt="Next.js" description="Sites Web Performants"
                        position="top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" counterAnim="animate-counter-spin-reverse-slower"
                        renderMode="tooltip" isHovered={hoveredIconId === "nextjs"}
                        onHover={() => { }} isOrbitPaused={false}
                    />
                    <OrbitIcon
                        id="python" src="/icons/tools/python.svg" alt="Python" description="Scripts & Données"
                        position="bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" counterAnim="animate-counter-spin-reverse-slower"
                        renderMode="tooltip" isHovered={hoveredIconId === "python"}
                        onHover={() => { }} isOrbitPaused={false}
                    />
                </div>
                {/* Middle Orbit Tooltips */}
                <div
                    className="absolute inset-[80px] animate-spin-slower"
                    style={{ animationPlayState: hoveredOrbit === 2 ? "paused" : "running" }}
                >
                    <OrbitIcon
                        id="tailwind" src="/icons/tools/tailwindcss.svg" alt="Tailwind" description="Design Sur Mesure"
                        position="top-1/2 right-0 translate-x-1/2 -translate-y-1/2" counterAnim="animate-counter-spin-slower"
                        renderMode="tooltip" isHovered={hoveredIconId === "tailwind"}
                        onHover={() => { }} isOrbitPaused={false}
                    />
                    <OrbitIcon
                        id="figma" src="/icons/tools/figma.svg" alt="Figma" description="Maquettes & Prototypes"
                        position="top-1/2 left-0 -translate-x-1/2 -translate-y-1/2" counterAnim="animate-counter-spin-slower"
                        renderMode="tooltip" isHovered={hoveredIconId === "figma"}
                        onHover={() => { }} isOrbitPaused={false}
                    />
                </div>
                {/* Outer Orbit Tooltips */}
                <div
                    className="absolute inset-0 animate-spin-slow"
                    style={{ animationPlayState: hoveredOrbit === 3 ? "paused" : "running" }}
                >
                    <OrbitIcon
                        id="payload" src="/icons/tools/payload.svg" alt="Payload CMS" description="Gestion de Contenu"
                        position="top-[14.65%] right-[14.65%] translate-x-1/2 -translate-y-1/2" counterAnim="animate-counter-spin-slow"
                        renderMode="tooltip" isHovered={hoveredIconId === "payload"}
                        onHover={() => { }} isOrbitPaused={false}
                    />
                    <OrbitIcon
                        id="n8n" src="/icons/tools/n8n.svg" alt="n8n" description="Automatisation"
                        position="bottom-[14.65%] left-[14.65%] -translate-x-1/2 translate-y-1/2" counterAnim="animate-counter-spin-slow"
                        renderMode="tooltip" isHovered={hoveredIconId === "n8n"}
                        onHover={() => { }} isOrbitPaused={false}
                    />
                    <OrbitIcon
                        id="webgl" src="/icons/tools/webgl_dark.svg" alt="WebGL" description="Expériences 3D"
                        position="bottom-[14.65%] right-[14.65%] translate-x-1/2 translate-y-1/2" counterAnim="animate-counter-spin-slow"
                        renderMode="tooltip" isHovered={hoveredIconId === "webgl"}
                        onHover={() => { }} isOrbitPaused={false}
                    />
                    <OrbitIcon
                        id="aftereffects" src="/icons/tools/after-effects.svg" alt="After Effects" description="Animations Vidéo"
                        position="top-[14.65%] left-[14.65%] -translate-x-1/2 -translate-y-1/2" counterAnim="animate-counter-spin-slow"
                        renderMode="tooltip" isHovered={hoveredIconId === "aftereffects"}
                        onHover={() => { }} isOrbitPaused={false}
                    />
                </div>
            </div>

            {/* =========================================================
                LAYER 2: ICONS ONLY (Z-30)
                These will ALWAYS be above tooltips (Z-20).
               ========================================================= */}
            <div className="absolute inset-0 z-30 pointer-events-none">
                {/* Inner Orbit Icons */}
                <div
                    className="absolute inset-[160px] rounded-full border border-white/20 animate-spin-reverse-slower pointer-events-none"
                    style={{ animationPlayState: hoveredOrbit === 1 ? "paused" : "running" }}
                >
                    <OrbitIcon
                        id="nextjs" src="/icons/tools/nextjs_icon_dark.svg" alt="Next.js" description=""
                        position="top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" counterAnim="animate-counter-spin-reverse-slower"
                        renderMode="icon" isInvert
                        onHover={(h) => { setHoveredOrbit(h ? 1 : null); setHoveredIconId(h ? "nextjs" : null); }}
                        isOrbitPaused={hoveredOrbit === 1} isCenterHovered={isCenterHovered} orbitIndex={1}
                    />
                    <OrbitIcon
                        id="python" src="/icons/tools/python.svg" alt="Python" description=""
                        position="bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" counterAnim="animate-counter-spin-reverse-slower"
                        renderMode="icon"
                        onHover={(h) => { setHoveredOrbit(h ? 1 : null); setHoveredIconId(h ? "python" : null); }}
                        isOrbitPaused={hoveredOrbit === 1} isCenterHovered={isCenterHovered} orbitIndex={1}
                    />
                </div>

                {/* Middle Orbit Icons */}
                <div
                    className="absolute inset-[80px] rounded-full border border-white/10 animate-spin-slower pointer-events-none"
                    style={{ animationPlayState: hoveredOrbit === 2 ? "paused" : "running" }}
                >
                    <OrbitIcon
                        id="tailwind" src="/icons/tools/tailwindcss.svg" alt="Tailwind" description=""
                        position="top-1/2 right-0 translate-x-1/2 -translate-y-1/2" counterAnim="animate-counter-spin-slower"
                        renderMode="icon"
                        onHover={(h) => { setHoveredOrbit(h ? 2 : null); setHoveredIconId(h ? "tailwind" : null); }}
                        isOrbitPaused={hoveredOrbit === 2} isCenterHovered={isCenterHovered} orbitIndex={2}
                    />
                    <OrbitIcon
                        id="figma" src="/icons/tools/figma.svg" alt="Figma" description=""
                        position="top-1/2 left-0 -translate-x-1/2 -translate-y-1/2" counterAnim="animate-counter-spin-slower"
                        renderMode="icon"
                        onHover={(h) => { setHoveredOrbit(h ? 2 : null); setHoveredIconId(h ? "figma" : null); }}
                        isOrbitPaused={hoveredOrbit === 2} isCenterHovered={isCenterHovered} orbitIndex={2}
                    />
                </div>

                {/* Outer Orbit Icons */}
                <div
                    className="absolute inset-0 rounded-full border border-white/5 animate-spin-slow pointer-events-none"
                    style={{ animationPlayState: hoveredOrbit === 3 ? "paused" : "running" }}
                >
                    <OrbitIcon
                        id="payload" src="/icons/tools/payload.svg" alt="Payload CMS" description=""
                        position="top-[14.65%] right-[14.65%] translate-x-1/2 -translate-y-1/2" counterAnim="animate-counter-spin-slow"
                        renderMode="icon" iconSize="w-8 h-8" padding="p-4"
                        onHover={(h) => { setHoveredOrbit(h ? 3 : null); setHoveredIconId(h ? "payload" : null); }}
                        isOrbitPaused={hoveredOrbit === 3} isCenterHovered={isCenterHovered} orbitIndex={3}
                    />
                    <OrbitIcon
                        id="n8n" src="/icons/tools/n8n.svg" alt="n8n" description=""
                        position="bottom-[14.65%] left-[14.65%] -translate-x-1/2 translate-y-1/2" counterAnim="animate-counter-spin-slow"
                        renderMode="icon" iconSize="w-8 h-8" padding="p-4"
                        onHover={(h) => { setHoveredOrbit(h ? 3 : null); setHoveredIconId(h ? "n8n" : null); }}
                        isOrbitPaused={hoveredOrbit === 3} isCenterHovered={isCenterHovered} orbitIndex={3}
                    />
                    <OrbitIcon
                        id="webgl" src="/icons/tools/webgl_dark.svg" alt="WebGL" description=""
                        position="bottom-[14.65%] right-[14.65%] translate-x-1/2 translate-y-1/2" counterAnim="animate-counter-spin-slow"
                        renderMode="icon" iconSize="w-8 h-8" padding="p-4"
                        onHover={(h) => { setHoveredOrbit(h ? 3 : null); setHoveredIconId(h ? "webgl" : null); }}
                        isOrbitPaused={hoveredOrbit === 3} isCenterHovered={isCenterHovered} orbitIndex={3}
                    />
                    <OrbitIcon
                        id="aftereffects" src="/icons/tools/after-effects.svg" alt="After Effects" description=""
                        position="top-[14.65%] left-[14.65%] -translate-x-1/2 -translate-y-1/2" counterAnim="animate-counter-spin-slow"
                        renderMode="icon" iconSize="w-8 h-8" padding="p-4"
                        onHover={(h) => { setHoveredOrbit(h ? 3 : null); setHoveredIconId(h ? "aftereffects" : null); }}
                        isOrbitPaused={hoveredOrbit === 3} isCenterHovered={isCenterHovered} orbitIndex={3}
                    />
                </div>
            </div>
            {/* --- Ambient Glow --- */}
            <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none z-0" />
        </div>
    );
}

// --- HELPER WRAPPER & LOGIC ---

// Helper function to extract rotation angle from a transform matrix
function getRotationFromMatrix(element: HTMLElement | null): number {
    if (!element) return 0;
    const style = window.getComputedStyle(element);
    const transform = style.transform;
    if (transform === 'none') return 0;
    const values = transform.match(/matrix.*\((.+)\)/);
    if (!values) return 0;
    const parts = values[1].split(', ').map(Number);
    const a = parts[0];
    const b = parts[1];
    return Math.atan2(b, a) * (180 / Math.PI);
}

interface OrbitIconProps {
    id?: string;
    src: string;
    alt: string;
    description: string;
    position: string;
    counterAnim: string;
    iconSize?: string;
    padding?: string;
    isInvert?: boolean;
    onHover: (isHovering: boolean) => void;
    isOrbitPaused: boolean;
    isCenterHovered?: boolean;
    orbitIndex?: number;
    // Layering Props
    renderMode?: 'icon' | 'tooltip' | 'both';
    isHovered?: boolean; // Controlled hover state (for tooltips in separate layer)
}

function OrbitIcon({
    id,
    src,
    alt,
    description,
    position,
    counterAnim,
    iconSize = "w-6 h-6",
    padding = "p-3",
    isInvert = false,
    onHover,
    isOrbitPaused,
    isCenterHovered = false,
    orbitIndex = 0,
    renderMode = 'both',
    isHovered: controlledIsHovered
}: OrbitIconProps) {
    const reactionDelay = isCenterHovered ? `${orbitIndex * 75}ms` : '0ms';
    const [localIsHovered, setLocalIsHovered] = useState(false);

    // Effective hover: controlled prop takes precedence for tooltips in Layer 1
    // Actually, localIsHovered is updated when hovering the ICON container.
    // If renderMode is 'icon', update local. If renderMode is 'tooltip', we rely on prop.
    const isEffectiveHovered = controlledIsHovered !== undefined ? controlledIsHovered : localIsHovered;

    const iconContainerRef = React.useRef<HTMLDivElement>(null);
    const iconImageRef = React.useRef<HTMLDivElement>(null);
    const tooltipRef = React.useRef<HTMLDivElement>(null);
    const animationFrameRef = React.useRef<number>(0);

    React.useEffect(() => {
        const updateRotations = () => {
            if (iconContainerRef.current) {
                const orbitContainer = iconContainerRef.current.parentElement;
                if (orbitContainer) {
                    const orbitRotation = getRotationFromMatrix(orbitContainer);
                    if (iconImageRef.current) iconImageRef.current.style.transform = `rotate(${-orbitRotation}deg)`;
                    if (tooltipRef.current) tooltipRef.current.style.transform = `rotate(${-orbitRotation}deg)`;
                }
            }
            animationFrameRef.current = requestAnimationFrame(updateRotations);
        };
        animationFrameRef.current = requestAnimationFrame(updateRotations);
        return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
    }, []);

    // Props for the container
    // CRITICAL: For Layer 2 (Icons), we are inside a pointer-events-none parent (orbit container).
    // So this container MUST have pointer-events-auto to catch interactions.
    const containerProps = {
        ref: iconContainerRef,
        className: cn(
            "absolute transition-all duration-500",
            renderMode === 'tooltip' ? "pointer-events-none z-10" : "pointer-events-auto cursor-pointer z-50 group",
            position,
            renderMode !== 'tooltip' && [
                "rounded-full border-2 border-white/20 bg-[#0a0a0a] shadow-[0_0_15px_rgba(255,255,255,0.1)]",
                padding,
                (isCenterHovered) && "scale-110 border-[#306EE8] shadow-[0_0_30px_rgba(48,110,232,0.5)]",
                "hover:scale-110 hover:border-[#306EE8] hover:shadow-[0_0_30px_rgba(48,110,232,0.6)] hover:opacity-100"
            ]
        ),
        style: { transitionDelay: reactionDelay },
        onMouseEnter: () => { setLocalIsHovered(true); onHover(true); },
        onMouseLeave: () => { setLocalIsHovered(false); onHover(false); }
    };

    return (
        <div {...containerProps}>
            {/* ICON COMPONENT */}
            {(renderMode === 'icon' || renderMode === 'both') && (
                <div className={cn("flex items-center justify-center", (isOrbitPaused && !isCenterHovered && !localIsHovered) && "animate-struggle")}>
                    <div ref={iconImageRef} className={cn("relative flex flex-col items-center", iconSize)}>
                        <Image src={src} alt={alt} fill className={cn("object-contain transition-opacity", isInvert && "invert")} />
                    </div>
                </div>
            )}

            {/* TOOLTIP COMPONENT */}
            {(renderMode === 'tooltip' || renderMode === 'both') && (
                <div ref={tooltipRef} className="absolute left-1/2 top-1/2 w-0 h-0 flex items-center justify-center z-[100]">
                    <div className={cn(
                        "absolute top-[40px] flex flex-col items-center text-center transition-opacity duration-300 w-auto min-w-[max-content]",
                        isEffectiveHovered ? "opacity-100" : "opacity-0"
                    )}>
                        <h3 className="text-white font-clash font-bold text-lg tracking-wide drop-shadow-md whitespace-nowrap">{alt}</h3>
                        <p className="text-white/90 font-jakarta text-[11px] font-medium uppercase tracking-wider mt-1 whitespace-nowrap">{description}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
