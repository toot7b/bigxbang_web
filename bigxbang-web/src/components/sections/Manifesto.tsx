"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { cn } from "@/lib/utils";

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

                tl.to(box, {
                    motionPath: {
                        path: path,
                        curviness: 2,
                        autoRotate: true,
                        alignOrigin: [0.5, 0.5]
                    },
                    ease: "none"
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
        <div id="manifesto" className="relative bg-white text-black py-20 overflow-hidden min-h-screen">
            <section ref={sectionRef} className="relative w-full max-w-4xl mx-auto px-4 flex flex-col gap-40">

                {/* HEADLINE (Restored style) */}
                <div className="text-center max-w-4xl px-4 mx-auto">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-black/10 bg-black/5 mb-6">
                        <span className="font-jakarta text-xs font-medium text-black/80">Our Vision</span>
                    </div>
                    <h1 className="font-clash text-3xl md:text-5xl font-medium text-black mb-4">
                        The <span className="text-[#306EE8]">Manifesto</span>
                    </h1>
                    <h2 className="font-jakarta text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
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
                            className="box absolute w-12 h-12 bg-[#306EE8] rounded-xl shadow-[0_0_30px_#306EE8] z-50"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        />
                    </div>

                    {/* POINTS */}
                    {MANIFESTO_ITEMS.map((item, i) => (
                        <div
                            key={i}
                            className={cn(
                                "manifesto-point relative flex items-center gap-6 md:gap-12",
                                // Mobile: Always Left-aligned (flex-row)
                                // Desktop: ZigZag (Alternating)
                                i % 2 === 0
                                    ? "flex-row"
                                    : "flex-row md:flex-row-reverse md:self-end"
                            )}
                        >
                            {/* MARKER (Target) */}
                            <div className="marker w-4 h-4 rounded-full border border-black/20 bg-black/5 flex-shrink-0 relative">
                                <div className="absolute inset-0 bg-black/20 rounded-full animate-ping" />
                            </div>

                            {/* CONTENT */}
                            <div className="p-6 md:p-8 border border-black/10 rounded-2xl bg-white/50 backdrop-blur-sm max-w-md shadow-sm hover:border-[#306EE8]/50 transition-colors">
                                <h3 className="font-clash text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
                                <p className="font-jakarta text-sm md:text-base text-gray-600">{item.desc}</p>
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
