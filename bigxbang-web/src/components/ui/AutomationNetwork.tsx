
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
                "border-white/10 z-10 flex size-12 items-center justify-center rounded-full border-2 bg-black/40 p-3 shadow-[0_0_20px_-12px_rgba(255,255,255,0.8)] backdrop-blur-md transition-transform duration-300 hover:scale-110 cursor-pointer", // Adapted styles for dark mode
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
    const div5Ref = useRef<HTMLDivElement>(null)
    const div6Ref = useRef<HTMLDivElement>(null)
    const div7Ref = useRef<HTMLDivElement>(null); // Right Icon

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // NOTE: Div 7 was for user, but we'll focus on the brain (div6) as the target.
    // Actually the demo shows multiple inputs -> div6 (OpenAI) -> div7 (User).
    // I will keep the structure: 5 inputs -> Brain.
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
                div7Ref.current &&
                containerRef.current
            ) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const inputRefs = [div1Ref, div2Ref, div3Ref, div4Ref, div5Ref];
                const inputRects = inputRefs.map((ref) => ref.current!.getBoundingClientRect());
                const outputRect = div6Ref.current.getBoundingClientRect();
                const finalOutputRect = div7Ref.current.getBoundingClientRect();

                const getRelativeCenter = (rect: DOMRect) => ({
                    x: rect.left - containerRect.left + rect.width / 2,
                    y: rect.top - containerRect.top + rect.height / 2,
                });

                const inputs = [
                    { id: 'drive', icon: IconAsset2, label: 'Drive', color: '#34A853', progress: 65 },
                    { id: 'docs', icon: IconAsset3, label: 'Docs', color: '#4285F4', progress: 45 },
                    { id: 'notion', icon: IconAsset4, label: 'Notion', color: '#000000', progress: 30 },
                    { id: 'whatsapp', icon: IconAsset5, label: 'WhatsApp', color: '#25D366', progress: 85 },
                    { id: 'messenger', icon: IconAsset6, label: 'Messenger', color: '#0084FF', progress: 55 },
                ];
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

    // 3D LAYER (Behind everything)
    // Since ElectricCables uses absolute positioning and its own Canvas, we place it first.
    // We only render cables if we have positions

    return (
        <div
            className={cn(
                "relative flex h-full w-full items-center justify-center overflow-hidden p-10",
                className
            )}
            ref={containerRef}
        >
            {/* THE 3D CABLES LAYER - MOVED TO TOP (Background Order) */}
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

            <div className="relative z-10 grid grid-cols-3 items-center w-full max-w-4xl gap-10 pointer-events-none">
                {/* Left Icon - Inputs */}
                <div className="flex flex-col justify-center gap-2 pointer-events-auto justify-self-start">
                    <Circle ref={div1Ref} onMouseEnter={() => setHoveredIndex(0)} onMouseLeave={() => setHoveredIndex(null)}>
                        <IconAsset2 />
                    </Circle>
                    <Circle ref={div2Ref} onMouseEnter={() => setHoveredIndex(1)} onMouseLeave={() => setHoveredIndex(null)}>
                        <IconAsset3 />
                    </Circle>
                    <Circle ref={div3Ref} onMouseEnter={() => setHoveredIndex(2)} onMouseLeave={() => setHoveredIndex(null)}>
                        <IconAsset5 />
                    </Circle>
                    <Circle ref={div4Ref} onMouseEnter={() => setHoveredIndex(3)} onMouseLeave={() => setHoveredIndex(null)}>
                        <IconAsset6 />
                    </Circle>
                    <Circle ref={div5Ref} onMouseEnter={() => setHoveredIndex(4)} onMouseLeave={() => setHoveredIndex(null)}>
                        <IconAsset4 />
                    </Circle>
                </div>

                {/* Center Icon - OpenAI */}
                <div className="flex flex-col justify-center pointer-events-auto justify-self-center">
                    <Circle ref={div6Ref} className="size-20 border-[#306EE8] bg-[#306EE8]/10 shadow-[0_0_50px_rgba(48,110,232,0.4)]">
                        <Logo className="w-full h-full p-2 text-white fill-white" />
                    </Circle>
                </div>

                {/* Right Icon - Final Output */}
                <div className="flex flex-col justify-center pointer-events-auto justify-self-end">
                    <Circle ref={div7Ref} className="size-20 border-white/10 bg-white/5">
                        <Icons.user className="text-white" />
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
