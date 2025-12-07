"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Asterisk } from "lucide-react"; // Or use our custom Asterisk component

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface TimelineEntry {
    title: string;
    content: React.ReactNode;
    visual?: React.ReactNode; // New optional visual prop
    className?: string; // Allow custom spacing per item
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!containerRef.current || !progressRef.current) return;

            // Animate the progress line height based on scroll
            gsap.fromTo(progressRef.current,
                { height: "0%" },
                {
                    height: "100%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 40%",
                        end: "bottom 60%", // Adjusted for faster fill
                        scrub: 0, // Instant response
                    }
                }
            );

            // Animate items appearing
            const items = gsap.utils.toArray(".timeline-item");
            items.forEach((item: any) => {
                gsap.fromTo(item,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // Pulse Animation for Points
            const points = gsap.utils.toArray(".timeline-point");
            points.forEach((point: any) => {
                // Ensure GSAP knows about the centering transform
                gsap.set(point, { xPercent: -50, x: 0 });

                gsap.fromTo(point,
                    { scale: 1, boxShadow: "0 0 0px rgba(48, 110, 232, 0)" },
                    {
                        scale: 1.2,
                        boxShadow: "0 0 20px rgba(48, 110, 232, 0.6)",
                        duration: 0.5,
                        repeat: 1,
                        yoyo: true,
                        ease: "power1.inOut",
                        scrollTrigger: {
                            trigger: point,
                            start: "top 50%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // Parallax Animation for Visuals (Radar)
            const visuals = gsap.utils.toArray(".timeline-visual");
            visuals.forEach((visual: any) => {
                gsap.to(visual, {
                    y: -30, // Subtle upward movement (Simulate 1% parallax)
                    rotation: 2, // 1-2 degrees rotation
                    ease: "none",
                    scrollTrigger: {
                        trigger: visual,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-full relative max-w-7xl mx-auto pb-40 pt-40 pointer-events-none">

            {/* Central Line Container */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] h-full bg-neutral-800 -translate-x-1/2 overflow-hidden">
                {/* Progress Gradient Line */}
                <div
                    ref={progressRef}
                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-transparent via-[#306EE8] to-transparent shadow-[0_0_20px_#306EE8]"
                ></div>
            </div>

            {/* Items */}
            <div className="relative">
                {data.map((item, index) => (
                    <div key={index} className={cn("timeline-item flex flex-col md:flex-row gap-10 md:gap-0 relative pt-10 md:pt-40", item.className)}>

                        {/* GLOBAL SECTION GRADIENT (Unified Atmosphere) */}
                        {/* Positioned absolute relative to the item row, large enough to cover visual + text */}
                        <div
                            className="absolute z-0 pointer-events-none mix-blend-screen opacity-60"
                            style={{
                                top: "50%",
                                left: "50%",
                                width: "140vw", // Explicitly wider than container to cover everything
                                height: "180%", // Bleed vertically
                                transform: "translate(-50%, -50%)", // Center on the axis
                                background: "radial-gradient(circle at 50% 50%, rgba(48, 110, 232, 0.12) 0%, rgba(15, 23, 42, 0.15) 30%, transparent 65%)"
                            }}
                        />

                        {/* Center Point (Asterisk) */}
                        {/* Halo updated: shadow-[0_0_60px_rgba(48,110,232,0.08)] -> 8% opacity max as requested */}
                        <div className="timeline-point absolute left-[20px] md:left-1/2 top-10 md:top-40 w-10 h-10 -translate-x-1/2 z-20 flex items-center justify-center bg-[#0a0a0a] border border-white/10 rounded-full shadow-[0_0_60px_rgba(48,110,232,0.08)] transition-all duration-300 pointer-events-auto">
                            <div className="w-2 h-2 rounded-full bg-[#306EE8] shadow-[0_0_10px_#306EE8]" />
                        </div>

                        {/* Left Side (Visual / Animation) */}
                        <div className="hidden md:flex md:w-1/2 pl-12 md:pl-0 md:pr-32 justify-center items-start">
                            {item.visual && (
                                <div className="timeline-visual w-full max-w-[400px] -mt-[180px] pointer-events-auto">
                                    {item.visual}
                                </div>
                            )}
                        </div>

                        {/* Right Side (Title & Content) */}
                        <div className="md:w-1/2 pl-12 md:pl-24 w-full flex flex-col justify-start relative group pointer-events-auto">

                            {/* Permanent subtle gradient (requested: "assombrissement ou éclaircissement de 3%") */}
                            <div className="absolute inset-0 -left-8 -top-8 -bottom-8 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none"></div>

                            <h3 className="text-2xl md:text-4xl font-clash font-medium text-white mb-6 relative z-10">
                                {item.title}
                            </h3>
                            <div className="relative z-10">
                                {item.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
