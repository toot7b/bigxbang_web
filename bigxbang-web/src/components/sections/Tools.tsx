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
                    <div className="text-center max-w-4xl px-4 mb-16 relative z-30">
                        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
                            <span className="font-jakarta text-xs font-medium text-white/80">L'Arsenal</span>
                        </div>
                        <h1 className="font-clash text-3xl md:text-5xl font-medium text-white mb-4">
                            Cutting-Edge <span className="text-[#306EE8]">Stack</span>
                        </h1>
                        <h2 className="font-jakarta text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            On ne joue pas avec des outils obsolètes. On déploie le futur.
                        </h2>
                    </div>

                    {/* Orbit Visual - Added mb-24 for tooltip space */}
                    <div className="relative z-10 scale-75 md:scale-100 mb-24">
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
