"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import Asterisk from "@/components/ui/Asterisk";

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

const TimelineItem = ({ item, isLast }: { item: typeof MANIFESTO_ITEMS[0], index: number, isLast: boolean }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll-Linked Animation - démarre bien avant le viewport
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 1.5", "end 0.2"] // Démarre 50% avant le viewport
    });

    // Le wire se dessine de 25% à 55%
    const clipPath = useTransform(
        scrollYProgress,
        [0.25, 0.55],
        ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]
    );

    // Le texte apparaît de 18% à 28%
    const textOpacity = useTransform(scrollYProgress, [0.18, 0.28], [0, 1]);
    const textX = useTransform(scrollYProgress, [0.18, 0.28], [-10, 0]);

    return (
        <div
            ref={containerRef}
            className={cn("flex gap-6 relative", isLast ? "min-h-[150px] pb-0" : "min-h-[400px]")}
        >

            {/* LEFT: TIMELINE COLUMN */}
            <div className="flex flex-col items-center w-12 shrink-0">

                {/* 1. THE NODE (Standard Reveal) */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.4, ease: "backOut" }}
                    className="relative z-20 w-12 h-12 rounded-full border border-[#306EE8] bg-black flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(48,110,232,0.3)]"
                >
                    <Asterisk className="w-5 h-5 text-white" />
                </motion.div>

                {/* 2. THE WIRE (Scroll Linked) */}
                {!isLast && (
                    <div className="flex-1 w-[2px] bg-zinc-900 relative mt-[-1px] mb-[-1px]">
                        <motion.div
                            style={{ clipPath }}
                            className="absolute top-0 left-0 w-full h-full bg-[#306EE8] shadow-[0_0_10px_rgba(48,110,232,0.5)]"
                        />
                    </div>
                )}
            </div>

            {/* RIGHT: TEXT CONTENT (Scroll Linked) */}
            <motion.div
                style={{ opacity: textOpacity, x: textX }}
                className="flex flex-col pt-1 pb-16"
            >
                <h3 className="font-clash text-2xl font-bold text-white mb-4 leading-tight">
                    {item.title}
                </h3>
                <p className="font-jakarta text-zinc-300 text-base leading-relaxed max-w-sm">
                    {item.desc}
                </p>
            </motion.div>

        </div>
    );
};

export function MobileManifesto() {
    return (
        <section className="relative w-full bg-black overflow-hidden pt-10 pb-20 px-6">

            {/* Background Ambience - Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Dual Side Gradients - Matching QuantumFlowBackground */}
                <div
                    className="absolute top-0 left-0 w-[70%] h-[500px]"
                    style={{
                        background: 'radial-gradient(ellipse at 0% -10%, rgba(48, 110, 232, 0.35) 0%, transparent 65%)'
                    }}
                />
                <div
                    className="absolute top-0 right-0 w-[70%] h-[500px]"
                    style={{
                        background: 'radial-gradient(ellipse at 100% -10%, rgba(48, 110, 232, 0.35) 0%, transparent 65%)'
                    }}
                />
                {/* Center Vignette (darker) */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.4) 80%)'
                    }}
                />

                {/* CSS Grid Pattern (Matching Desktop) */}
                <div
                    className="absolute inset-0 opacity-50"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(120, 120, 120, 0.4) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(120, 120, 120, 0.4) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
                    }}
                />
            </div>

            {/* Header */}
            <div className="flex flex-col items-start relative z-10 mb-16">
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm mb-6">
                    <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest">LE MANIFESTO</span>
                </div>
                <h1 className="font-clash text-4xl font-bold text-white mb-6 leading-[1.1]">
                    Le Signal dans <br /><span className="text-[#306EE8]">le Bruit</span>
                </h1>

                <p className="font-jakarta text-base text-zinc-400 leading-relaxed max-w-sm">
                    L'époque est à la saturation. Pour exister, il ne suffit plus de parler plus fort. Il faut parler plus juste. Voici nos convictions.
                </p>
            </div>

            {/* The Timeline Stack */}
            <div className="flex flex-col relative z-10">
                {MANIFESTO_ITEMS.map((item, i) => (
                    <TimelineItem
                        key={i}
                        item={item}
                        index={i}
                        isLast={i === MANIFESTO_ITEMS.length - 1}
                    />
                ))}
            </div>

        </section>
    );
}
