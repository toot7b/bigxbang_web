"use client";

import React from "react";
import { cn } from "@/lib/utils";

// Placeholders for icons - You can replace these with Lucide or SVGs
import Image from "next/image";
import Asterisk from "@/components/ui/Asterisk";
import ToolsOrbitShockwave from "./ToolsOrbitShockwave";

interface ToolsOrbitProps {
    className?: string;
}

export default function ToolsOrbit({ className }: ToolsOrbitProps) {
    // Track which orbit is hovered to pause rotation (1: Inner, 2: Middle, 3: Outer)
    const [hoveredOrbit, setHoveredOrbit] = React.useState<number | null>(null);
    const [isCenterHovered, setIsCenterHovered] = React.useState(false);

    return (
        <div className={cn("relative flex items-center justify-center w-[550px] h-[550px]", className)}>

            {/* --- Center: Core --- */}
            {/* Strong Blue Halo */}
            <div className="absolute z-10 w-64 h-64 rounded-full bg-[#306EE8]/30 blur-[80px] pointer-events-none" />

            {/* 3D Shockwave Effect (Exact Shader) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] z-10 pointer-events-none">
                <ToolsOrbitShockwave active={isCenterHovered} />
            </div>

            <div
                className="absolute z-20 flex items-center justify-center w-24 h-24 rounded-full bg-[#306EE8] shadow-[0_0_80px_30px_rgba(48,110,232,0.6)] ring-4 ring-white/10 cursor-pointer transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_100px_40px_rgba(48,110,232,0.8)]"
                onMouseEnter={() => setIsCenterHovered(true)}
                onMouseLeave={() => setIsCenterHovered(false)}
            >
                <Asterisk className="w-10 h-10 text-white" />
            </div>

            {/* --- Orbit 1: Inner (Logic) --- */}
            <div
                className="absolute inset-[160px] z-30 rounded-full border border-white/20 animate-spin-reverse-slower pointer-events-none"
                style={{ animationPlayState: hoveredOrbit === 1 ? "paused" : "running" }}
            >
                {/* Top: Next.js */}
                <OrbitIcon
                    src="/icons/tools/nextjs_icon_dark.svg"
                    alt="Next.js"
                    description="Sites Web Performants"
                    position="top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    counterAnim="animate-counter-spin-reverse-slower"
                    isInvert
                    onHover={(isHovering) => setHoveredOrbit(isHovering ? 1 : null)}
                    isOrbitPaused={hoveredOrbit === 1}
                    isCenterHovered={isCenterHovered}
                    orbitIndex={1}
                />
                {/* Bottom: Python */}
                <OrbitIcon
                    src="/icons/tools/python.svg"
                    alt="Python"
                    description="Scripts & Données"
                    position="bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                    counterAnim="animate-counter-spin-reverse-slower"
                    onHover={(isHovering) => setHoveredOrbit(isHovering ? 1 : null)}
                    isOrbitPaused={hoveredOrbit === 1}
                    isCenterHovered={isCenterHovered}
                    orbitIndex={1}
                />
            </div>

            {/* --- Orbit 2: Middle (Style) --- */}
            <div
                className="absolute inset-[80px] z-30 rounded-full border border-white/10 animate-spin-slower pointer-events-none"
                style={{ animationPlayState: hoveredOrbit === 2 ? "paused" : "running" }}
            >
                {/* Right: Tailwind */}
                <OrbitIcon
                    src="/icons/tools/tailwindcss.svg"
                    alt="Tailwind"
                    description="Design Sur Mesure"
                    position="top-1/2 right-0 translate-x-1/2 -translate-y-1/2"
                    counterAnim="animate-counter-spin-slower"
                    onHover={(isHovering) => setHoveredOrbit(isHovering ? 2 : null)}
                    isOrbitPaused={hoveredOrbit === 2}
                    isCenterHovered={isCenterHovered}
                    orbitIndex={2}
                />
                {/* Left: Figma */}
                <OrbitIcon
                    src="/icons/tools/figma.svg"
                    alt="Figma"
                    description="Maquettes & Prototypes"
                    position="top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"
                    counterAnim="animate-counter-spin-slower"
                    onHover={(isHovering) => setHoveredOrbit(isHovering ? 2 : null)}
                    isOrbitPaused={hoveredOrbit === 2}
                    isCenterHovered={isCenterHovered}
                    orbitIndex={2}
                />
            </div>

            {/* --- Orbit 3: Outer (Creative/Data) --- */}
            <div
                className="absolute inset-0 z-30 rounded-full border border-white/5 animate-spin-slow pointer-events-none"
                style={{ animationPlayState: hoveredOrbit === 3 ? "paused" : "running" }}
            >
                {/* Top Right: Payload */}
                <OrbitIcon
                    src="/icons/tools/payload.svg"
                    alt="Payload CMS"
                    description="Gestion de Contenu"
                    position="top-[14.65%] right-[14.65%] translate-x-1/2 -translate-y-1/2"
                    counterAnim="animate-counter-spin-slow"
                    iconSize="w-8 h-8"
                    padding="p-4"
                    onHover={(isHovering) => setHoveredOrbit(isHovering ? 3 : null)}
                    isOrbitPaused={hoveredOrbit === 3}
                    isCenterHovered={isCenterHovered}
                    orbitIndex={3}
                />
                {/* Bottom Left: n8n */}
                <OrbitIcon
                    src="/icons/tools/n8n.svg"
                    alt="n8n"
                    description="Automatisation"
                    position="bottom-[14.65%] left-[14.65%] -translate-x-1/2 translate-y-1/2"
                    counterAnim="animate-counter-spin-slow"
                    iconSize="w-8 h-8"
                    padding="p-4"
                    onHover={(isHovering) => setHoveredOrbit(isHovering ? 3 : null)}
                    isOrbitPaused={hoveredOrbit === 3}
                    isCenterHovered={isCenterHovered}
                    orbitIndex={3}
                />
                {/* Bottom Right: WebGL */}
                <OrbitIcon
                    src="/icons/tools/webgl_dark.svg"
                    alt="WebGL"
                    description="Expériences 3D"
                    position="bottom-[14.65%] right-[14.65%] translate-x-1/2 translate-y-1/2"
                    counterAnim="animate-counter-spin-slow"
                    iconSize="w-8 h-8"
                    padding="p-4"
                    onHover={(isHovering) => setHoveredOrbit(isHovering ? 3 : null)}
                    isOrbitPaused={hoveredOrbit === 3}
                    isCenterHovered={isCenterHovered}
                    orbitIndex={3}
                />
                {/* Top Left: After Effects */}
                <OrbitIcon
                    src="/icons/tools/after-effects.svg"
                    alt="After Effects"
                    description="Animations Vidéo"
                    position="top-[14.65%] left-[14.65%] -translate-x-1/2 -translate-y-1/2"
                    counterAnim="animate-counter-spin-slow"
                    iconSize="w-8 h-8"
                    padding="p-4"
                    onHover={(isHovering) => setHoveredOrbit(isHovering ? 3 : null)}
                    isOrbitPaused={hoveredOrbit === 3}
                    isCenterHovered={isCenterHovered}
                    orbitIndex={3}
                />
            </div>

            {/* --- Ambient Glow --- */}
            <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
        </div>
    );
}

// --- Helper function to extract rotation angle from a transform matrix ---
function getRotationFromMatrix(element: HTMLElement | null): number {
    if (!element) return 0;
    const style = window.getComputedStyle(element);
    const transform = style.transform;
    if (transform === 'none') return 0;

    // Parse matrix(a, b, c, d, tx, ty) or matrix3d(...)
    const values = transform.match(/matrix.*\((.+)\)/);
    if (!values) return 0;

    const parts = values[1].split(', ').map(Number);
    // For 2D matrix: rotation = atan2(b, a)
    const a = parts[0];
    const b = parts[1];
    return Math.atan2(b, a) * (180 / Math.PI);
}

// --- Helper Component ---
interface OrbitIconProps {
    src: string;
    alt: string;
    description: string;
    position: string; // Taildwind classes for absolute position
    counterAnim: string; // The counter-rotation animation class
    iconSize?: string; // Default w-6 h-6
    padding?: string; // Default p-3
    isInvert?: boolean;
    onHover: (isHovering: boolean) => void;
    isOrbitPaused: boolean;
    // New props for Shockwave Reaction
    isCenterHovered?: boolean;
    orbitIndex?: number;
}

function OrbitIcon({
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
    orbitIndex = 0
}: OrbitIconProps) {
    // Delay based on distance (orbitIndex) from center to simulate wave travel
    // 75ms per "layer" looks natural with the wave speed
    const reactionDelay = isCenterHovered ? `${orbitIndex * 75}ms` : '0ms';

    // Track local hover to strictly exclude THIS icon from struggle effect
    const [isHovered, setIsHovered] = React.useState(false);

    // Refs for dynamic rotation tracking
    const iconContainerRef = React.useRef<HTMLDivElement>(null);
    const iconImageRef = React.useRef<HTMLDivElement>(null);
    const tooltipRef = React.useRef<HTMLDivElement>(null);
    const animationFrameRef = React.useRef<number>(0);

    // Track icon + tooltip rotation to keep them horizontal
    React.useEffect(() => {
        const updateRotations = () => {
            if (iconContainerRef.current) {
                // Get the orbit container (parent - the rotating orbit div)
                const orbitContainer = iconContainerRef.current.parentElement;
                if (orbitContainer) {
                    const orbitRotation = getRotationFromMatrix(orbitContainer);
                    // Apply counter-rotation to icon to keep it upright
                    if (iconImageRef.current) {
                        iconImageRef.current.style.transform = `rotate(${-orbitRotation}deg)`;
                    }
                    // Apply counter-rotation to tooltip
                    if (tooltipRef.current) {
                        tooltipRef.current.style.transform = `translateX(-50%) rotate(${-orbitRotation}deg)`;
                    }
                }
            }
            animationFrameRef.current = requestAnimationFrame(updateRotations);
        };

        animationFrameRef.current = requestAnimationFrame(updateRotations);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={iconContainerRef}
            className={cn(
                "absolute rounded-full border-2 border-white/20 bg-[#0a0a0a] shadow-[0_0_15px_rgba(255,255,255,0.1)] pointer-events-auto cursor-pointer transition-all duration-500 group z-50",
                position,
                padding,
                // Hover state (Self) OR Shockwave Reaction (Center)
                // When center is hovered, we apply a "Mini Active" state
                (isCenterHovered) && "scale-110 border-[#306EE8] shadow-[0_0_30px_rgba(48,110,232,0.5)]",

                // Standard Hover
                "hover:scale-110 hover:border-[#306EE8] hover:shadow-[0_0_30px_rgba(48,110,232,0.6)] hover:opacity-100"
            )}
            style={{ transitionDelay: reactionDelay }}
            onMouseEnter={() => { setIsHovered(true); onHover(true); }}
            onMouseLeave={() => { setIsHovered(false); onHover(false); }}
        >
            {/* Struggle Wrapper: Isolates transform animation from positioning */}
            <div className={cn("flex items-center justify-center", (isOrbitPaused && !isCenterHovered && !isHovered) && "animate-struggle")}>
                {/* Image Container - Counter-rotated via JS to stay upright */}
                <div
                    ref={iconImageRef}
                    className={cn("relative flex flex-col items-center", iconSize)}
                >
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className={cn("object-contain transition-opacity", isInvert && "invert")}
                    />
                </div>
            </div>

            {/* Tooltip - Dynamically counter-rotated via JS to stay horizontal */}
            <div
                ref={tooltipRef}
                className="absolute top-full mt-8 left-1/2 flex flex-col items-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[100] w-auto"
            >
                <h3 className="text-white font-clash font-bold text-lg tracking-wide drop-shadow-md whitespace-nowrap">
                    {alt}
                </h3>
                <p className="text-white/90 font-jakarta text-[11px] font-medium uppercase tracking-wider mt-1 whitespace-nowrap">
                    {description}
                </p>
            </div>
        </div>
    );
}
