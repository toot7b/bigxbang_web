"use client";

import { Timeline } from "@/components/ui/timeline";
import { Radar } from "@/components/ui/Radar";
import { ArchFocus } from "@/components/ui/ArchFocus";
import { Ripple } from "@/components/ui/Ripple"; // Import new component
import { ExecutionVisual } from "@/components/ui/ExecutionVisual";
import { useRef } from "react";

export default function Method() {
    const containerRef = useRef<HTMLDivElement>(null);

    const data = [
        {
            title: "Immersion",
            content: (
                <div>
                    <p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
                        Nous analysons votre marque, votre marché et vos concurrents pour identifier votre positionnement unique.
                    </p>
                </div>
            ),
            visual: <Radar />,
        },
        {
            title: "Architecture",
            // Add large margin-top to push this section down
            className: "mt-80",
            content: (
                <div>
                    <p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
                        Nous structurons votre site pour maximiser la conversion et guider l'utilisateur vers l'action.
                    </p>
                </div>
            ),
            visual: <ArchFocus />,
        },
        {
            title: "Exécution",
            className: "mt-80",
            content: (
                <div>
                    <p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
                        Le code est propre, testé, et livré vite. Chaque ligne a une utilité.
                    </p>
                </div>
            ),
            // Placeholder for Step 3
            visual: <ExecutionVisual />,
        },
    ];

    return (
        // Added -mt-1 to seal any subpixel gap between sections
        <section id="methode" ref={containerRef} className="relative w-full bg-[#0a0a0a] text-white flex flex-col items-center justify-start pt-32 pb-20 overflow-hidden -mt-1">

            {/* Top Gradient Transition - Miroir exact du bas de la section précédente pour une continuité parfaite */}
            <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-black via-black/40 to-transparent z-10 pointer-events-none"></div>

            {/* Subtle Blue Ambience (Black -> Blue Tint -> Black) */}
            <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#0a0a0a] via-[#306EE8]/5 to-[#0a0a0a]"></div>

            {/* Premium 'Deep Space' Atmosphere - Radial Focus */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Main ambient glow - Central/Top, softer and deeper */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(30,58,138,0.12),transparent_70%)]"></div>

                {/* Secondary 'Void' depth - Subtle Slate tint for thickness without color saturation */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(15,23,42,0.3)_40%,rgba(0,0,0,1)_100%)]"></div>
            </div>

            {/* Interactive Ripple Grid - Masked for transition */}
            {/* Increased z-index to 10 so it's above gradients but below content (z-20) */}
            <div className="absolute inset-0 z-10 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
                <Ripple />
            </div>

            {/* Section Header */}
            <div className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto px-4 mb-20">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
                    <span className="font-jakarta text-xs font-medium text-white/80">La méthode</span>
                </div>
                <h2 className="font-clash text-3xl md:text-5xl font-medium text-white mb-6 leading-tight">
                    Comment on <span className="text-[#306EE8]">procède</span>
                </h2>
                <p className="font-jakarta text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Une structure claire pour des résultats prévisibles.
                </p>
            </div>

            {/* Timeline Content */}
            <div className="relative z-20 w-full pointer-events-none">
                <Timeline data={data} />
            </div>
        </section>
    );
}
