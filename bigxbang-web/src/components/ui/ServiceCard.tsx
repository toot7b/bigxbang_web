
import React from "react";
import { cn } from "@/lib/utils";
import { TechScanner, ScannerState } from "./TechScanner";
import { MagneticWebsite } from "@/components/ui/MagneticWebsite";
import { AutomationNetwork } from "@/components/ui/AutomationNetwork";
import { DNAHelix } from "@/components/ui/DNAHelix";


export interface ServiceCardProps {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    stats: { label: string; value: number }[];
    color: string;
    className?: string;

    // REFS for Animation Control (Forwarded from Parent)
    visualRef?: React.RefObject<HTMLDivElement | null>;
    textRef?: React.RefObject<HTMLDivElement | null>;
    scannerRef?: React.RefObject<HTMLDivElement | null>;
    // Passed from Parent Controller
    scannerState?: ScannerState;
}

// --- HERO ASSEMBLY PREVIEW: THE FINAL LAYOUT (CONDENSED) ---
// --- HERO ASSEMBLY PREVIEW: THE FINAL LAYOUT (CONDENSED & PRECISE) ---


export const ServiceCard = ({
    id,
    title,
    subtitle,
    description,
    stats,
    color,
    className,
    visualRef,
    textRef,
    scannerRef,
    scannerState
}: ServiceCardProps) => {

    return (
        <div
            className={cn(
                "relative w-full max-w-6xl flex flex-col md:flex-row items-stretch justify-center p-8 gap-8 md:gap-16 bg-black/50 border border-white/5 rounded-3xl backdrop-blur-sm",
                className
            )}
        >
            {/* LEFT: VISUAL CONTAINER (The Stage) */}
            <div className="relative w-full md:w-1/2 flex items-center justify-center">

                {/* Corner Markers - Logically Attached to the Visual Stage */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-white/20 rounded-tl-sm" ></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-white/20 rounded-tr-sm hidden md:block"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-white/20 rounded-bl-sm"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-white/20 rounded-br-sm hidden md:block"></div>

                {/* SCANNER OVERLAY (The Tech Beam) - Clipped to Frame */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        ref={scannerRef}
                        className="absolute left-0 w-full h-[20%] z-20 opacity-0"
                        style={{ top: '0%' }} // Initial pos
                    >
                        <TechScanner color={color} state={scannerState} />
                    </div>
                </div>

                {/* VISUAL CONTENT WRAPPER */}
                <div ref={visualRef} className="relative w-full flex items-center justify-center">
                    {/* Holographic Base / Grid */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/5 to-transparent skew-x-12 opacity-50 pointer-events-none"></div>

                    {/* THE ASSETS (Holograms) - PRELOADED STACK */}
                    {/* We mount ALL of them to ensure WebGL/Assets are ready. We toggle visibility via CSS. */}
                    <div className="w-full h-full relative flex items-center justify-center">

                        {/* 1. FRONT END (Magnetic Website) */}
                        <div className={`w-full h-full transition-opacity duration-500 ease-in-out ${id === 1 ? 'relative z-10 opacity-100' : 'absolute inset-0 z-0 opacity-0 pointer-events-none'}`}>
                            <MagneticWebsite isActive={id === 1} />
                        </div>

                        {/* 2. AUTOMATION (Network) */}
                        <div className={`w-full h-full transition-opacity duration-500 ease-in-out ${id === 2 ? 'relative z-10 opacity-100' : 'absolute inset-0 z-0 opacity-0 pointer-events-none'}`}>
                            <AutomationNetwork />
                        </div>

                        {/* 3. CORE (DNA Helix) */}
                        <div className={`w-full h-full transition-opacity duration-500 ease-in-out ${id === 3 ? 'relative z-10 opacity-100' : 'absolute inset-0 z-0 opacity-0 pointer-events-none'}`}>
                            {/* Pass isActive prop so it triggers its reveal animation ONLY when visible */}
                            <DNAHelix isActive={id === 3} />
                        </div>

                    </div>
                </div>
            </div >

            {/* RIGHT: SPECS PANEL (The HUD) */}
            < div ref={textRef} className="w-full md:w-1/3 flex flex-col items-start gap-6 relative" >

                {/* Header Tag */}
                < div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md" >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
                    <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: color }}>
                        {subtitle}
                    </span>
                </div >

                {/* Title (Text Unified to White) */}
                < h3 className="font-clash text-2xl md:text-4xl font-medium text-white leading-none" >
                    {title}
                </h3 >

                {/* Description - Static Text */}
                < div className="font-jakarta text-gray-400 leading-relaxed text-xs md:text-sm border-l-2 border-white/10 pl-4 min-h-[5rem]" >
                    {description}
                </div >

                {/* Specs / Stats */}
                < div className="w-full mt-4 space-y-4 bg-white/5 p-6 rounded-lg border border-white/5 backdrop-blur-sm" >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                        <span className="font-mono text-xs text-white/40 uppercase">System Diagnostics</span>
                        <span className="font-mono text-xs text-white/40">V.1.0</span>
                    </div>

                    {
                        stats.map((stat, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between mb-1">
                                    <span className="font-mono text-xs text-white/70 group-hover:text-white transition-colors">
                                        {stat.label}
                                    </span>
                                    <span className="font-mono text-xs text-white/50">
                                        {stat.value}%
                                    </span>
                                </div>
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${stat.value}% `,
                                            backgroundColor: color, // Keep bar color
                                            boxShadow: `0 0 10px ${color} 40`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))
                    }
                </div >

            </div >
        </div >
    );
};
