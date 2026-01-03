"use client";

import React from "react";
import { cn } from "@/lib/utils";

import Image from "next/image";
import Asterisk from "@/components/ui/Asterisk";

interface ToolsOrbitMobileProps {
    className?: string;
}

export default function ToolsOrbitMobile({ className }: ToolsOrbitMobileProps) {
    return (
        <div className={cn("relative flex items-center justify-center w-[350px] h-[350px]", className)}>

            {/* --- Center: Core --- */}
            {/* Strong Blue Halo */}
            <div className="absolute z-10 w-40 h-40 rounded-full bg-[#306EE8]/30 blur-[60px] pointer-events-none" />
            <div className="absolute z-20 flex items-center justify-center w-20 h-20 rounded-full bg-[#306EE8] shadow-[0_0_40px_10px_rgba(48,110,232,0.6)] ring-4 ring-white/10">
                <Asterisk className="w-8 h-8 text-white" />
            </div>

            {/* --- Orbit 1: Inner (Tighter for Mobile) --- */}
            <div className="absolute inset-[90px] rounded-full border border-white/10 animate-spin-reverse-slower">
                {/* Top: Next.js */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border-2 border-white/20 bg-[#0a0a0a] shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    <div className="relative w-4 h-4 animate-counter-spin-reverse-slower">
                        <Image src="/icons/tools/nextjs_icon_dark.svg" alt="Next.js" fill className="object-contain invert" />
                    </div>
                </div>
                {/* Bottom: Python */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-2 rounded-full border-2 border-white/20 bg-[#0a0a0a] shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    <div className="relative w-4 h-4 animate-counter-spin-reverse-slower">
                        <Image src="/icons/tools/python.svg" alt="Python" fill className="object-contain" />
                    </div>
                </div>
            </div>

            {/* --- Orbit 2: Middle --- */}
            <div className="absolute inset-[45px] rounded-full border border-white/5 animate-spin-slower">
                {/* Right: Tailwind */}
                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 p-2 rounded-full border-2 border-white/20 bg-[#0a0a0a] shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    <div className="relative w-4 h-4 animate-counter-spin-slower">
                        <Image src="/icons/tools/tailwindcss.svg" alt="Tailwind" fill className="object-contain" />
                    </div>
                </div>
                {/* Left: Figma */}
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border-2 border-white/20 bg-[#0a0a0a] shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    <div className="relative w-4 h-4 animate-counter-spin-slower">
                        <Image src="/icons/tools/figma.svg" alt="Figma" fill className="object-contain" />
                    </div>
                </div>
            </div>

            {/* --- Orbit 3: Outer --- */}
            <div className="absolute inset-0 rounded-full border border-white/5 animate-spin-slow">
                {/* Top Right: Payload */}
                <div className="absolute top-[14.65%] right-[14.65%] translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full border-2 border-white/20 bg-[#0a0a0a] shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    <div className="relative w-5 h-5 animate-counter-spin-slow">
                        <Image src="/icons/tools/payload.svg" alt="Payload CMS" fill className="object-contain" />
                    </div>
                </div>
                {/* Bottom Left: n8n */}
                <div className="absolute bottom-[14.65%] left-[14.65%] -translate-x-1/2 translate-y-1/2 p-2.5 rounded-full border-2 border-white/20 bg-[#0a0a0a] shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    <div className="relative w-5 h-5 animate-counter-spin-slow">
                        <Image src="/icons/tools/n8n.svg" alt="n8n" fill className="object-contain" />
                    </div>
                </div>
                {/* Bottom Right: WebGL */}
                <div className="absolute bottom-[14.65%] right-[14.65%] translate-x-1/2 translate-y-1/2 p-2.5 rounded-full border-2 border-white/20 bg-[#0a0a0a] shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    <div className="relative w-5 h-5 animate-counter-spin-slow">
                        <Image src="/icons/tools/webgl_dark.svg" alt="WebGL" fill className="object-contain" />
                    </div>
                </div>
                {/* Top Left: After Effects (NEW) */}
                <div className="absolute top-[14.65%] left-[14.65%] -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full border-2 border-white/20 bg-[#0a0a0a] shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    <div className="relative w-5 h-5 animate-counter-spin-slow">
                        <Image src="/icons/tools/after-effects.svg" alt="After Effects" fill className="object-contain" />
                    </div>
                </div>
            </div>

            {/* --- Ambient Glow --- */}
            <div className="absolute inset-0 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none" />
        </div>
    );
}
