"use client";

import { UnifiedMethodVisual } from "@/components/ui/UnifiedMethodVisual";
import { Ripple } from "@/components/ui/Ripple";
import { TimelineNode } from "@/components/ui/TimelineNode";
import { TimelineBeam } from "@/components/ui/TimelineBeam";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";


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
            // User Feedback: "Beam is in advance". We need to delay it.
            // By subtracting an offset, we effectively make the "virtual scroll" lower.
            const scrollCenter = -rect.top + viewportCenter - (viewportHeight * 0.2); // ~20vh delay

            // Normalize: 0 to 1 over the full container height
            const progress = Math.max(0, Math.min(1, scrollCenter / (totalHeight - viewportHeight * 0.2)));
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
            <div className="relative z-20 text-center pt-8 md:pt-20 px-4 mb-8">
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
                <div className="hidden md:flex w-1/2 h-screen sticky top-0 items-center justify-center p-8">
                    <UnifiedMethodVisual parentRef={containerRef} />
                </div>

                {/* RIGHT COLUMN: TEXT BLOCKS + TIMELINE */}
                <div className="w-full md:w-1/2 flex flex-col relative ml-6 md:ml-0">

                    {/* --- THE TIMELINE RAIL (Absolute Left) --- */}
                    {/* WIDER CONTAINER to allow Bloom/Glow to spill over. Center of beam is at layout x=0 */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 -translate-x-1/2 hidden md:block pointer-events-none">

                        {/* THE ULTRA PREMIUM BEAM (WebGL) */}
                        <TimelineBeam progress={scrollProgress} className="w-full h-full" />

                        {/* --- NODES (Centered on Rail) --- */}
                        {/* Node 1: Immersion (Approx 16.6%) */}
                        <div className="absolute left-1/2 top-[16.6%] -translate-x-1/2 -translate-y-1/2 z-20">
                            <TimelineNode isActive={scrollProgress >= 0.16} level={1} />
                        </div>

                        {/* Node 2: Architecture (50%) */}
                        <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 z-20">
                            <TimelineNode isActive={scrollProgress >= 0.495} level={2} />
                        </div>

                        {/* Node 3: Execution (Approx 83.3%) */}
                        <div className="absolute left-1/2 top-[83.3%] -translate-x-1/2 -translate-y-1/2 z-20">
                            <TimelineNode isActive={scrollProgress >= 0.83} level={3} />
                        </div>
                    </div>



                    {steps.map((step, index) => (
                        <div
                            key={index}
                            ref={el => { stepRefs.current[index] = el; }}
                            className={cn(
                                "flex flex-col justify-center px-8 md:pl-20 relative h-screen",
                                // removed manual margins and variable heights to enforce equidistance
                            )}
                        >


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

            {/* DEBUG HUD - REMOVE BEFORE PRODUCTION */}
            <div className="fixed bottom-4 right-4 z-50 bg-black/80 border border-white/20 p-4 rounded-lg font-mono text-xs text-[#306EE8]">
                <div>SCROLL: {(scrollProgress * 100).toFixed(1)}%</div>
                <div>STEP: {activeStep + 1}</div>
            </div>
        </section>
    );
}
