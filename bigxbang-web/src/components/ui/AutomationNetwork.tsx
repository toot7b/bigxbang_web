
"use client"

import React, { forwardRef, useRef, useState, useEffect } from "react"

import { cn } from "@/lib/utils"
// import { AnimatedBeam } from "@/components/magicui/animated-beam" // Removed
import { ElectricCables } from "@/components/ui/ElectricCables"

import { IconAsset2 } from '../icons/IconAsset2';
import { IconAsset3 } from '../icons/IconAsset3';
import { IconAsset4 } from '../icons/IconAsset4';
import { IconAsset5 } from "../icons/IconAsset5";
import { IconAsset6 } from "../icons/IconAsset6";
// import { IconAsset7 } from "../icons/IconAsset7"; - Removed as it's being replaced
import Logo from "./Logo";

const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode; onMouseEnter?: () => void; onMouseLeave?: () => void }
>(({ className, children, onMouseEnter, onMouseLeave }, ref) => {
    return (
        <div
            ref={ref}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={cn(
                "border-white/20 z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white/5 p-3 shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-md transition-transform duration-300 hover:scale-110 cursor-pointer", // Adapted styles for dark mode
                className
            )}
        >
            {children}
        </div>
    )
})

Circle.displayName = "Circle"

export function AutomationNetwork({
    className,
}: {
    className?: string
}) {
    const containerRef = useRef<HTMLDivElement>(null)
    const div1Ref = useRef<HTMLDivElement>(null)
    const div2Ref = useRef<HTMLDivElement>(null)
    const div3Ref = useRef<HTMLDivElement>(null)
    const div4Ref = useRef<HTMLDivElement>(null)
    const div5Ref = useRef<HTMLDivElement>(null); // Brain (center)
    const div6Ref = useRef<HTMLDivElement>(null); // User (right)

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [guideStep, setGuideStep] = useState<number>(0); // 0-3 = input nodes, 4 = brain, 5 = user

    const [positions, setPositions] = useState<{ inputs: { x: number, y: number }[], output: { x: number, y: number }, finalOutput: { x: number, y: number } } | null>(null);

    useEffect(() => {
        const updatePositions = () => {
            if (
                div1Ref.current &&
                div2Ref.current &&
                div3Ref.current &&
                div4Ref.current &&
                div5Ref.current &&
                div6Ref.current &&
                containerRef.current
            ) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const inputRefs = [div1Ref, div2Ref, div3Ref, div4Ref];
                const inputRects = inputRefs.map((ref) => ref.current!.getBoundingClientRect());
                const outputRect = div5Ref.current.getBoundingClientRect();
                const finalOutputRect = div6Ref.current.getBoundingClientRect();

                const getRelativeCenter = (rect: DOMRect) => ({
                    x: rect.left - containerRect.left + rect.width / 2,
                    y: rect.top - containerRect.top + rect.height / 2,
                });

                setPositions({
                    inputs: inputRects.map(getRelativeCenter),
                    output: getRelativeCenter(outputRect),
                    finalOutput: getRelativeCenter(finalOutputRect),
                });
            }
        };

        updatePositions();
        window.addEventListener("resize", updatePositions);
        const resizeObserver = new ResizeObserver(updatePositions);
        if (containerRef.current) resizeObserver.observe(containerRef.current);

        return () => {
            window.removeEventListener("resize", updatePositions);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div
            className={cn(
                "relative flex h-[400px] w-full items-center justify-center overflow-hidden p-6",
                className
            )}
            ref={containerRef}
        >
            {/* THE 3D CABLES LAYER */}
            {positions && (
                <div className="absolute inset-0 pointer-events-none">
                    <ElectricCables
                        activeIndex={hoveredIndex}
                        inputs={positions.inputs}
                        output={positions.output}
                        finalOutput={positions.finalOutput}
                    />
                </div>
            )}

            <div className="relative z-10 grid grid-cols-3 items-center w-full max-w-4xl gap-6 pointer-events-none">
                {/* Left: 4 Input Nodes */}
                <div className="flex flex-col justify-center gap-10 pointer-events-auto justify-self-start">
                    <Circle
                        ref={div1Ref}
                        className={cn(guideStep === 0 && "animate-guide-glow-v2")}
                        onMouseEnter={() => {
                            setHoveredIndex(0);
                            if (guideStep === 0) setGuideStep(1);
                        }}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <IconAsset2 />
                        <div className={cn("absolute top-full mt-2 left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none", hoveredIndex === 0 ? "opacity-100" : "opacity-0")}>
                            <span className="text-white font-clash font-semibold text-sm tracking-wide drop-shadow-md whitespace-nowrap block">Cloud</span>
                        </div>
                    </Circle>
                    <Circle
                        ref={div2Ref}
                        className={cn(guideStep === 1 && "animate-guide-glow-v2")}
                        onMouseEnter={() => {
                            setHoveredIndex(1);
                            if (guideStep === 1) setGuideStep(2);
                        }}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <IconAsset3 />
                        <div className={cn("absolute top-full mt-2 left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none", hoveredIndex === 1 ? "opacity-100" : "opacity-0")}>
                            <span className="text-white font-clash font-semibold text-sm tracking-wide drop-shadow-md whitespace-nowrap block">Data</span>
                        </div>
                    </Circle>
                    <Circle
                        ref={div3Ref}
                        className={cn(guideStep === 2 && "animate-guide-glow-v2")}
                        onMouseEnter={() => {
                            setHoveredIndex(2);
                            if (guideStep === 2) setGuideStep(3);
                        }}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <IconAsset5 />
                        <div className={cn("absolute top-full mt-2 left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none", hoveredIndex === 2 ? "opacity-100" : "opacity-0")}>
                            <span className="text-white font-clash font-semibold text-sm tracking-wide drop-shadow-md whitespace-nowrap block">Messagerie</span>
                        </div>
                    </Circle>
                    <Circle
                        ref={div4Ref}
                        className={cn(guideStep === 3 && "animate-guide-glow-v2")}
                        onMouseEnter={() => {
                            setHoveredIndex(3);
                            if (guideStep === 3) setGuideStep(4);
                        }}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <IconAsset4 />
                        <div className={cn("absolute top-full mt-2 left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none", hoveredIndex === 3 ? "opacity-100" : "opacity-0")}>
                            <span className="text-white font-clash font-semibold text-sm tracking-wide drop-shadow-md whitespace-nowrap block">Projets</span>
                        </div>
                    </Circle>
                </div>

                {/* Center: Brain (Logo) */}
                <div className="flex flex-col justify-center pointer-events-auto justify-self-center">
                    <Circle
                        ref={div5Ref}
                        className={cn(
                            "size-20 border-[#306EE8] bg-[#306EE8]/10 shadow-[0_0_50px_rgba(48,110,232,0.4)]",
                            guideStep === 4 && "animate-guide-glow-v2"
                        )}
                        onMouseEnter={() => {
                            setHoveredIndex(4);
                            if (guideStep === 4) setGuideStep(5);
                        }}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <Logo className="w-full h-full p-2 text-white fill-white" />
                        <div className={cn("absolute top-full mt-4 left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none", hoveredIndex === 4 ? "opacity-100" : "opacity-0")}>
                            <span className="text-white font-clash font-semibold text-sm tracking-wide drop-shadow-md whitespace-nowrap block">Notre Solution</span>
                        </div>
                    </Circle>
                </div>

                {/* Right: User Output */}
                <div className="flex flex-col justify-center pointer-events-auto justify-self-end">
                    <Circle
                        ref={div6Ref}
                        className={cn(
                            "size-20 border-white/20 bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.15)]",
                            guideStep === 5 && "animate-guide-glow-v2"
                        )}
                        onMouseEnter={() => {
                            setHoveredIndex(5);
                            if (guideStep === 5) setGuideStep(6);
                        }}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <Icons.user className="text-white" />
                        <div className={cn("absolute top-full mt-4 left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none", hoveredIndex === 5 ? "opacity-100" : "opacity-0")}>
                            <span className="text-white font-clash font-semibold text-sm tracking-wide drop-shadow-md whitespace-nowrap block">Votre Système</span>
                        </div>
                    </Circle>
                </div>
            </div>
        </div>
    );
};

const Icons = {
    user: ({ className }: { className?: string }) => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("w-full h-full p-2 stroke-white", className)}
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
}
