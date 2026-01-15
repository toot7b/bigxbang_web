"use client";

import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Dynamic imports for heavy WebGL components (speeds up compilation)
const ToolsOrbit = dynamic(() => import("@/components/ui/ToolsOrbit"), { ssr: false, loading: () => null });
const ToolsOrbitMobile = dynamic(() => import("@/components/ui/ToolsOrbitMobile"), { ssr: false, loading: () => null });
const QuantumFlowBackground = dynamic(() => import("@/components/ui/QuantumFlowBackground"), { ssr: false, loading: () => null });

gsap.registerPlugin(ScrollTrigger);

export default function Tools() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <div id="tools" className="scroll-mt-[100px]">
            <section
                ref={sectionRef}
                data-theme="dark"
                className="relative z-0 w-full min-h-screen text-white pt-24 pb-20 overflow-hidden"
            >
                <div className="absolute inset-0 z-0">
                    <QuantumFlowBackground />
                </div>

                {/* CONTENT CONTAINER */}
                <div
                    ref={contentRef}
                    className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center p-4 md:p-8"
                >
                    {/* Header */}
                    <div className="text-center md:text-center max-w-4xl px-4 md:px-4 mb-32 md:mb-32 relative z-30 flex flex-col items-start md:items-center px-6 md:px-0">
                        <div className="hidden md:inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
                            <span className="font-jakarta text-xs font-medium text-white/80">L'ÉCOSYSTÈME</span>
                        </div>
                        {/* Mobile badge - keep original blue style */}
                        <div className="md:hidden inline-flex items-center justify-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm mb-6">
                            <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest">L'écosystème</span>
                        </div>
                        <h1 className="font-clash text-3xl md:text-5xl font-medium text-white mb-6 leading-[1.1] text-left md:text-center">
                            Le socle <span className="text-[#306EE8]">technique</span>
                        </h1>
                        <h2 className="font-jakarta text-base md:text-lg text-gray-400 leading-relaxed max-w-sm md:max-w-2xl mx-auto text-left md:text-center">
                            On ne gagne pas une course de F1 en Twingo. Une sélection intransigeante des meilleures technologies mondiales pour une performance brute.
                        </h2>
                    </div>

                    {/* Orbit Visual - Added mb-24 for tooltip space */}
                    <div className="relative z-10 md:scale-100 mb-24">
                        {/* Desktop Version */}
                        <div className="hidden md:block">
                            <ToolsOrbit />
                        </div>
                        {/* Mobile Version */}
                        <div className="block md:hidden">
                            <ToolsOrbitMobile />
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
