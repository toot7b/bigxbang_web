"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import Asterisk from "../ui/Asterisk";

gsap.registerPlugin(ScrollTrigger);

// --- Types ---
interface Point {
    id: number;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    label: string;
    description: string;
}

// --- Data: The 6 Major Problems ---
const STARS: Point[] = [
    { id: 1, x: 5, y: 70, label: "Temps Perdu", description: "Des heures gaspillées sur des tâches répétitives." },
    { id: 2, x: 22, y: 20, label: "Complexité", description: "Une stack technique devenue ingérable." },
    { id: 3, x: 35, y: 55, label: "Déshumanisation", description: "L'humain s'efface derrière les process." },
    { id: 4, x: 58, y: 80, label: "Coûts Cachés", description: "Abonnements et maintenance qui s'accumulent." },
    { id: 5, x: 64, y: 35, label: "Stress", description: "La peur constante que tout casse." },
    { id: 6, x: 96, y: 65, label: "Stagnation", description: "Votre croissance plafonne malgré vos efforts." },
];

// Connections between stars (indices) - Sequential chain
const CONNECTIONS = [
    [0, 1], // Temps Perdu -> Complexité
    [1, 2], // Complexité -> Déshumanisation
    [2, 3], // Déshumanisation -> Coûts Cachés
    [3, 4], // Coûts Cachés -> Stress
    [4, 5], // Stress -> Stagnation
];

export default function Problem() {
    const containerRef = useRef<HTMLDivElement>(null);
    const constellationRef = useRef<HTMLDivElement>(null);
    const starsRef = useRef<(HTMLDivElement | null)[]>([]);
    const linesRef = useRef<(SVGLineElement | null)[]>([]);
    const bgStarsRef = useRef<HTMLDivElement>(null);
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);
    const hasInteractedRef = useRef(false); // To track first interaction

    // --- 1. Background Stars Animation (Organic & Dense) ---
    useEffect(() => {
        const ctx = gsap.context(() => {
            const bgContainer = bgStarsRef.current;
            if (bgContainer) {
                bgContainer.innerHTML = '';
                for (let i = 0; i < 200; i++) {
                    const star = document.createElement("div");
                    star.className = "absolute bg-white rounded-full opacity-0";
                    const size = Math.random() * 2 + 1;
                    star.style.width = `${size}px`;
                    star.style.height = `${size}px`;
                    star.style.left = `${Math.random() * 100}%`;
                    star.style.top = `${Math.random() * 80 + 20}%`;
                    star.style.opacity = `${Math.random() * 0.5 + 0.1}`;
                    bgContainer.appendChild(star);

                    gsap.to(star, {
                        y: `random(-30, 30)`,
                        x: `random(-30, 30)`,
                        scale: `random(0.5, 1.5)`,
                        opacity: `random(0.1, 0.7)`,
                        duration: `random(5, 15)`,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut",
                        delay: Math.random() * 10,
                    });
                }
            }
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // --- 2. Major Stars Floating Animation & Line Sync ---
    useEffect(() => {
        const ctx = gsap.context(() => {
            starsRef.current.forEach((star, i) => {
                if (star) {
                    gsap.to(star, {
                        y: `random(-15, 15)`,
                        x: `random(-10, 10)`,
                        duration: `random(6, 10)`,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut",
                        delay: Math.random() * 2,
                    });
                }
            });

            const updateLines = () => {
                if (!constellationRef.current) return;
                const parentRect = constellationRef.current.getBoundingClientRect();

                CONNECTIONS.forEach((pair, i) => {
                    const line = linesRef.current[i];
                    const startStar = starsRef.current[pair[0]];
                    const endStar = starsRef.current[pair[1]];

                    if (line && startStar && endStar) {
                        const startRect = startStar.getBoundingClientRect();
                        const endRect = endStar.getBoundingClientRect();
                        const startX = startRect.left - parentRect.left + startRect.width / 2;
                        const startY = startRect.top - parentRect.top + startRect.height / 2;
                        const endX = endRect.left - parentRect.left + endRect.width / 2;
                        const endY = endRect.top - parentRect.top + endRect.height / 2;

                        line.setAttribute("x1", `${startX}`);
                        line.setAttribute("y1", `${startY}`);
                        line.setAttribute("x2", `${endX}`);
                        line.setAttribute("y2", `${endY}`);
                    }
                });
            };

            gsap.ticker.add(updateLines);
            return () => {
                gsap.ticker.remove(updateLines);
            };
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // --- 3. Hover Interaction (Pull + Glow) ---
    useEffect(() => {
        if (hoveredStar === null) return;

        const ctx = gsap.context(() => {
            const connectedIndices = new Set<number>();
            const connectedLines: SVGLineElement[] = [];

            CONNECTIONS.forEach((pair, index) => {
                if (pair[0] === hoveredStar - 1) {
                    const targetIndex = pair[1];
                    connectedIndices.add(targetIndex);
                    if (linesRef.current[index]) connectedLines.push(linesRef.current[index]!);
                }
            });

            gsap.to(connectedLines, {
                stroke: "rgba(255, 255, 255, 0.8)",
                strokeWidth: 2,
                duration: 0.3,
            });

            connectedIndices.forEach((idx) => {
                const targetStar = starsRef.current[idx];
                const sourceStar = starsRef.current[hoveredStar - 1];

                if (targetStar && sourceStar) {
                    const dx = sourceStar.offsetLeft - targetStar.offsetLeft;
                    const dy = sourceStar.offsetTop - targetStar.offsetTop;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const pullFactor = 15;

                    gsap.to(targetStar, {
                        x: (dx / distance) * pullFactor,
                        y: (dy / distance) * pullFactor,
                        duration: 0.4,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                }
            });
        }, containerRef);

        return () => {
            gsap.to(linesRef.current, {
                stroke: "rgba(255, 255, 255, 0.2)",
                strokeWidth: 1,
                duration: 0.3,
            });

            starsRef.current.forEach((star) => {
                if (star) {
                    gsap.to(star, {
                        y: `random(-15, 15)`,
                        x: `random(-10, 10)`,
                        duration: `random(6, 10)`,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut",
                        delay: 0,
                    });
                }
            });
        };
    }, [hoveredStar]);

    return (
        <section
            id="probleme"
            ref={containerRef}
            className="relative min-h-screen w-full bg-[#0a0a0a] text-white overflow-hidden flex flex-col items-center justify-start pt-32 pb-20"
        >
            {/* Background Stars Container */}
            <div ref={bgStarsRef} className="absolute inset-0 pointer-events-none z-0"></div>

            {/* Nebula Glows (Depth) */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#306EE8] opacity-[0.12] blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900 opacity-[0.15] blur-[150px] rounded-full animate-pulse-slow delay-1000"></div>
                <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-white opacity-[0.05] blur-[100px] rounded-full animate-pulse-slow delay-700"></div>
            </div>

            {/* Top Gradient Transition */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

            {/* Section Header */}
            <div className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto px-4 mb-8">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
                    <span className="font-jakarta text-xs font-medium text-white/80">Le problème</span>
                </div>
                <h2 className="font-clash text-3xl md:text-5xl font-medium text-white mb-6 leading-tight">
                    D'un fonctionnement manuel à un <br className="hidden md:block" />
                    système qui s'exécute <span className="text-[#306EE8]">seul</span>
                </h2>
                <p className="font-jakarta text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    On analyse ce que tu fais. On automatise ce qui se répète. On garde l'humain.
                </p>
            </div>

            {/* Constellation Container */}
            <div ref={constellationRef} className="relative w-full max-w-6xl aspect-[16/9] md:aspect-[2.5/1] z-10">

                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {CONNECTIONS.map(([start, end], i) => (
                        <line
                            key={`${start}-${end}`}
                            ref={(el) => { linesRef.current[i] = el; }}
                            stroke="rgba(255, 255, 255, 0.2)"
                            strokeWidth="1"
                            className="transition-colors duration-300"
                        />
                    ))}
                </svg>

                {/* Stars Nodes */}
                {STARS.map((star, i) => (
                    <div
                        key={star.id}
                        ref={(el) => { starsRef.current[i] = el; }}
                        className="absolute group cursor-pointer"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                        onMouseEnter={() => {
                            setHoveredStar(star.id);
                            if (i === 0) {
                                // Only set interacted if not already done
                                if (!hasInteractedRef.current) {
                                    hasInteractedRef.current = true;
                                    // Force re-render to remove halo
                                    setHoveredStar(null);
                                    setTimeout(() => setHoveredStar(star.id), 0);
                                }
                            }
                        }}
                        onMouseLeave={() => setHoveredStar(null)}
                    >
                        {/* The Star (Asterisk) */}
                        <div className="relative flex items-center justify-center">
                            {/* Glow behind */}
                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>

                            {/* Guidance Glow - First Star Only */}
                            {i === 0 && !hasInteractedRef.current && (
                                <div className="absolute inset-0 -z-10 bg-white blur-lg rounded-full opacity-20 scale-150 animate-pulse pointer-events-none"></div>
                            )}

                            {/* The Icon */}
                            <div className="relative z-10 p-2 transition-transform duration-300 group-hover:scale-110">
                                <Asterisk className="w-6 h-6 md:w-8 md:h-8 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Label & Description (Tooltip-like) */}
                            <div className={cn(
                                "absolute left-1/2 -translate-x-1/2 mt-4 pt-2 w-48 text-center pointer-events-none transition-all duration-300",
                                "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
                                star.y > 80 ? "bottom-full mb-4 mt-0" : "top-full"
                            )}>
                                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl">
                                    <h3 className="font-clash text-sm font-medium text-white mb-1">{star.label}</h3>
                                    <p className="font-jakarta text-xs text-gray-400 leading-tight">{star.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Static Label (Always visible but subtle) */}
                        <div className={cn(
                            "absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap pointer-events-none transition-opacity duration-300",
                            "opacity-60 group-hover:opacity-0", // Hide when tooltip appears
                            star.y > 80 ? "bottom-full mb-8" : "top-full mt-8"
                        )}>
                            <span className="font-clash text-xs tracking-widest uppercase text-gray-500">{star.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
