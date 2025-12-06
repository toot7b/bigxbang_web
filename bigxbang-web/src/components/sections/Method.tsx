"use client";

import { Timeline } from "@/components/ui/timeline";
import { Radar } from "@/components/ui/Radar";
import { useRef } from "react";

export default function Method() {
    const containerRef = useRef<HTMLDivElement>(null);

    const data = [
        {
            title: "Immersion",
            visual: <Radar />,
            content: (
                <div>
                    <p className="font-jakarta text-gray-400 leading-relaxed text-base md:text-lg">
                        On ne commence pas par coder. On commence par <strong>comprendre</strong>.
                        Nous plongeons dans votre business pour identifier les goulots d'étranglement,
                        les tâches répétitives et les opportunités manquées.
                    </p>
                </div>
            ),
        },
        {
            title: "Architecture",
            content: (
                <div>
                    <p className="font-jakarta text-gray-400 leading-relaxed text-base md:text-lg">
                        On conçoit le système. Choix de la stack, base de données, flux de données.
                        Rien n'est laissé au hasard. C'est le plan de bataille.
                    </p>
                </div>
            ),
        },
        {
            title: "Exécution",
            content: (
                <div>
                    <p className="font-jakarta text-gray-400 leading-relaxed text-base md:text-lg">
                        Le code est propre, testé, et livré vite.
                        Chaque ligne a une utilité. Nous construisons votre "machine de guerre" digitale.
                    </p>
                </div>
            ),
        },
    ];

    return (
        // Added -mt-1 to seal any subpixel gap between sections
        <section id="methode" ref={containerRef} className="relative w-full bg-[#0a0a0a] text-white flex flex-col items-center justify-start pt-32 pb-20 overflow-hidden -mt-1">

            {/* Top Gradient Transition - Miroir exact du bas de la section précédente pour une continuité parfaite */}
            <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-black via-black/40 to-transparent z-10 pointer-events-none"></div>

            {/* Subtle Blue Ambience (Black -> Blue Tint -> Black) */}
            <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#0a0a0a] via-[#306EE8]/5 to-[#0a0a0a]"></div>

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
            <div className="relative z-20 w-full">
                <Timeline data={data} />
            </div>
        </section>
    );
}
