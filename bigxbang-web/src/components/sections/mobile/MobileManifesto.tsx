"use client";

import React from "react";
import { cn } from "@/lib/utils";

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

export function MobileManifesto() {
    return (
        <section className="relative w-full px-6 py-20 flex flex-col gap-16 bg-white overflow-hidden">

            {/* Header */}
            <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-black/10 bg-black/5 mb-6">
                    <span className="font-jakarta text-xs font-medium text-black/80">MANIFESTO</span>
                </div>
                <h2 className="font-clash text-4xl font-medium text-black mb-4">
                    Le Signal dans le <span className="text-[#306EE8]">Bruit</span>
                </h2>
                <p className="font-jakarta text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                    L'époque est à la saturation. Pour exister, il ne suffit plus de parler plus fort. Il faut parler plus juste. Voici nos convictions.
                </p>
            </div>

            {/* Simpler Vertical Stack for Mobile */}
            <div className="relative flex flex-col gap-12">
                {/* Connecting Line */}
                <div className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-[#306EE8]/20 to-transparent" />

                {MANIFESTO_ITEMS.map((item, i) => (
                    <div key={i} className="relative flex items-start gap-6">
                        {/* Dot Marker - Visual Match: Solid Gray Border */}
                        <div className="relative z-10 flex-shrink-0 mt-1">
                            <div className="w-14 h-14 rounded-full border-2 border-gray-600 bg-[#0a0a0a] shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-500 active:scale-110 active:border-[#306EE8] active:shadow-[0_0_30px_rgba(48,110,232,0.6)]" />
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
