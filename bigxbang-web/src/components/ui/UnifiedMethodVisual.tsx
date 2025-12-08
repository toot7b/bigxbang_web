"use client";

import React, { useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Radar } from "@/components/ui/Radar";
import Asterisk from "@/components/ui/Asterisk";
import { ExecutionVisual } from "@/components/ui/ExecutionVisual";
import { cn } from "@/lib/utils";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface UnifiedMethodVisualProps {
    parentRef: React.RefObject<HTMLDivElement>;
}

export const UnifiedMethodVisual = ({ parentRef }: UnifiedMethodVisualProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // COMPONENTS REFS
    const radarWrapperRef = useRef<HTMLDivElement>(null);
    const executionWrapperRef = useRef<HTMLDivElement>(null);

    // TRANSITION REFS
    const shockwaveRef = useRef<HTMLDivElement>(null);

    // ARCHITECTURE REFS
    const archContainerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
    const particleVisualsRef = useRef<(HTMLDivElement | null)[]>([]);

    // The Visual Group (Triangle + Lines)
    const archVisualsGroupRef = useRef<HTMLDivElement>(null);
    const archLinesRef = useRef<SVGSVGElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Center of the canvas (600x600)
    const center = { x: 300, y: 300 };

    // Define triangle points relative to center (standard scale)
    const points = useMemo(() => {
        // Original logic relative to center.
        // We keep the SAME offsets, just the center moved.
        return {
            top: { x: 0, y: -220 },
            bl: { x: -190, y: 130 },
            br: { x: 190, y: 130 },
            center: { x: 0, y: 0 } // For spokes
        };
    }, []);

    // Also update the DOM element tracking points (JSX uses center + offset?)
    // No, JSX uses "top-1/2 left-1/2" as base (300,300 in DOM container).
    // The Canvas uses "420,420" as base.
    // The visual alignment works because Canvas Center connects to DOM Center.


    // --- CANVAS ELECTRIC SYSTEM ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Pseudo-random noise function (deterministic based on seed+time)
        const noise = (x: number, z: number) => {
            return Math.sin(x * 12.9898 + z * 78.233) * 43758.5453 - Math.floor(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453);
        };

        // --- PREMIUM 3-LAYER RENDER SUB-SYSTEM ---

        // 1. Ghost Prism (Depth)
        const drawGhostStruture = (t: number) => {
            ctx.save();
            ctx.translate(center.x, center.y);
            // Slight rotation for 3D feel
            ctx.rotate(Math.sin(t * 0.0005) * 0.05);
            ctx.scale(0.9, 0.9); // Inner echo

            ctx.beginPath();
            ctx.moveTo(points.top.x, points.top.y);
            ctx.lineTo(points.bl.x, points.bl.y);
            ctx.lineTo(points.br.x, points.br.y);
            ctx.closePath();

            // Increased Opacity for Visibility (0.15 -> 0.4)
            ctx.strokeStyle = "rgba(48, 110, 232, 0.4)";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Subtle Fill to catch the eye
            ctx.fillStyle = "rgba(48, 110, 232, 0.05)";
            ctx.fill();

            // Ghost Spokes (Visible)
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.lineTo(points.top.x, points.top.y);
            ctx.moveTo(0, 0); ctx.lineTo(points.bl.x, points.bl.y);
            ctx.moveTo(0, 0); ctx.lineTo(points.br.x, points.br.y);
            ctx.strokeStyle = "rgba(48, 110, 232, 0.3)";
            ctx.stroke();

            ctx.restore();
        };

        // 2. Orbital Rings (Engineering Precision)
        const drawOrbitalRings = (radius: number, t: number) => {
            ctx.save();
            ctx.translate(center.x, center.y);

            // Ring 1 (Clockwise) - Boosted Visibility
            ctx.beginPath();
            ctx.rotate(t * 0.001);
            ctx.arc(0, 0, radius * 1.8, 0, Math.PI * 2);
            ctx.setLineDash([10, 30]); // Geodesic dashed look
            ctx.strokeStyle = "rgba(48, 110, 232, 0.5)"; // 0.2 -> 0.5
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Ring 2 (Counter-Clockwise, larger)
            ctx.beginPath();
            ctx.rotate(-t * 0.002);
            ctx.arc(0, 0, radius * 2.4, 0, Math.PI * 2);
            ctx.setLineDash([40, 40]);
            ctx.strokeStyle = "rgba(48, 110, 232, 0.3)"; // 0.1 -> 0.3
            ctx.lineWidth = 1.2;
            ctx.stroke();

            ctx.restore();
        };

        // 3. Data Packets (Flow/Organization)
        const drawDataPacket = (p1: { x: number, y: number }, p2: { x: number, y: number }, time: number, offset: number) => {
            // Packets move from P1 (Outer) to P2 (Inner/Ring)
            const cycle = (time + offset) % 1500; // 1.5s cycle
            if (cycle > 1200) return; // Gap bewteen packets

            const progress = cycle / 1200;
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;

            const x = center.x + p1.x + dx * progress;
            const y = center.y + p1.y + dy * progress;

            // Draw Packet (Glowing Dash)
            ctx.beginPath();
            const tailLen = 15;
            const angle = Math.atan2(dy, dx);
            ctx.moveTo(x, y);
            ctx.lineTo(x - Math.cos(angle) * tailLen, y - Math.sin(angle) * tailLen);

            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.stroke();

            // Glow
            ctx.shadowColor = "rgba(48, 110, 232, 1)";
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0; // Reset
        };


        // 4. Electric Field (The "Raw Energy" Circle) - REVERTED TO STABLE
        const drawElectricField = (time: number) => {
            ctx.save();
            ctx.translate(center.x, center.y);

            ctx.globalCompositeOperation = 'lighter';

            const numWaves = 3;
            const maxRadius = 240; // Fits inside 600px

            for (let i = 0; i < numWaves; i++) {
                const phase = (time * 0.0002 + (i / numWaves)) % 1;

                const currentRadius = phase * maxRadius;
                const opacity = 1 - phase;

                if (currentRadius < 40) continue;

                ctx.beginPath();
                const segments = 90;
                for (let j = 0; j <= segments; j++) {
                    const theta = (j / segments) * Math.PI * 2;
                    // Soft distortion (8px)
                    const distortion = noise(j * 0.5, time * 0.001 - i) * 8 * phase;
                    const r = currentRadius + distortion;

                    const x = Math.cos(theta) * r;
                    const y = Math.sin(theta) * r;

                    if (j === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();

                ctx.strokeStyle = `rgba(48, 110, 232, ${opacity * 0.3})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.fillStyle = `rgba(48, 110, 232, ${opacity * 0.08})`;
                ctx.fill();
            }

            ctx.restore();
        };

        const drawLightning = (p1: { x: number, y: number }, p2: { x: number, y: number }, time: number) => {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            const segments = Math.floor(dist / 12);

            ctx.beginPath();
            ctx.moveTo(center.x + p1.x, center.y + p1.y);

            for (let i = 1; i < segments; i++) {
                const progress = i / segments;
                const bx = p1.x + dx * progress;
                const by = p1.y + dy * progress;
                const jitter = (noise(i, time) - 0.5) * 6;

                const jx = Math.cos(angle + Math.PI / 2) * jitter;
                const jy = Math.sin(angle + Math.PI / 2) * jitter;

                ctx.lineTo(center.x + bx + jx, center.y + by + jy);
            }

            ctx.lineTo(center.x + p2.x, center.y + p2.y);

            // Render Styles (Brand Blue)
            ctx.strokeStyle = "rgba(48, 110, 232, 0.4)";
            ctx.lineWidth = 10;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.stroke();

            ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
            ctx.lineWidth = 1.0;
            ctx.stroke();
        };

        const drawElectricCircle = (radius: number, time: number) => {
            ctx.beginPath();
            const segments = 60;
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                const jitter = (noise(i, time) - 0.5) * 3;
                const r = radius + jitter;

                const x = Math.cos(theta) * r;
                const y = Math.sin(theta) * r;

                if (i === 0) ctx.moveTo(center.x + x, center.y + y);
                else ctx.lineTo(center.x + x, center.y + y);
            }
            ctx.closePath();

            // Subtle Ring Style
            ctx.strokeStyle = "rgba(48, 110, 232, 0.3)";
            ctx.lineWidth = 6;
            ctx.stroke();

            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
            ctx.lineWidth = 0.8;
            ctx.stroke();
        };

        // 5. Node Sparks (Feeding the Ring)
        const drawNodeSparks = (centerPt: { x: number, y: number }, time: number) => {
            const ringRadius = 28; // Matches w-14 (56px) -> r=28
            const numSparks = 4; // Increased count for better "feeding" feel

            // A. Electric Ring (Surrounding the node)
            // Pulse the ring based on overall energy
            const ringPulse = 0.3 + Math.abs(Math.sin(time * 0.003)) * 0.2;

            ctx.beginPath();
            const ringSegments = 40;
            for (let i = 0; i <= ringSegments; i++) {
                const theta = (i / ringSegments) * Math.PI * 2;
                // Very subtle jitter for "stable" electric look
                const jitter = (noise(i + centerPt.x, time * 0.05) - 0.5) * 1.5;
                const r = ringRadius + jitter;

                const x = centerPt.x + Math.cos(theta) * r;
                const y = centerPt.y + Math.sin(theta) * r;

                if (i === 0) ctx.moveTo(center.x + x, center.y + y);
                else ctx.lineTo(center.x + x, center.y + y);
            }
            ctx.closePath();
            ctx.strokeStyle = `rgba(48, 110, 232, ${ringPulse})`; // Pulsing blue
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // B. Feeding Sparks (Center -> Ring)
            for (let i = 0; i < numSparks; i++) {
                // Stable rotation
                const baseAngle = (time * 0.0005 + i * (Math.PI * 2 / numSparks));
                // Oscillating angle (no random jitter)
                const angle = baseAngle + Math.sin(time * 0.002 + i) * 0.5; // More movement to hit different spots

                const startR = 12; // Start from edge of Asterisk icon (radius ~12px)
                const endR = ringRadius; // Touch the ring

                const p1 = {
                    x: centerPt.x + Math.cos(angle) * startR,
                    y: centerPt.y + Math.sin(angle) * startR
                };
                const p2 = {
                    x: centerPt.x + Math.cos(angle) * endR,
                    y: centerPt.y + Math.sin(angle) * endR
                };

                // Finer Lightning Draw
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const segments = 6;

                ctx.beginPath();
                ctx.moveTo(center.x + p1.x, center.y + p1.y);

                for (let j = 1; j < segments; j++) {
                    const progress = j / segments;
                    const jitter = (noise(j + i * 10, time * 0.2) - 0.5) * 3;
                    const arc = Math.sin(progress * Math.PI) * 2;

                    const bx = p1.x + dx * progress + Math.cos(angle + Math.PI / 2) * (jitter + arc);
                    const by = p1.y + dy * progress + Math.sin(angle + Math.PI / 2) * (jitter + arc);
                    ctx.lineTo(center.x + bx, center.y + by);
                }
                ctx.lineTo(center.x + p2.x, center.y + p2.y);

                // Spark Stroke
                const sparkOpacity = 0.4 + Math.abs(Math.sin(time * 0.005 + i)) * 0.4;
                ctx.strokeStyle = `rgba(180, 220, 255, ${sparkOpacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();

                // C. THE IMPACT (Feeding Effect)
                // Draw a bright spot where it hits the ring
                if (sparkOpacity > 0.6) { // Only when spark is "hot"
                    ctx.beginPath();
                    ctx.arc(center.x + p2.x, center.y + p2.y, 2 + sparkOpacity * 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${sparkOpacity})`;
                    ctx.fill();

                    // Glow flare
                    ctx.shadowColor = "rgba(48, 110, 232, 1)";
                    ctx.shadowBlur = 10;
                    ctx.stroke(); // Re-stroke ring segment (simulated)
                    ctx.shadowBlur = 0;
                }
            }
        };

        const render = (time: number, deltaTime: number, frame: number) => {
            ctx.clearRect(0, 0, 600, 600);
            const t = Math.floor(frame / 3);
            const realTime = performance.now(); // For smooth orbit/packets

            // PREMIUM LAYERS:

            // 0. Electric Energy Field (Background) is Replacing Ghost/Halo
            drawElectricField(realTime);

            // REMOVED Ghost Prism & Old Aura as requested
            // drawGhostStruture(realTime);
            // drawEnergyEmission(realTime);

            // 2. Orbital Rings (Back) - REMOVED per user request
            const ringRadius = 60;
            // drawOrbitalRings(120, realTime); // Outer orbits

            // 3. Main Electric Structure
            drawElectricCircle(ringRadius, t);

            // Connectors
            const getRingPoint = (target: { x: number, y: number }) => {
                const angle = Math.atan2(target.y, target.x);
                return {
                    x: Math.cos(angle) * ringRadius,
                    y: Math.sin(angle) * ringRadius
                };
            };

            // Outer Triangle
            drawLightning(points.top, points.bl, t + 0);
            drawLightning(points.bl, points.br, t + 100);
            drawLightning(points.br, points.top, t + 200);

            // Inner Spokes
            const pRingTop = getRingPoint(points.top);
            const pRingBL = getRingPoint(points.bl);
            const pRingBR = getRingPoint(points.br);

            drawLightning(pRingTop, points.top, t + 300);
            drawLightning(pRingBL, points.bl, t + 400);
            drawLightning(pRingBR, points.br, t + 500);

            // 4. Data Packets (Overlay)
            // Inject packets moving towards center
            drawDataPacket(points.top, pRingTop, realTime, 0);
            drawDataPacket(points.bl, pRingBL, realTime, 500); // Staggered
            drawDataPacket(points.br, pRingBR, realTime, 1000);

            // 5. Node Sparks (Feeding the Ring)
            // Draw sparks for all 3 nodes
            drawNodeSparks(points.top, realTime);
            drawNodeSparks(points.bl, realTime + 100);
            drawNodeSparks(points.br, realTime + 200);
        };

        gsap.ticker.add(render);

        return () => {
            gsap.ticker.remove(render);
        };

    }, [center, points]); // Added center and points to dependency array

    // --- ARCH DATA (TRIANGLE CONSTELLATION) ---
    const asteriskOutlinePoints = useMemo(() => {
        // Base triangle for asterisk shape (unchanged)
        const basePoints = [
            { x: 0, y: -20 },
            { x: 20, y: 15 },
            { x: -20, y: 15 }
        ];

        // OFFSETS for TRIANGLE Layout + CENTRAL CORE (Maximum Shift)
        const triangleOffsets = [
            { x: 0, y: -220 },   // Top
            { x: -190, y: 130 }, // Bottom Left
            { x: 190, y: 130 },  // Bottom Right
            { x: 0, y: 0 }       // CENTRAL CORE
        ];

        // Combine to created 4 sets of points
        let constellationPoints: { x: number, y: number }[] = [];

        triangleOffsets.forEach(offset => {
            const asteriskSet = basePoints.map(p => ({
                x: p.x + offset.x,
                y: p.y + offset.y
            }));
            constellationPoints = [...constellationPoints, ...asteriskSet];
        });

        return constellationPoints;
    }, []);

    const particles = useMemo(() => {
        const colors = ["bg-white/80", "bg-sky-200/70", "bg-purple-200/70", "bg-indigo-200/70", "bg-slate-200/50"];
        return Array.from({ length: 700 }).map((_, i) => ({
            id: i,
            color: colors[i % colors.length]
        }));
    }, []);


    // --- MAIN TIMELINE & LOGIC ---
    useEffect(() => {
        if (!parentRef.current || !containerRef.current) return;

        const ctx = gsap.context(() => {

            // 1. INITIALIZATION (The "Dust" State)
            particlesRef.current.forEach((p, i) => {
                if (p) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 350;
                    const opacity = 0.3 + Math.random() * 0.5;

                    gsap.set(p, {
                        x: Math.cos(angle) * radius,
                        y: Math.sin(angle) * radius,
                        rotate: angle * (180 / Math.PI),
                        opacity: opacity
                    });
                }
            });

            // Floating Loop
            particleVisualsRef.current.forEach((visual) => {
                if (visual) {
                    gsap.set(visual, { width: 3, height: 2 });
                    gsap.to(visual, {
                        x: () => (Math.random() - 0.5) * 50,
                        y: () => (Math.random() - 0.5) * 50,
                        duration: () => 1.5 + Math.random() * 2,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    });
                }
            });

            // COMPONENT INIT STATE
            gsap.set(radarWrapperRef.current, { opacity: 1, scale: 1 });
            gsap.set(shockwaveRef.current, { scale: 0, opacity: 0 });
            gsap.set(archContainerRef.current, { opacity: 0 });
            gsap.set(archVisualsGroupRef.current, { opacity: 0, scale: 0.8 }); // The Triangle
            gsap.set(executionWrapperRef.current, { opacity: 0, scale: 0.8 });

            // Lines Init (Fix: Remove drawSVG which was hiding lines)
            if (archLinesRef.current) {
                const paths = archLinesRef.current.querySelectorAll('line');
                gsap.set(paths, { opacity: 0 }); // Just opacity
            }


            // Master Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: parentRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                }
            });

            // ============================================
            // 1. IMPLOSION
            // ============================================
            tl.to(radarWrapperRef.current, {
                scale: 0,
                opacity: 0,
                rotate: 90,
                duration: 0.10,
                ease: "power2.in"
            }, 0.30);

            // ============================================
            // 2. SHOCKWAVE (Electric Ring)
            // ============================================
            // ============================================
            // 2. SHOCKWAVE (Electric Ring)
            // ============================================
            tl.to(shockwaveRef.current, {
                opacity: 1,
                duration: 0.02
            }, 0.33);

            tl.to(shockwaveRef.current, {
                scale: 22,
                opacity: 0,
                duration: 0.25,
                ease: "power2.out"
            }, 0.34);

            // ============================================
            // 3. REVEAL (Simple Opacity)
            // ============================================
            // ============================================
            // 3. REVEAL (Simple Opacity)
            // ============================================
            tl.to(archContainerRef.current, {
                opacity: 1,
                duration: 0.15,
                ease: "power1.out"
            }, 0.36);

            // ============================================
            // 4. FORMATION (Morph into Triangle Constellation)
            // ============================================
            const morphCount = Math.min(asteriskOutlinePoints.length, particlesRef.current.length);

            // Converge into 3 Asterisks
            tl.to(particlesRef.current, {
                x: (i) => (i < morphCount) ? asteriskOutlinePoints[i].x : 0,
                y: (i) => (i < morphCount) ? asteriskOutlinePoints[i].y : 0,
                scale: 1,
                rotate: 0,
                duration: 0.15,
                ease: "power2.inOut",
                stagger: { amount: 0.02, from: "random" }
            }, 0.38); // Standard pre-center

            // Clean
            tl.to(particlesRef.current.slice(morphCount), {
                opacity: 0,
                scale: 0.1,
                duration: 0.05
            }, 0.45);

            // Brighten (Pre-peak)
            tl.to(particlesRef.current.slice(0, morphCount), {
                opacity: 1,
                scale: 1.2,
                duration: 0.05,
                ease: "power2.out"
            }, 0.48);

            // SUBSTITUTE: Solid Group Appears - PERFECT MATH TARGET: 50%
            tl.to(archVisualsGroupRef.current, { opacity: 1, scale: 1, duration: 0.1 }, 0.50);
            tl.to(particlesRef.current.slice(0, morphCount), { opacity: 0, duration: 0.1 }, 0.50);

            // CONNECTING LINES (Electric Reveal)
            const lines = archLinesRef.current?.querySelectorAll('line');
            if (lines) {
                tl.to(lines, { opacity: 1, duration: 0.15 }, 0.50); // Sync exactly with target
            }

            // ============================================
            // 5. DECONSTRUCTION (Arch -> Execution)
            // ============================================

            // Reverse Particles (Explode back out)
            // Start dissolving later to hold the shape (approx 0.70)
            tl.to(archVisualsGroupRef.current, { opacity: 0, scale: 0.8, duration: 0.1 }, 0.70);
            tl.to(particlesRef.current.slice(0, morphCount), { opacity: 1, duration: 0.1 }, 0.70);

            tl.to(particlesRef.current, {
                x: () => (Math.random() - 0.5) * 600,
                y: () => (Math.random() - 0.5) * 600,
                scale: 0,
                opacity: 0,
                duration: 0.15,
                ease: "power2.in"
            }, 0.75);

            // Execution Appears (Start at 0.85, fully visible by 0.95 - Center of Step 3)
            tl.to(executionWrapperRef.current, {
                scale: 1,
                opacity: 1,
                duration: 0.15,
                ease: "back.out(1.7)"
            }, 0.95);




        }, parentRef);

        return () => ctx.revert();
    }, [asteriskOutlinePoints, parentRef, center, points]);

    return (
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">

            {/* SVG FILTERS & DEFS */}
            <svg className="absolute w-0 h-0 pointer-events-none">
                <defs>
                    {/* 1. CORE BEAM FILTER (From ExecutionVisual) */}
                    <filter id="core-beam-arch" x="-200%" y="-200%" width="500%" height="500%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" seed="0">
                            <animate attributeName="seed" values="0;100" dur="2s" repeatCount="indefinite" />
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" />
                        <feGaussianBlur stdDeviation="0.5" />
                    </filter>

                    {/* 2. HOT GRADIENT (From ExecutionVisual) */}
                    <linearGradient id="hot-gradient-arch" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#306EE8" />
                        <stop offset="100%" stopColor="#fff" stopOpacity="0.8" />
                    </linearGradient>
                </defs>
            </svg>

            {/* --- 1. RADAR --- */}
            <div ref={radarWrapperRef} className="absolute inset-0 flex items-center justify-center">
                <Radar />
            </div>

            {/* --- 1.5. SHOCKWAVE (CSS) --- */}
            <div
                ref={shockwaveRef}
                className="absolute w-[100px] h-[100px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, transparent 60%, rgba(48, 110, 232, 0.8) 70%, rgba(255, 255, 255, 0.9) 85%, transparent 95%)',
                    boxShadow: '0 0 20px rgba(48, 110, 232, 0.6), inset 0 0 20px rgba(48, 110, 232, 0.6)'
                }}
            />


            {/* --- 2. ARCHITECTURE (TRIANGLE) --- */}
            <div ref={archContainerRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Particles */}
                {particles.map((p, i) => (
                    <div
                        key={p.id}
                        ref={el => { particlesRef.current[i] = el; }}
                        className="absolute flex items-center justify-center"
                    >
                        <div ref={el => { particleVisualsRef.current[i] = el; }} className={`${p.color} rounded-full`} />
                    </div>
                ))}

                {/* SOLID GROUP: 4 Asterisks + Center + Lines */}
                <div ref={archVisualsGroupRef} className="absolute inset-0 flex items-center justify-center">

                    {/* 
                        CANVAS ELECTRIC SYSTEM (Procedural WebGL-lite)
                        User requested "WebGL" to solve SVG inconsistency.
                        This uses HTML5 Canvas to draw procedurally generated lightning bolts 
                        that are MATHEMATICALLY IDENTICAL in style.
                    */}
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={600}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    />

                    {/* 3 OUTER ASTERISKS (Encapsulated in Circles for "Network" feel) */}
                    <div
                        className="absolute flex flex-col items-center justify-center w-14 h-14 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full z-10 shadow-[0_0_15px_rgba(48,110,232,0.3)]"
                        style={{ transform: "translate(0px, -220px)" }}
                    >
                        <Asterisk className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    </div>
                    <div
                        className="absolute flex flex-col items-center justify-center w-14 h-14 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full z-10 shadow-[0_0_15px_rgba(48,110,232,0.3)]"
                        style={{ transform: "translate(-190px, 130px)" }}
                    >
                        <Asterisk className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    </div>
                    <div
                        className="absolute flex flex-col items-center justify-center w-14 h-14 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full z-10 shadow-[0_0_15px_rgba(48,110,232,0.3)]"
                        style={{ transform: "translate(190px, 130px)" }}
                    >
                        <Asterisk className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    </div>
                </div>         {/* CENTRAL CORE ASTERISK */}
                <div className="absolute" style={{ transform: "translate(0px, 0px)" }}>
                    <Asterisk className="w-16 h-16 text-white drop-shadow-[0_0_25px_rgba(48,110,232,0.8)]" />
                </div>
            </div>

            {/* --- 3. EXECUTION --- */}
            <div ref={executionWrapperRef} className="absolute inset-0 flex items-center justify-center">
                <ExecutionVisual />
            </div>
        </div >
    );
};
