"use client";

import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { cn } from "@/lib/utils";
import Asterisk from "@/components/ui/Asterisk";

// DYNAMIC IMPORTS
const ToolsOrbitShockwave = dynamic(() => import("@/components/ui/ToolsOrbitShockwave"), { ssr: false, loading: () => null });
const ManifestoBlastLine = dynamic(() => import("@/components/ui/ManifestoBlastLine").then(mod => mod.ManifestoBlastLine), { ssr: false, loading: () => null });

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
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const markersRef = useRef<HTMLElement[]>([]); // Added markersRef

    // START POINT VARIABLES
    const startPointRef = useRef<{ active: boolean, scale: number, opacity: number }>({ active: true, scale: 1, opacity: 1 });

    // SHOCKWAVE STATE (WebGL Trigger)
    const [finalShockwaveActive, setFinalShockwaveActive] = useState(false);
    // Ref to track if we already fired it to avoid React loop
    const hasFiredShockwave = useRef(false);

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

                const totalPoints = pointContainers.length;

                // Create a segmented timeline with DIRECT targeting
                // We iterate through each point (destination)
                pointContainers.forEach((container, i) => {
                    const marker = container.querySelector(".marker");
                    if (!marker) return;

                    // ------------------------------------------------------------------
                    // EASING-BASED CURVE SOLUTION
                    // ------------------------------------------------------------------
                    // By animating X and Y with DIFFERENT easing, we create a curved path.
                    // This guarantees exact docking (we set exact x,y) + visual curviness.

                    const target = path[i];

                    // 1. Movement with curved trajectory via asymmetric X/Y easing
                    // X: smooth acceleration/deceleration
                    // Y: more linear progression
                    // The difference creates an arc-like path
                    tl.to(box, {
                        x: target.x,
                        duration: 1.5,
                        ease: "power2.inOut"
                    });
                    tl.to(box, {
                        y: target.y,
                        duration: 1.5,
                        ease: "sine.inOut"
                    }, "<"); // "<" means start at the same time as previous tween

                    // TRIGGER SHOCKWAVE ON FINAL ARRIVAL
                    // We add a callback to the timeline right at the end of the movement of the LAST point.
                    // ">-0.2" means "0.2s before the end of the previous tween".
                    if (i === totalPoints - 1) {
                        tl.call(() => {
                            // Only fire once using the ref to prevent re-trigger on scroll up
                            if (!hasFiredShockwave.current) {
                                hasFiredShockwave.current = true;
                                setFinalShockwaveActive(true);
                                // No timeout - CTA stays visible permanently
                            }
                        }, undefined, ">");
                    }

                    // 2. The "Docking" Pause - Inverse Progressive (Sticky Top -> Fluid Bottom)
                    // "Je veux l'inverse" -> Starts very slow/stuck, accelerates (less stuck) at bottom.
                    // "Accentuate on last two" -> Force drop at end.
                    let pauseDuration = 4.5 - (i * 0.6);
                    if (i >= totalPoints - 2) {
                        pauseDuration = 0.8; // Very fluid finish
                    }
                    tl.to({}, { duration: Math.max(0.5, pauseDuration) });
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

    // Interactive Grid Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        const section = sectionRef.current;
        const box = boxRef.current;

        if (!canvas || !section || !box) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const positionHistory: { x: number; y: number }[] = []; // Trail storage
        const maxHistoryLength = 8; // Short trail
        const markerRadius = 32; // Radius of the big marker circles (w-16 = 64px / 2)

        // Cache markers to avoid querying DOM every frame
        const getMarkers = () => Array.from(document.querySelectorAll('.manifesto-point:not(.initial):not(.ghost) .marker'));

        // Initialize LERP state
        let currentHalfGap = 0;

        const render = () => {
            // Update canvas dimensions to match the FULL section (including scrollable area)
            const parentEl = canvas.parentElement;
            if (parentEl) {
                const targetWidth = parentEl.scrollWidth || parentEl.offsetWidth;
                const targetHeight = parentEl.scrollHeight || parentEl.offsetHeight;
                if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                }
            }

            const width = canvas.width;
            const height = canvas.height;
            const gridSize = 60; // Size of grid cells (pixels)

            ctx.clearRect(0, 0, width, height);

            // Get Box Position relative to Canvas
            const boxRect = box.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();

            // Calculate Box Center relative to Canvas top-left
            const boxX = boxRect.left - canvasRect.left + boxRect.width / 2;
            const boxY = boxRect.top - canvasRect.top + boxRect.height / 2;

            // Update Position History (for trail)
            positionHistory.push({ x: boxX, y: boxY });
            if (positionHistory.length > maxHistoryLength) {
                positionHistory.shift();
            }

            // CALCULATE DISTANCE TO START (Propulsion + Light Logic)
            let dStart = 1000; // Default large
            const startMarker = document.querySelector('.manifesto-start-ring') as HTMLElement;
            if (startMarker) { // We query this once per frame (could be optimized but fine for now)
                const smRect = startMarker.getBoundingClientRect();
                const smX = smRect.left - canvasRect.left + smRect.width / 2;
                const smY = smRect.top - canvasRect.top + smRect.height / 2;
                dStart = Math.sqrt(Math.pow(smX - boxX, 2) + Math.pow(smY - boxY, 2));
            }

            // DRAW GRID
            ctx.lineWidth = 1;

            // DYNAMIC LIGHT RADIUS
            // "Agrandir au dock" -> Large radius at start.
            // "Rétrécir tout doucement" -> Fade out boost over long distance (e.g., 600px).
            const baseRadius = 250;
            const boostRadius = 350; // +350px at start = 600px total
            const fadeDistance = 600; // Shrinks over 600px of movement

            const boostFactor = Math.max(0, 1 - dStart / fadeDistance);
            // Smooth easing (Quadratic) for "tout doucement" feel
            const smoothBoost = boostFactor * boostFactor;

            const reactionRadius = baseRadius + (boostRadius * smoothBoost);

            // 1. Draw Base Grid (Visible everywhere - subtle grey)
            ctx.strokeStyle = "rgba(100, 100, 100, 0.25)";
            ctx.beginPath();
            // Vertical
            for (let x = 0; x <= width; x += gridSize) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
            }
            // Horizontal
            for (let y = 0; y <= height; y += gridSize) {
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
            }
            ctx.stroke();

            // 2. Draw Reactive Cells (The "Reaction")
            // We iterate through cells potentially visible or just all (optimization: viewing frustum)

            // Optimization: Only loop through cells within the reaction radius of the box
            const startCol = Math.max(0, Math.floor((boxX - reactionRadius) / gridSize));
            const endCol = Math.min(Math.ceil(width / gridSize), Math.ceil((boxX + reactionRadius) / gridSize));
            const startRow = Math.max(0, Math.floor((boxY - reactionRadius) / gridSize));
            const endRow = Math.min(Math.ceil(height / gridSize), Math.ceil((boxY + reactionRadius) / gridSize));

            for (let col = startCol; col < endCol; col++) {
                for (let row = startRow; row < endRow; row++) {
                    const cellLeft = col * gridSize;
                    const cellTop = row * gridSize;

                    // Center of the cell
                    const cellCenterX = cellLeft + gridSize / 2;
                    const cellCenterY = cellTop + gridSize / 2;

                    // Distance from Box Center to Cell Center
                    const dist = Math.sqrt(Math.pow(cellCenterX - boxX, 2) + Math.pow(cellCenterY - boxY, 2));

                    if (dist < reactionRadius) {
                        // Opacity based on distance (stronger at center)
                        const opacity = Math.pow(1 - dist / reactionRadius, 2) * 0.4; // Max 0.4 opacity

                        ctx.fillStyle = `rgba(48, 110, 232, ${opacity})`;
                        ctx.fillRect(cellLeft, cellTop, gridSize, gridSize);

                        // Optional: Highlight border of active cells stronger
                        ctx.strokeStyle = `rgba(48, 110, 232, ${opacity * 2})`;
                        ctx.strokeRect(cellLeft, cellTop, gridSize, gridSize);
                    }
                }
            }

            // 3. Draw Simple Trail (line with gradient) - Strictly Outside Circle
            if (positionHistory.length > 2) {
                const circleRadius = 35;
                const currentCenter = positionHistory[positionHistory.length - 1]; // Current box position

                // Find the index of the most recent point that is OUTSIDE the circle
                let lastValidIndex = -1;
                for (let i = positionHistory.length - 2; i >= 0; i--) {
                    const dx = positionHistory[i].x - currentCenter.x;
                    const dy = positionHistory[i].y - currentCenter.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist > circleRadius) {
                        lastValidIndex = i;
                        break;
                    }
                }

                // If we found a point outside, draw the trail
                if (lastValidIndex !== -1) {
                    ctx.lineCap = "round";
                    ctx.beginPath();

                    // Draw from oldest point up to the last valid point outside
                    ctx.moveTo(positionHistory[0].x, positionHistory[0].y);
                    for (let i = 1; i <= lastValidIndex; i++) {
                        ctx.lineTo(positionHistory[i].x, positionHistory[i].y);
                    }

                    // Calculate intersection point on the circle edge
                    const validPoint = positionHistory[lastValidIndex];
                    const dx = validPoint.x - currentCenter.x;
                    const dy = validPoint.y - currentCenter.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Point on circle edge towards the valid point
                    // Vector from Center to Point is (dx, dy). 
                    // Point on edge is Center + normalize(dx, dy) * radius
                    const edgeX = currentCenter.x + (dx / dist) * circleRadius;
                    const edgeY = currentCenter.y + (dy / dist) * circleRadius;

                    ctx.lineTo(edgeX, edgeY);

                    // Gradient
                    const startPos = positionHistory[0];
                    const gradient = ctx.createLinearGradient(startPos.x, startPos.y, edgeX, edgeY);
                    gradient.addColorStop(0, "rgba(48, 110, 232, 0)");
                    gradient.addColorStop(1, "rgba(48, 110, 232, 0.8)");

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 4;
                    ctx.stroke();
                }
            }

            // 4. Draw Circle Around Asterisk (Reacts to markers: Opens up like a "C")
            const markers = getMarkers();
            let closestMarkerDist = Infinity;
            let closestMarkerAngle = 0;

            markers.forEach((marker) => {
                const markerRect = marker.getBoundingClientRect();
                const markerCenterX = markerRect.left - canvasRect.left + markerRect.width / 2;
                const markerCenterY = markerRect.top - canvasRect.top + markerRect.height / 2;

                const dx = markerCenterX - boxX;
                const dy = markerCenterY - boxY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < closestMarkerDist) {
                    closestMarkerDist = dist;
                    closestMarkerAngle = Math.atan2(dy, dx);
                }

                // Interaction Logic: Highlight Text when close
                const textContainer = marker.nextElementSibling as HTMLElement;
                if (textContainer) {
                    // Trigger later (Closer): 55px threshold (Circle opens at 70px, Text lights up at 55px)
                    if (dist < 55) {
                        // Highlight Text
                        textContainer.style.borderColor = "rgba(48, 110, 232, 1)";
                        textContainer.style.boxShadow = "0 0 50px rgba(48, 110, 232, 0.4)"; // Stronger glow
                        textContainer.style.transform = "scale(1.02)"; // Subtle pop
                        textContainer.style.transition = "all 0.3s ease-out";

                        // Highlight Marker (Synced)
                        const markerEl = marker as HTMLElement;
                        markerEl.style.transform = "scale(1.5)";
                        markerEl.style.borderColor = "#306EE8";
                        markerEl.style.boxShadow = "0 0 30px rgba(48,110,232,0.6)";

                    } else {
                        // Reset Text
                        textContainer.style.borderColor = "";
                        textContainer.style.boxShadow = "";
                        textContainer.style.transform = "";

                        // Reset Marker
                        const markerEl = marker as HTMLElement;
                        markerEl.style.transform = "";
                        markerEl.style.borderColor = "";
                        markerEl.style.boxShadow = "";
                    }
                }
            });

            // Calculate dynamic arc with LERP (Smoothing)
            const influenceRadius = 70; // Very close range
            const maxHalfGap = Math.PI / 1.5;
            let targetHalfGap = 0;

            // Determine Target Gap
            if (closestMarkerDist < influenceRadius) {
                const minDist = 50; // Distance of max opening (contact)
                const progress = Math.max(0, Math.min(1, (closestMarkerDist - minDist) / (influenceRadius - minDist)));
                targetHalfGap = (1 - progress) * maxHalfGap;
            } else {
                targetHalfGap = 0;
            }

            // Smoothly interpolate current gap towards target gap
            // Factor 0.05 = Very slow smoothing. 
            currentHalfGap += (targetHalfGap - currentHalfGap) * 0.05;

            // Draw arc
            let startAngle = 0;
            let endAngle = Math.PI * 2;

            if (currentHalfGap > 0.01) { // Only calculate angles if there is a visible gap
                startAngle = closestMarkerAngle + currentHalfGap;
                endAngle = closestMarkerAngle + Math.PI * 2 - currentHalfGap;
            }

            ctx.beginPath();
            ctx.arc(boxX, boxY, 35, startAngle, endAngle);
            ctx.strokeStyle = "rgba(48, 110, 232, 0.6)";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // 5. Handle Start Point "Propulsion" (Launch Pad)
            // When asterisk moves away from start, expand and fade the start ring
            if (startMarker) {
                // Reuse dStart calculated at top
                // Animate based on distance (0 to 100px)
                if (dStart < 150) {
                    // Propulsion effect: As it moves away, scale up and fade out
                    // dStart 0 -> Scale 1, Opacity 1
                    // dStart 100 -> Scale 2.5, Opacity 0
                    const progress = Math.min(1, dStart / 100);
                    const scale = 1 + (progress * 1.5); // 1 -> 2.5
                    const opacity = 1 - Math.pow(progress, 0.5); // Fade out quickly

                    startMarker.style.transform = `scale(${scale})`;
                    startMarker.style.opacity = `${opacity}`;
                    startMarker.style.borderColor = `rgba(48, 110, 232, ${opacity * 0.8})`; // Turn blueish on launch
                } else {
                    startMarker.style.opacity = '0';
                }
            }

            // 6. FINAL SHOCKWAVE TRIGGER (Arrival at CTA)
            // Fix: We calculate distance based on the DOM element directly, since 'path' variable is out of scope here.
            const finalPointEl = document.querySelector('.manifesto-point.final-center') as HTMLElement;
            if (finalPointEl) {
                const fpRect = finalPointEl.getBoundingClientRect();
                const parentRect = canvas.getBoundingClientRect(); // Canvas is absolute inset-0, so it matches frame of reference

                // Canvas coordinates of final point center
                // boxX/boxY are relative to the canvas/page flow? 
                // Wait, boxX/boxY in this loop are derived from `box.getBoundingClientRect()`.
                // So we just need to compare clientRects to be safe, or convert everything to canvas space.

                const boxRect = box.getBoundingClientRect();
                const boxCx = boxRect.left + boxRect.width / 2;
                const boxCy = boxRect.top + boxRect.height / 2;

                const fpCx = fpRect.left + fpRect.width / 2;
                const fpCy = fpRect.top + fpRect.height / 2;

                const distToLast = Math.sqrt(Math.pow(fpCx - boxCx, 2) + Math.pow(fpCy - boxCy, 2));

                // 2-STAGE TRIGGER FOR PERFECT SYNC

                // Stage 1: Visual Contact (50px) - The "Click"
                if (distToLast < 50) {
                    const finalMarker = finalPointEl.querySelector('.marker') as HTMLElement;
                    if (finalMarker) {
                        // TOOLS REFERENCE: bg-[#306EE8] shadow-[0_0_80px_30px_rgba(48,110,232,0.6)]
                        finalMarker.style.borderColor = "rgba(255,255,255,0.1)"; // Ring effect
                        finalMarker.style.boxShadow = "0 0 80px 30px rgba(48,110,232,0.6)"; // Massive Tools-like glow
                        finalMarker.style.backgroundColor = "#306EE8"; // Solid Blue
                        finalMarker.style.transform = "scale(1.1)";
                    }
                } else {
                    // Reset
                    const finalMarker = finalPointEl.querySelector('.marker') as HTMLElement;
                    if (finalMarker) {
                        finalMarker.style.borderColor = "";
                        finalMarker.style.boxShadow = "";
                        finalMarker.style.backgroundColor = "";
                        finalMarker.style.transform = "";
                    }
                }

                // Stage 2: REMOVED (Handled by ScrollTrigger for better sync)
                // The logical pre-fire is now driven by the timeline progress, not the physics loop.
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div id="manifesto" className="relative bg-black text-white py-20 overflow-hidden min-h-screen">
            {/* INTERACTIVE GRID BACKGROUND */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)'
                }}
            />
            {/* Top Gradient: Signature Blue to Black */}
            <div
                className="absolute top-0 left-0 right-0 h-96 z-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, rgba(48, 110, 232, 0.2) 0%, rgba(0,0,0,1) 100%)'
                }}
            />
            <section ref={sectionRef} className="relative w-full max-w-6xl mx-auto px-4 flex flex-col gap-40">

                {/* HEADLINE (Restored style) */}
                <div className="text-center max-w-4xl px-4 mx-auto">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
                        <span className="font-jakarta text-xs font-medium text-white/80">Our Vision</span>
                    </div>
                    <h1 className="font-clash text-3xl md:text-5xl font-medium text-white mb-4">
                        The <span className="text-[#306EE8]">Manifesto</span>
                    </h1>
                    <h2 className="font-jakarta text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Redefining the digital landscape, one pixel at a time.
                    </h2>
                </div>

                {/* VISUAL + ITEMS CONTAINER */}
                <div className="relative flex flex-col gap-64 pb-32">

                    {/* INITIAL CONTAINER (Box starts here) */}
                    <div className="manifesto-point initial relative w-full flex justify-center items-center h-20">
                        {/* START POINT MARKER (Ring) - The "Dock" */}
                        <div className="manifesto-start-ring absolute w-14 h-14 rounded-full border border-white/20 z-10 box-border transition-colors duration-0" />

                        {/* THE MOVING BOX - Z-INDEX 50 */}
                        <div
                            ref={boxRef}
                            className="box absolute w-12 h-12 z-20 flex items-center justify-center p-1"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            {/* Visual Match: White Asterisk with Subtle White Glow */}
                            <Asterisk className="w-full h-full text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                        </div>
                    </div>

                    {/* POINTS */}
                    {MANIFESTO_ITEMS.map((item, i) => (
                        <div
                            key={i}
                            className={cn(
                                "manifesto-point relative flex items-center gap-6 md:gap-16 w-full px-4 md:px-0",
                                // Desktop: ZigZag (Alternating)
                                // i % 2 === 0 (Left): [Marker] [Text] -> Aligned Left
                                // i % 2 !== 0 (Right): [Text] [Marker] -> Aligned Right (via row-reverse)
                                i % 2 === 0
                                    ? "flex-row justify-start"
                                    : "flex-row md:flex-row-reverse justify-start"
                                // justify-start in row-reverse aligns to the RIGHT
                            )}
                        >
                            {/* MARKER (Target) - Animated via CSS (Proximity) */}
                            <div className="marker w-16 h-16 flex-shrink-0 rounded-full border-2 border-gray-600 bg-[#0a0a0a] shadow-[0_0_15px_rgba(255,255,255,0.1)] z-10 transition-all duration-300 ease-out" />

                            {/* CONTENT */}
                            <div className="relative z-30 p-6 md:p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm max-w-md shadow-sm transition-all duration-300">
                                <h3 className="font-clash text-xl md:text-2xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="font-jakarta text-sm md:text-base text-gray-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}

                    {/* Ghost Point: Right aligned (since last item is Left) */}
                    <div className="manifesto-point relative flex items-center gap-12 flex-row md:flex-row-reverse md:self-end opacity-0 pointer-events-none ghost">
                        <div className="marker w-4 h-4" />
                    </div>

                    {/* Final Center Point: Box ends here */}
                    <div className="manifesto-point final-center absolute inset-x-0 bottom-0 flex justify-center items-center pointer-events-none h-20">
                        {/* THE REAL WEBGL SHOCKWAVE (Layered on top) */}
                        <div className="absolute w-[800px] h-[800px] flex items-center justify-center z-50 pointer-events-none">
                            <ToolsOrbitShockwave active={finalShockwaveActive} />
                        </div>
                        {/* BLAST LINE: Fires from asterisk downward */}
                        <div className="absolute w-[300px] h-[280px] top-1/2 z-40 pointer-events-none">
                            <ManifestoBlastLine triggered={finalShockwaveActive} />
                        </div>
                        {/* Invisible marker for spacing -> Now Visible Docking Ring */}
                        <div className="marker w-16 h-16 rounded-full border-2 border-white/20 bg-white/5 z-10 transition-all duration-300" />
                    </div>
                </div>

                {/* CTA TEXT - OUTSIDE the manifesto container, so asterisk stays put */}
                <div className={cn(
                    "relative z-20 pointer-events-auto flex flex-col items-center p-8 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md transition-all duration-700 max-w-lg mx-auto text-center gap-6 mt-16",
                    finalShockwaveActive ? "border-[#306EE8] bg-[#306EE8]/10 shadow-[0_0_60px_rgba(48,110,232,0.3)] translate-y-0 opacity-100" : "translate-y-4 opacity-0 border-white/5"
                )}>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-clash text-2xl font-bold text-white">Prêt au décollage ?</h3>
                        <p className="font-jakarta text-gray-400">Transformons votre vision en système.</p>
                    </div>
                    <button className="px-8 py-3 bg-[#306EE8] hover:bg-[#205ac8] text-white font-clash font-semibold text-lg rounded-full transition-colors shadow-lg shadow-blue-500/30">
                        Start a Project
                    </button>
                </div>

            </section>
        </div>
    );
}
