"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { cn } from "@/lib/utils";
import Asterisk from "@/components/ui/Asterisk";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

const MANIFESTO_ITEMS = [
    {
        title: "On ne résout pas les problèmes.",
        desc: "On supprime le bruit. Le web est saturé de marques interchangeables et d’interfaces pensées pour des métriques. Chez BigxBang, on fait le tri. On garde ce qui crée du sens. On élimine ce qui décore."
    },
    {
        title: "La stratégie, c’est savoir qui vous êtes.",
        desc: "Vraiment. Pas un positionnement calqué sur la concurrence. Pas une cible abstraite. Une identité réelle. Ce que vous faites mieux que les autres. Pourquoi ça compte. Et pour qui."
    },
    {
        title: "Le design n’est pas de la décoration.",
        desc: "Un bon site ne suit pas les tendances. Il incarne votre identité. Notre style, c’est de ne pas en avoir. Et de révéler le vôtre."
    },
    {
        title: "L’automatisation n’est pas une promesse.",
        desc: "C’est une hygiène. On automatise la répétition pour libérer le temps de penser. La machine gère la mécanique. L’humain garde l’intelligence."
    },
    {
        title: "L’outil amplifie. Il ne pense pas.",
        desc: "Sans intention, IA et automation reproduisent le bruit. Notre rôle est de les rendre lisibles, utiles, élégants. Au service de votre vision. Et avec style."
    },
];

export default function Manifesto() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Wait for layout to settle
            const initAnimation = () => {
                // Ensure DOM is ready
                const box = boxRef.current;
                if (!box || !sectionRef.current) return;

                // Refresh to ensure we read correct positions
                ScrollTrigger.refresh();

                const boxStartRect = box.getBoundingClientRect();
                const boxCenterX = boxStartRect.left + boxStartRect.width / 2;
                const boxCenterY = boxStartRect.top + boxStartRect.height / 2;

                const sectionRect = sectionRef.current.getBoundingClientRect();
                const sectionCenterX = sectionRect.left + sectionRect.width / 2;

                // Select all points (markers) excluding the initial container and the ghost point
                const pointContainers = gsap.utils.toArray<HTMLElement>(".manifesto-point:not(.initial):not(.ghost)");

                const verticalOffset = 80; // pixels to keep the box above text blocks
                const path = pointContainers.map((container) => {
                    const marker = container.querySelector(".marker");
                    if (!marker) return { x: 0, y: 0 };

                    const markerRect = marker.getBoundingClientRect();
                    const markerCenterX = markerRect.left + markerRect.width / 2;
                    const markerCenterY = markerRect.top + markerRect.height / 2;

                    return {
                        x: markerCenterX - boxCenterX,
                        y: markerCenterY - boxCenterY
                    };
                });

                if (path.length === 0) return;

                // Reset
                gsap.killTweensOf(box);

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".manifesto-point.initial",
                        start: "top center",
                        endTrigger: sectionRef.current,
                        end: "bottom bottom",
                        scrub: 1,
                    }
                });

                const totalPoints = pointContainers.length;

                // Create a segmented timeline with DIRECT targeting
                // We iterate through each point (destination)
                pointContainers.forEach((container, i) => {
                    const marker = container.querySelector(".marker");
                    if (!marker) return;

                    // ------------------------------------------------------------------
                    // EASING-BASED CURVE SOLUTION
                    // ------------------------------------------------------------------
                    // By animating X and Y with DIFFERENT easing, we create a curved path.
                    // This guarantees exact docking (we set exact x,y) + visual curviness.

                    const target = path[i];

                    // 1. Movement with curved trajectory via asymmetric X/Y easing
                    // X: smooth acceleration/deceleration
                    // Y: more linear progression
                    // The difference creates an arc-like path
                    tl.to(box, {
                        x: target.x,
                        duration: 1.5,
                        ease: "power2.inOut"
                    });
                    tl.to(box, {
                        y: target.y,
                        duration: 1.5,
                        ease: "sine.inOut"
                    }, "<"); // "<" means start at the same time as previous tween

                    // 2. Activate Marker (Just before arrival)
                    tl.to(marker, {
                        scale: 1.5,
                        borderColor: "#306EE8",
                        boxShadow: "0 0 30px rgba(48,110,232,0.6)",
                        duration: 0.2,
                        ease: "back.out(1.7)"
                    }, "-=0.25");

                    // 3. The "Docking" Pause - Inverse Progressive (Sticky Top -> Fluid Bottom)
                    // "Je veux l'inverse" -> Starts very slow/stuck, accelerates (less stuck) at bottom.
                    // "Accentuate on last two" -> Force drop at end.
                    let pauseDuration = 4.5 - (i * 0.6);
                    if (i >= totalPoints - 2) {
                        pauseDuration = 0.8; // Very fluid finish
                    }
                    tl.to({}, { duration: Math.max(0.5, pauseDuration) });

                    // 4. Reduce Marker intensity when leaving (at start of next segment)
                    // We'll queue this to happen right after the pause
                    tl.to(marker, {
                        scale: 1,
                        borderColor: "rgba(75, 85, 99, 1)", // gray-600
                        boxShadow: "0 0 15px rgba(0,0,0,0.2)",
                        duration: 0.3
                    });
                });
            };

            // Init with small delay to ensure layout
            const timer = setTimeout(initAnimation, 500);
            window.addEventListener("resize", initAnimation);

            return () => {
                clearTimeout(timer);
                window.removeEventListener("resize", initAnimation);
            };

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div id="manifesto" className="relative bg-black text-white py-20 overflow-hidden min-h-screen">
            {/* Top Gradient: Signature Blue to Black */}
            <div
                className="absolute top-0 left-0 right-0 h-96 z-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, rgba(48, 110, 232, 0.2) 0%, rgba(0,0,0,1) 100%)'
                }}
            />
            <section ref={sectionRef} className="relative w-full max-w-6xl mx-auto px-4 flex flex-col gap-40">

                {/* HEADLINE (Restored style) */}
                <div className="text-center max-w-4xl px-4 mx-auto">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
                        <span className="font-jakarta text-xs font-medium text-white/80">Our Vision</span>
                    </div>
                    <h1 className="font-clash text-3xl md:text-5xl font-medium text-white mb-4">
                        The <span className="text-[#306EE8]">Manifesto</span>
                    </h1>
                    <h2 className="font-jakarta text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Redefining the digital landscape, one pixel at a time.
                    </h2>
                </div>

                {/* VISUAL + ITEMS CONTAINER */}
                <div className="relative flex flex-col gap-64 pb-64">

                    {/* INITIAL CONTAINER (Box starts here) */}
                    <div className="manifesto-point initial relative w-full flex justify-center items-center h-20">
                        {/* THE MOVING BOX - Z-INDEX 50 */}
                        <div
                            ref={boxRef}
                            className="box absolute w-12 h-12 z-20 flex items-center justify-center p-1"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            {/* Visual Match: White Asterisk with Blue Glow to stand out on white bg */}
                            <Asterisk className="w-full h-full text-white drop-shadow-[0_0_15px_rgba(48,110,232,0.9)]" />
                        </div>
                    </div>

                    {/* POINTS */}
                    {MANIFESTO_ITEMS.map((item, i) => (
                        <div
                            key={i}
                            className={cn(
                                "manifesto-point relative flex items-center gap-6 md:gap-16 w-full px-4 md:px-0",
                                // Desktop: ZigZag (Alternating)
                                // i % 2 === 0 (Left): [Marker] [Text] -> Aligned Left
                                // i % 2 !== 0 (Right): [Text] [Marker] -> Aligned Right (via row-reverse)
                                i % 2 === 0
                                    ? "flex-row justify-start"
                                    : "flex-row md:flex-row-reverse justify-start"
                                // justify-start in row-reverse aligns to the RIGHT
                            )}
                        >
                            {/* MARKER (Target) - Animated via GSAP (ScrollTrigger) */}
                            <div className="marker w-16 h-16 flex-shrink-0 rounded-full border-2 border-gray-600 bg-[#0a0a0a] shadow-[0_0_15px_rgba(255,255,255,0.1)] z-10" />

                            {/* CONTENT */}
                            <div className="relative z-30 p-6 md:p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm max-w-md shadow-sm hover:border-[#306EE8]/50 transition-colors">
                                <h3 className="font-clash text-xl md:text-2xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="font-jakarta text-sm md:text-base text-gray-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}

                    {/* Ghost Point: Right aligned (since last item is Left) */}
                    <div className="manifesto-point relative flex items-center gap-12 flex-row md:flex-row-reverse md:self-end opacity-0 pointer-events-none ghost">
                        <div className="marker w-4 h-4" />
                    </div>

                    {/* Final Center Point: Box should end here (invisible, centered) */}
                    <div className="manifesto-point final-center absolute inset-x-0 bottom-0 flex justify-center items-center pointer-events-none opacity-0 h-20">
                        <div className="marker w-4 h-4" />
                    </div>
                </div>

            </section>
        </div>
    );
}
