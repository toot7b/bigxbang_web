"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ScannerState } from "@/components/ui/TechScanner";
import { ElectricCircuitOverlay } from "@/components/ui/ElectricCircuitOverlay";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const SERVICES_DATA = [
    {
        id: 1,
        subtitle: "MODULE 01 // WEB",
        title: "Expérience Web",
        description: "Une interface web immersive qui ne ressemble à rien de connu. Performance maximale, design liquide, impact immédiat.",
        color: "#306EE8",
        features: [
            "Design sur-mesure et unique",
            "Animations fluides et interactives",
            "Optimisation SEO et performance"
        ],
        stats: [
            { label: "Performance", value: 100 },
            { label: "Impact", value: 100 },
            { label: "Scalabilité", value: 80 }
        ]
    },
    {
        id: 2,
        subtitle: "MODULE 02 // AUTOMATION",
        title: "Le Réseau",
        description: "Connectez vos outils. Automatisez les tâches ingrates. Laissez la machine travailler pendant que vous dormez.",
        color: "#306EE8",
        features: [
            "Intégration multi-plateformes",
            "Workflows automatisés 24/7",
            "Monitoring et alertes en temps réel"
        ],
        stats: [
            { label: "Performance", value: 100 },
            { label: "Impact", value: 80 },
            { label: "Scalabilité", value: 100 }
        ]
    },
    {
        id: 3,
        subtitle: "MODULE 03 // BRAND",
        title: "Identité de Marque",
        description: "Créez une identité visuelle forte et cohérente. Du logo aux guidelines, tout ce qu'il faut pour marquer les esprits.",
        color: "#306EE8",
        features: [
            "Logo et charte graphique",
            "Univers visuel unique",
            "Guidelines complètes"
        ],
        stats: [
            { label: "Performance", value: 80 },
            { label: "Impact", value: 100 },
            { label: "Scalabilité", value: 100 }
        ]
    }
];

export default function Services() {
    const sectionRef = useRef<HTMLElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const stRef = useRef<globalThis.ScrollTrigger | null>(null);

    // REFS to control the child components directly (Performance)
    const visualRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const scannerRef = useRef<HTMLDivElement>(null);

    // Flag for "Teleport Mode" to suppress animations during fast scroll/jumps
    const isAutoScrolling = useRef(false);
    const autoScrollTimeout = useRef<NodeJS.Timeout | null>(null);

    // STATE for Content
    const [activeData, setActiveData] = useState(SERVICES_DATA[0]);
    // STATE for Scanner Visuals
    const [scannerState, setScannerState] = useState(ScannerState.IDLE);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!triggerRef.current) return;

            const totalTransitions = SERVICES_DATA.length - 1;
            let currentDisplayedId = SERVICES_DATA[0].id;

            stRef.current = ScrollTrigger.create({
                trigger: sectionRef.current, // Pin the WHOLE section (Header + Cards)
                start: "top top",
                end: "+=4000",
                pin: true,
                scrub: 0.5, // Reduced inertia slightly to help settling
                onUpdate: (self) => {
                    const progress = self.progress * totalTransitions; // 0 -> 2
                    const localProgress = progress % 1; // 0 -> 1

                    // --- TELEPORT MODE GUARD ---
                    // If we are auto-scrolling (clicking tabs), we MUTE all transition effects.
                    // This prevents the scanner from speeding across the screen and prevents tabs from flickering.
                    if (isAutoScrolling.current) {
                        if (scannerRef.current) {
                            scannerRef.current.style.transition = "none";
                            scannerRef.current.style.opacity = "0";
                        }
                        if (visualRef.current) visualRef.current.style.opacity = "1";
                        if (textRef.current) {
                            textRef.current.style.opacity = "1";
                            textRef.current.style.transform = "none";
                        }

                        // CRITICAL: We DO NOT update activeData here. 
                        // It is set manually in handleTabClick to ensure the destination UI is locked.
                        return;
                    }

                    // --- NORMAL SCROLL LOGIC ---

                    // COMPLETE (Burst) at CENTER (0.45-0.55) = Scanner touching asset
                    // SCANNING during movement (0.1-0.9) - Widened range to ensure visibility
                    // IDLE at rest (0-0.1 and 0.9-1.0) = Scanner not visible

                    const distToSwap = Math.abs(localProgress - 0.5);
                    let newState = ScannerState.IDLE;

                    if (distToSwap < 0.05) {
                        // Center zone: Burst when touching asset
                        newState = ScannerState.COMPLETE;
                    } else if (localProgress > 0.2 && localProgress < 0.8) {
                        // Movement zone: Scanner visible and moving
                        newState = ScannerState.SCANNING;
                    } else {
                        // Rest zone: Scanner not visible
                        newState = ScannerState.IDLE;
                    }

                    // Only update if changed to prevent render thrashing
                    setScannerState(prev => prev !== newState ? newState : prev);

                    let transitionStrength = 0;
                    if (distToSwap < 0.25) {
                        transitionStrength = 1 - (distToSwap / 0.25); // 0 -> 1
                    }

                    // ANIMATION LOGIC (Driven by transitionStrength)

                    // 1. Text Fade (Right Side)
                    if (textRef.current) {
                        textRef.current.style.opacity = `${1 - transitionStrength}`;
                        textRef.current.style.transform = `translateY(${transitionStrength * 20}px)`;
                    }

                    // 2. Visual Glitch / Scanner (Left Side)
                    if (visualRef.current && scannerRef.current) {
                        // Ensure transition is restored if it was removed
                        if (scannerRef.current.style.transition === "none") {
                            scannerRef.current.style.transition = "";
                        }

                        // Scanner Position logic (Continuous)
                        let scanPos = -20;
                        if (localProgress > 0.2 && localProgress < 0.8) {
                            scanPos = ((localProgress - 0.2) / 0.6) * 140 - 20;
                        }

                        scannerRef.current.style.top = `${scanPos}%`;
                        scannerRef.current.style.opacity = `${transitionStrength > 0 ? 1 : 0}`;

                        // Glitch Visuals (Opacity Dip ONLY)
                        visualRef.current.style.opacity = `${1 - transitionStrength * 0.8}`;
                    }

                    // 3. DATA SWAP (The Exact Midpoint)
                    const targetIndex = Math.round(progress);
                    const safeIndex = Math.min(Math.max(0, targetIndex), SERVICES_DATA.length - 1);

                    // Only swap data if we are NOT in auto-scroll (handled by guard above, but safe to check)
                    if (SERVICES_DATA[safeIndex].id !== currentDisplayedId) {
                        setActiveData(SERVICES_DATA[safeIndex]);
                        currentDisplayedId = SERVICES_DATA[safeIndex].id;
                    }
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Handle Tab Click -> Scroll to specific section point
    const handleTabClick = (id: number) => {
        if (!stRef.current) return;

        // Clear existing timeout to prevent early unlock if spamming clicks
        if (autoScrollTimeout.current) {
            clearTimeout(autoScrollTimeout.current);
            autoScrollTimeout.current = null;
        }

        // 1. INSTANTLY switch state to target (Locks Tabs & Content)
        const targetData = SERVICES_DATA.find(d => d.id === id);
        if (targetData) setActiveData(targetData);

        // 2. Enable Teleport Mode
        isAutoScrolling.current = true;

        const totalTransitions = SERVICES_DATA.length - 1;
        const targetIndex = id - 1; // 0, 1, 2
        const targetProgress = targetIndex / totalTransitions;

        // Calculate scroll position
        const st = stRef.current;
        const scrollPos = st.start + (st.end - st.start) * targetProgress;

        gsap.to(window, {
            scrollTo: scrollPos,
            duration: 1.2, // Slightly faster for responsiveness
            ease: "power3.inOut",
            onComplete: () => {
                // BUFFER: Keep it locked slightly longer to let scroll scrub settle
                autoScrollTimeout.current = setTimeout(() => {
                    isAutoScrolling.current = false;
                    // Restore transition here safely
                    if (scannerRef.current) scannerRef.current.style.transition = "";
                }, 100);
            }
        });
    };

    return (
        <section ref={sectionRef} className="relative z-10 w-full bg-black text-white py-20 overflow-hidden">
            {/* GRADIENT BACKGROUND */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* 1. MAIN LIGHT */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_110%_100%_at_bottom_left,_#306EE8_0%,_rgba(48,110,232,0.4)_55%,_#000000_100%)]" />

                {/* 2. NOISE TEXTURE */}
                <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {/* 3. ELECTRIC CIRCUIT OVERLAY */}
                <ElectricCircuitOverlay className="z-10" />
            </div>

            {/* Header Area */}
            <div className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto px-4 mb-12 max-h-[15vh]">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
                    <span className="font-jakarta text-xs font-medium text-white/80">Nos Artefacts</span>
                </div>
                <h2 className="font-clash text-3xl md:text-5xl font-medium text-white mb-6 leading-tight">
                    L'Armurerie <span className="text-[#306EE8]">.</span>
                </h2>
                <p className="font-jakarta text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Une suite d'outils de haute technologie pour propulser votre business dans une nouvelle dimension.
                    Choisissez votre équipement.
                </p>
            </div>

            {/* MAIN TRANSITION AREA */}
            <div ref={triggerRef} className="relative h-[80vh] w-full flex items-center justify-center">

                {/* Single Active Card */}
                <ServiceCard
                    id={activeData.id}
                    title={activeData.title}
                    subtitle={activeData.subtitle}
                    description={activeData.description}
                    features={activeData.features}
                    stats={activeData.stats}
                    color={activeData.color}
                    // Ref Forwarding
                    visualRef={visualRef}
                    textRef={textRef}
                    scannerRef={scannerRef}
                    // State Forwarding
                    scannerState={scannerState}
                    // Callbacks
                    onTabChange={handleTabClick}
                />

            </div>

        </section>
    );
}
