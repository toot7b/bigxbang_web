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

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!sectionRef.current || !contentRef.current) return;

            // PARALLAX + REVEAL ANIMATION (Identical to CaseStudies but White Overlay -> Black BG)
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top bottom",
                end: "top top",
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const yPercent = -50 + (50 * progress);

                    // Slide content up from -50% to 0%
                    contentRef.current!.style.transform = `translateY(${yPercent}%)`;
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div id="tools" className="scroll-mt-[100px]">
            <section
                ref={sectionRef}
                data-theme="dark"
                className="relative z-0 w-full min-h-screen text-white -mt-[60px] pt-40 overflow-hidden"
            >
                <div className="absolute inset-0 z-0">
                    <QuantumFlowBackground />
                </div>

                {/* CONTENT CONTAINER */}
                <div
                    ref={contentRef}
                    className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center p-4 md:p-8"
                    style={{ transform: 'translateY(-50%)' }}
                >
                    {/* Header */}
                    <div className="text-center md:text-center max-w-4xl px-4 md:px-4 mb-32 md:mb-32 relative z-30 flex flex-col items-start md:items-center px-6 md:px-0">
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm mb-6">
                            <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest">L'écosystème</span>
                        </div>
                        <h1 className="font-clash text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1] text-left md:text-center">
                            Le socle <span className="text-[#306EE8]">technique</span>
                        </h1>
                        <h2 className="font-jakarta text-base md:text-lg text-zinc-400 leading-relaxed max-w-sm md:max-w-2xl mx-auto text-left md:text-center">
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
