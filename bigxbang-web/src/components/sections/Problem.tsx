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
    labelPos?: "top" | "bottom";
}

// --- Data: The 6 Major Problems ---
const STARS: Point[] = [
    { id: 1, x: 5, y: 70, label: "Le Décalage", description: "Une identité visuelle en dessous de la qualité réelle de vos services." },
    { id: 2, x: 22, y: 20, label: "La Surcharge", description: "Votre expertise est noyée sous des tâches répétitives à faible valeur.", labelPos: "top" },
    { id: 3, x: 35, y: 55, label: "L'Invisibilité", description: "Être excellent dans son métier, mais rester le secret le mieux gardé du marché." },
    { id: 4, x: 58, y: 80, label: "La Fragilité", description: "Un business qui repose entièrement sur votre présence et votre mémoire." },
    { id: 5, x: 64, y: 35, label: "La Friction", description: "Des outils et un site qui compliquent l'expérience client au lieu de la fluidifier.", labelPos: "top" },
    { id: 6, x: 96, y: 65, label: "Le Plafond", description: "Une croissance bloquée, non par manque de talent, mais par saturation technique." },
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
    const shockwavesRef = useRef<(HTMLDivElement | null)[]>([]);
    const bgStarsRef = useRef<HTMLDivElement>(null);
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);
    const [visitedStars, setVisitedStars] = useState<Set<number>>(new Set());

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

    // --- 1.5. Neural Trace Intro Animation ---
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: constellationRef.current,
                    start: "top 60%", // Trigger when section is cleanly in view
                    toggleActions: "play none none reverse"
                },
                onComplete: () => {
                    // Timeline complete
                }
            });

            // Init state: All Hidden
            // Init state: All Hidden
            // Change: Start slightly smaller and blurry for "optical focus" effect (Subtle)
            gsap.set(starsRef.current, { autoAlpha: 0, scale: 0.8, filter: "blur(8px)" });
            gsap.set(linesRef.current, { opacity: 0 }); // DrawSVG removed - using strokeDashoffset instead

            // Sequential Reveal: Star -> Line -> Star -> Line
            starsRef.current.forEach((star, i) => {
                if (!star) return;

                // 1. Reveal Star (Soft Focus)
                tl.to(star, {
                    autoAlpha: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 1.0, // Slower for elegance
                    ease: "power1.out", // Very linear/smooth
                });

                // 2. Reveal Line to NEXT star (if exists)
                if (i < starsRef.current.length - 1) {
                    const line = linesRef.current[i];
                    if (line) {
                        // Simulating a "draw" effect by fading and rapid scale/clip if possible, 
                        // simpler approach: fading in quickly
                        tl.fromTo(line,
                            { opacity: 0, strokeDasharray: 1000, strokeDashoffset: 1000 },
                            {
                                opacity: 1,
                                strokeDashoffset: 0,
                                duration: 0.5,
                                ease: "power1.inOut"
                            }
                        );
                    }
                }
            });

            // 3. Scroll Hint (Handled in onComplete above) -> Removed

        }, containerRef);
        return () => ctx.revert();
    }, []);

    // --- 2. Major Stars Floating Animation & Line Sync ---
    useEffect(() => {
        const ctx = gsap.context(() => {
            starsRef.current.forEach((star, i) => {
                if (star) {
                    gsap.to(star, {
                        y: `random(-10, 10)`,
                        x: `random(-8, 8)`,
                        duration: `random(15, 25)`,
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
                const NODE_RADIUS = 24; // 48px / 2

                CONNECTIONS.forEach((pair, i) => {
                    const line = linesRef.current[i];
                    const startStar = starsRef.current[pair[0]];
                    const endStar = starsRef.current[pair[1]];

                    if (line && startStar && endStar) {
                        const startRect = startStar.getBoundingClientRect();
                        const endRect = endStar.getBoundingClientRect();

                        // Centers relative to SVG container
                        const c1x = startRect.left - parentRect.left + startRect.width / 2;
                        const c1y = startRect.top - parentRect.top + startRect.height / 2;
                        const c2x = endRect.left - parentRect.left + endRect.width / 2;
                        const c2y = endRect.top - parentRect.top + endRect.height / 2;

                        // Calculate Angle
                        const angle = Math.atan2(c2y - c1y, c2x - c1x);

                        // Offset points to stop at the Radius (Blue Ring)
                        // Start point moves OUT towards End
                        const x1 = c1x + Math.cos(angle) * NODE_RADIUS;
                        const y1 = c1y + Math.sin(angle) * NODE_RADIUS;

                        // End point moves IN towards Start
                        const x2 = c2x - Math.cos(angle) * NODE_RADIUS;
                        const y2 = c2y - Math.sin(angle) * NODE_RADIUS;

                        line.setAttribute("x1", `${x1}`);
                        line.setAttribute("y1", `${y1}`);
                        line.setAttribute("x2", `${x2}`);
                        line.setAttribute("y2", `${y2}`);
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

            // Only animate geometry/strokeWidth on hover. 
            // Color is persistent via React state/props loop, but we trigger a width pulse.
            gsap.to(connectedLines, {
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
            // Revert strokeWidth only; keep color if visited logic handles it
            gsap.to(linesRef.current, {
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



    // Removed manual useEffect for scroll hint (moved to GSAP)

    return (
        <section
            id="probleme"
            ref={containerRef}
            data-theme="dark"
            className="relative min-h-screen w-full bg-[#0a0a0a] text-white overflow-hidden flex flex-col items-center justify-start pt-32 pb-20"
        >
            {/* Background Stars Container */}
            <div ref={bgStarsRef} className="absolute inset-0 pointer-events-none z-0"></div>

            {/* Nebula Glows (Depth) - REMOVED overflow-hidden to allow glow to bleed into next section */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#306EE8] opacity-[0.12] blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900 opacity-[0.15] blur-[150px] rounded-full animate-pulse-slow delay-1000"></div>
                <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-white opacity-[0.05] blur-[100px] rounded-full animate-pulse-slow delay-700"></div>
            </div>

            {/* Top Gradient Transition - Plus progressif (h-48) avec une courbe plus douce (via-black/40) */}
            <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-black via-black/40 to-transparent z-10 pointer-events-none"></div>

            {/* Bottom Gradient Transition */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none"></div>

            {/* Section Header */}
            <div className="relative z-20 flex flex-col items-center text-center max-w-7xl mx-auto px-4 mb-8">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
                    <span className="font-jakarta text-xs font-medium text-white/80 uppercase tracking-wider">Le Problème</span>
                </div>
                <h2 className="font-clash text-3xl md:text-5xl font-medium text-white mb-6 leading-tight">
                    Entre ce que vous valez et ce que vous montrez, <br className="hidden md:block" />
                    il y a un <span className="text-[#306EE8]">monde.</span>
                </h2>
                <p className="font-jakarta text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    C'est là que s'efface l'exceptionnel. Vos outils et votre image doivent être à la hauteur de votre expertise.
                </p>
            </div>

            {/* Constellation Container */}
            <div ref={constellationRef} className="relative w-full max-w-6xl aspect-[16/9] md:aspect-[2.5/1] z-10 mt-0">

                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {CONNECTIONS.map(([start, end], i) => {
                        // Check if the source star has been visited. ID = STARS[start].id
                        const isLineActive = visitedStars.has(STARS[start].id);
                        return (
                            <line
                                key={`${start}-${end}`}
                                ref={(el) => { linesRef.current[i] = el; }}
                                stroke={isLineActive ? "rgba(48, 110, 232, 0.8)" : "rgba(255, 255, 255, 0.2)"}
                                strokeWidth="1"
                                strokeLinecap="round" // Clean caps
                                className="transition-colors duration-500"
                            />
                        );
                    })}
                </svg>

                {/* Stars Nodes */}
                {STARS.map((star, i) => {
                    const isVisited = visitedStars.has(star.id);
                    return (
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
                                setVisitedStars(prev => new Set(prev).add(star.id));
                                if (i === 0) {
                                    // Only set interacted if not already done
                                    if (!hasInteractedRef.current) {
                                        hasInteractedRef.current = true;
                                        // Force re-render to remove halo
                                        setHoveredStar(null);
                                        setTimeout(() => setHoveredStar(star.id), 0);
                                    }
                                }

                                // Trigger Shockwave Animation (One-off)
                                const shockwave = shockwavesRef.current[i];
                                if (shockwave) {
                                    gsap.fromTo(shockwave,
                                        { scale: 1, opacity: 0.6, borderColor: "#306EE8" },
                                        { scale: 2.5, opacity: 0, duration: 1.2, ease: "power2.out" }
                                    );
                                }
                            }}
                            onMouseLeave={() => setHoveredStar(null)}
                        >
                            {/* The Star (Asterisk) - NEW DESIGN: Solid Ring Connector */}
                            <div className="relative flex items-center justify-center w-12 h-12">

                                {/* 1. Backdrop Glow (Atmosphere) */}
                                <div className="absolute inset-0 bg-[#306EE8] blur-xl rounded-full scale-50 opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>

                                {/* 1.5 SHOCKWAVE RING (Hidden by default, animated by GSAP) */}
                                <div
                                    ref={(el) => { shockwavesRef.current[i] = el; }}
                                    className="absolute inset-0 rounded-full border border-[#306EE8] opacity-0 pointer-events-none"
                                ></div>

                                {/* 2. Guidance Glow - First Star Only */}
                                {i === 0 && !hasInteractedRef.current && (
                                    <div
                                        className="absolute inset-0 -z-10 rounded-full border border-white/60 animate-ping pointer-events-none"
                                        style={{
                                            animationDuration: '3s',
                                            opacity: 0.2
                                        }}
                                    ></div>
                                )}

                                {/* 3. THE NODE (Solid Core + Blue Ring) */}
                                <div className="relative z-10 w-full h-full rounded-full border border-[#306EE8]/30 group-hover:border-[#306EE8] group-hover:bg-[#306EE8] transition-all duration-300 flex items-center justify-center p-2.5">
                                    <Asterisk className="w-full h-full text-white/60 group-hover:text-white transition-colors duration-300" />
                                </div>

                                {/* Label & Description (Tooltip-like) */}
                                <div className={cn(
                                    "absolute left-1/2 -translate-x-1/2 mt-4 pt-2 w-48 text-center pointer-events-none transition-all duration-300 z-50",
                                    "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
                                    (star.labelPos === "top" || star.y > 80) ? "bottom-full mb-4 mt-0" : "top-full"
                                )}>
                                    <div className="bg-black/80 backdrop-blur-md border border-[#306EE8]/20 rounded-xl p-3 shadow-xl">
                                        <h3 className="font-clash text-sm font-medium text-white mb-1">{star.label}</h3>
                                        <p className="font-jakarta text-xs text-gray-400 leading-tight">{star.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Static Label (Always visible but subtle) */}
                            <div className={cn(
                                "absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap pointer-events-none transition-opacity duration-300",
                                "opacity-60 group-hover:opacity-0", // Hide when tooltip appears
                                (star.labelPos === "top" || star.y > 80) ? "bottom-full mb-8" : "top-full mt-2"
                            )}>
                                <span className="font-clash text-xs tracking-widest uppercase text-gray-500">{star.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

        </section>
    );
}
