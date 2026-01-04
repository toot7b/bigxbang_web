"use client";

import React from "react";
import { cn } from "@/lib/utils";

const MANIFESTO_ITEMS = [
    { title: "Chaos Engineering", desc: "Embrasser l'imprévu." },
    { title: "Pixel Perfection", desc: "L'invisible fait la différence." },
    { title: "Speed Absolute", desc: "La performance est une religion." },
    { title: "User Obsession", desc: "Pour des humains, pas des écrans." },
];

export function MobileManifesto() {
    return (
        <section className="relative w-full px-6 py-20 flex flex-col gap-16 bg-white overflow-hidden">

            {/* Header */}
            <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-black/10 bg-black/5 mb-6">
                    <span className="font-jakarta text-xs font-medium text-black/80">Our Vision</span>
                </div>
                <h2 className="font-clash text-4xl font-medium text-black mb-4">
                    The <span className="text-[#306EE8]">Manifesto</span>
                </h2>
                <p className="font-jakarta text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                    Redefining the digital landscape, one pixel at a time.
                </p>
            </div>

            {/* Simpler Vertical Stack for Mobile */}
            <div className="relative flex flex-col gap-12">
                {/* Connecting Line */}
                <div className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-[#306EE8]/20 to-transparent" />

                {MANIFESTO_ITEMS.map((item, i) => (
                    <div key={i} className="relative flex items-start gap-6">
                        {/* Dot Marker */}
                        <div className="relative z-10 flex-shrink-0 mt-1">
                            <div className="w-8 h-8 rounded-full bg-white border border-black/5 flex items-center justify-center shadow-sm">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#306EE8]" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                            <h3 className="font-clash text-xl font-bold mb-2 text-black">{item.title}</h3>
                            <p className="font-jakarta text-sm text-gray-600 leading-relaxed border-l-2 border-black/5 pl-4 ml-0">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-10" /> {/* Spacer */}
        </section>
    );
}
