"use client";

import dynamic from "next/dynamic";
import { Ripple } from "@/components/ui/Ripple";
import { TimelineNode } from "@/components/ui/TimelineNode";
import { GradientButton } from "@/components/ui/gradient-button";
import { Link } from "next-view-transitions";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLenis } from "lenis/react";
import MethodDetails from "@/components/method/MethodDetails";

// Dynamic imports for heavy WebGL components (speeds up compilation)
const UnifiedMethodVisual = dynamic(
    () => import("@/components/ui/UnifiedMethodVisual").then(mod => mod.UnifiedMethodVisual),
    { ssr: false, loading: () => null }
);
const TimelineBeam = dynamic(
    () => import("@/components/ui/TimelineBeam").then(mod => mod.TimelineBeam),
    { ssr: false, loading: () => null }
);

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Method() {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState(0);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [isMethodOpen, setIsMethodOpen] = useState(false);
    const lenis = useLenis();

    const steps = [
        {
            title: "Le Diagnostic",
            description: "Avant de construire, il faut comprendre. Nous disséquons votre activité pour isoler les racines du problème, bien au-delà du simple symptôme visible."
        },
        {
            title: "La Conception",
            description: "Rien n'est laissé à l'improvisation. Nous dessinons les plans complets de votre système : logiques techniques, parcours utilisateurs et structure de l'information."
        },
        {
            title: "La Fabrication",
            description: "La phase de production pure. Un développement sur-mesure, sans dette technique, où chaque détail est testé pour garantir robustesse et fluidité."
        }
    ];



    // Track Scroll Progress for the Beam
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        // Use GSAP ScrollTrigger to drive the beam
        // This addresses potential conflicts with Lenis or other interactions

        let trigger: ScrollTrigger | undefined;

        const ctx = gsap.context(() => {
            if (!containerRef.current) return;

            trigger = ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top center", // Start when section top hits center (Beam entry)
                end: "bottom center", // End when section bottom hits center
                scrub: true, // Smooth value
                onUpdate: (self) => {
                    // Update Beam Progress with Dual-Speed Calibration
                    // Goal: Sync 55.6% Scroll (User's Point) with 50% Beam (Center Node)
                    const raw = self.progress;
                    let calibrated = 0;
                    const CHECKPOINT_SCROLL = 0.556;
                    const CHECKPOINT_BEAM = 0.50;

                    if (raw <= CHECKPOINT_SCROLL) {
                        // Slow down initial part
                        calibrated = raw * (CHECKPOINT_BEAM / CHECKPOINT_SCROLL);
                    } else {
                        // Speed up second part to catch up to 100%
                        calibrated = CHECKPOINT_BEAM + (raw - CHECKPOINT_SCROLL) * ((1 - CHECKPOINT_BEAM) / (1 - CHECKPOINT_SCROLL));
                    }
                    setScrollProgress(calibrated);

                    // Update Active Step (Text Highlight) - Uses RAW progress or Calibrated?
                    // User said "ne touche pas au bloc de texte". Text highlight is based on 'minDistance' logic below,
                    // which uses bounding clients. This part is INDEPENDENT of scrollProgress state, 
                    // so it remains physically accurate to the scroll position. Perfect.

                    const viewportCenter = window.innerHeight / 2;
                    let closestStep = 0;
                    let minDistance = Infinity;

                    stepRefs.current.forEach((stepEl, index) => {
                        if (!stepEl) return;
                        const stepRect = stepEl.getBoundingClientRect();
                        const stepCenter = stepRect.top + stepRect.height / 2;
                        const distance = Math.abs(stepCenter - viewportCenter);

                        if (distance < minDistance) {
                            minDistance = distance;
                            closestStep = index;
                        }
                    });
                    setActiveStep(closestStep);
                }
            });

            // CTA Reveal Animation

        });

        return () => ctx.revert();
    }, []);

    // Lenis scroll lock when overlay is open
    useEffect(() => {
        if (isMethodOpen) {
            lenis?.stop();
            document.body.style.overflow = 'hidden';
        } else {
            lenis?.start();
            document.body.style.overflow = '';
        }
    }, [isMethodOpen, lenis]);

    return (
        <div id="methode">
            <section
                ref={containerRef}
                data-theme="dark"
                className="relative z-0 w-full bg-[#0a0a0a] text-white -mt-1 min-h-[200vh]"
            >

                {/* GLOBAL BACKGROUNDS (Fixed) */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    {/* Deep Top Gradient for Section Continuity - Progressive Fade */}
                    <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-black via-black/60 to-transparent z-20"></div>

                    {/* Deep Bottom Gradient for Next Section Continuity */}
                    <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-black via-black/60 to-transparent z-20"></div>

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
                        <span className="font-jakarta text-xs font-medium text-white/80 uppercase tracking-wider">La Méthode</span>
                    </div>
                    <h2 className="font-clash text-4xl md:text-6xl font-medium text-white mb-6 leading-tight">
                        L'Art de la <span className="text-[#306EE8]">Structure</span>
                    </h2>
                    <p className="font-jakarta text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        On ne décore pas le vide. Chaque pixel et chaque ligne de code ont une fonction précise.
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
                    <div ref={timelineRef} className="w-full md:w-1/2 flex flex-col relative ml-6 md:ml-0">

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



            </section>

            {/* METHOD DETAILS OVERLAY */}
            <AnimatePresence>
                {isMethodOpen && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed inset-0 z-[200] overflow-y-auto bg-black"
                        data-lenis-prevent
                    >
                        <MethodDetails mode="modal" onClose={() => setIsMethodOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
