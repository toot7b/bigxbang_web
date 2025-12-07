"use client";

import { UnifiedMethodVisual } from "@/components/ui/UnifiedMethodVisual";
import { Ripple } from "@/components/ui/Ripple";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TimelineNode } from "@/components/ui/TimelineNode"; // Correct Import

export default function Method() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState(0);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    const steps = [
        {
            title: "Immersion",
            description: "Nous analysons votre marque, votre marché et vos concurrents pour identifier votre positionnement unique."
        },
        {
            title: "Architecture",
            description: "Nous structurons votre site pour maximiser la conversion et guider l'utilisateur vers l'action."
        },
        {
            title: "Exécution",
            description: "Le code est propre, testé, et livré vite. Chaque ligne a une utilité."
        }
    ];



    // Track Scroll Progress for the Beam
    const [scrollProgress, setScrollProgress] = useState(0);
    // Derived active step based on scroll progress (closest node)


    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const totalHeight = rect.height;
            const viewportHeight = window.innerHeight;
            const viewportCenter = viewportHeight / 2;

            // The Beam follows the CENTER of the viewport
            const scrollCenter = -rect.top + viewportCenter;

            // Normalize: 0 to 1 over the full container height
            const progress = Math.max(0, Math.min(1, scrollCenter / totalHeight));
            setScrollProgress(progress);

            // Calculate which step is active based on actual positions
            let closestStep = 0;
            let minDistance = Infinity;

            stepRefs.current.forEach((stepEl, index) => {
                if (!stepEl) return;

                const stepRect = stepEl.getBoundingClientRect();
                // Distance from step center to viewport center
                const stepCenter = stepRect.top + stepRect.height / 2;
                const distance = Math.abs(stepCenter - viewportCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestStep = index;
                }
            });

            setActiveStep(closestStep);
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);
        handleScroll(); // Init
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    return (

        <section
            id="methode"
            ref={containerRef}
            className="relative w-full bg-[#0a0a0a] text-white -mt-1 min-h-[200vh]"
        >

            {/* GLOBAL BACKGROUNDS (Fixed) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* LINEAR RHYTHM GRADIENT (Blue at steps, Black in between) */}
                <div
                    className="absolute inset-0 z-0 opacity-40"
                    style={{
                        background: `linear-gradient(to bottom,
                            #0a0a0a 0%,
                            #1e3a8a 16%,
                            #0a0a0a 33%,
                            #1e3a8a 50%,
                            #0a0a0a 67%,
                            #1e3a8a 83%,
                            #0a0a0a 100%
                        )`
                    }}
                />

                {/* Ripple Grid (Full Height) */}
                <div className="sticky top-0 h-screen w-full [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] opacity-60">
                    <Ripple />
                </div>
            </div>

            {/* --- SECTION HEADER (Centered Top) --- */}
            <div className="relative z-20 text-center pt-20 md:pt-32 px-4 mb-24">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
                    <span className="font-jakarta text-xs font-medium text-white/80 uppercase tracking-wider">Notre Méthode</span>
                </div>
                <h2 className="font-clash text-4xl md:text-6xl font-medium text-white mb-6 leading-tight">
                    L'Art de la <span className="text-[#306EE8]">Structure</span>
                </h2>
                <p className="font-jakarta text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Une approche chirurgicale pour transformer le chaos en clarté.
                </p>
            </div>

            {/* STICKY LAYOUT GRID */}
            <div className="relative z-10 flex flex-col md:flex-row w-full max-w-7xl mx-auto">

                {/* LEFT COLUMN: THE UNIFIED VISUAL (STICKY) */}
                {/* Hidden on mobile, or stacked differently? For now assuming Desktop focus */}
                <div className="hidden md:flex w-1/2 h-screen sticky top-0 items-center justify-center p-8 -translate-y-32">
                    <UnifiedMethodVisual parentRef={containerRef} />
                </div>

                {/* RIGHT COLUMN: TEXT BLOCKS + TIMELINE */}
                <div className="w-full md:w-1/2 flex flex-col relative ml-6 md:ml-0">

                    {/* --- THE TIMELINE RAIL (Absolute Left) --- */}
                    <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/10 hidden md:block">
                        {/* THE BEAM (Filling Bar) - Instant update (no transition) to sync with JS events */}
                        <div
                            className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#306EE8] to-[#60A5FA] shadow-[0_0_15px_rgba(48,110,232,0.8)]"
                            style={{ height: `${scrollProgress * 100}%` }}
                        />
                    </div>

                    {steps.map((step, index) => (
                        <div
                            key={index}
                            ref={el => { stepRefs.current[index] = el; }}
                            className={cn(
                                "flex flex-col justify-center px-8 md:pl-20 relative",
                                index === 0 ? "h-[50vh]" : "h-[70vh]"
                            )}
                        >
                            {/* NARRATIVE TIMELINE NODE (Anchored to left border) */}
                            {/* Visible only on Desktop to match the rail */}
                            <div className="absolute left-0 top-1/2 -translate-x-1/2 hidden md:block">
                                <TimelineNode
                                    isActive={activeStep === index}
                                    level={(index + 1) as 1 | 2 | 3}
                                />
                            </div>

                            {/* Step Indicator */}
                            <div className={cn(
                                "inline-flex items-center px-3 py-1 mb-6 rounded-full border border-white/10 bg-white/5 w-fit backdrop-blur-sm transition-all duration-500",
                                activeStep === index ? "border-[#306EE8]/50 bg-[#306EE8]/10" : ""
                            )}>
                                <span className={cn(
                                    "text-xs font-jakarta font-bold mr-2 transition-colors duration-500",
                                    activeStep === index ? "text-[#306EE8]" : "text-white/50"
                                )}>0{index + 1}</span>
                                <span className="text-xs font-jakarta text-white/70 uppercase tracking-wider">{step.title}</span>
                            </div>

                            {/* Title */}
                            <h3 className={cn(
                                "font-clash text-4xl md:text-5xl font-medium mb-6 transition-all duration-500",
                                activeStep === index ? "text-white filter-none opacity-100 translate-x-0" : "text-white/20 blur-[2px] opacity-50"
                            )}>
                                {step.title}
                            </h3>

                            {/* Description */}
                            <p className={cn(
                                "font-jakarta text-lg leading-relaxed max-w-md transition-all duration-500",
                                activeStep === index ? "text-gray-200 filter-none opacity-100" : "text-gray-800 blur-[1px] opacity-40"
                            )}>
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
