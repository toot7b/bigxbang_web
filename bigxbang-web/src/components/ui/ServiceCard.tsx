
import React from "react";
import { cn } from "@/lib/utils";
import { TechScanner, ScannerState } from "./TechScanner";
import { MagneticWebsite } from "@/components/ui/MagneticWebsite";
import { AutomationNetwork } from "@/components/ui/AutomationNetwork";
import { DNAHelix } from "@/components/ui/DNAHelix";
import Asterisk from "./Asterisk";


export interface ServiceCardProps {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    features?: string[];
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

export const ServiceCard = ({
    id,
    title,
    subtitle,
    description,
    features = [],
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
                            <DNAHelix isActive={id === 3} />
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: MINIMAL TYPOGRAPHIC PANEL */}
            <div ref={textRef} className="w-full md:w-2/5 flex flex-col relative pl-6">

                {/* MODULE INDICATOR - Same style as Method section */}
                <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full border border-[#306EE8]/50 bg-[#306EE8]/10 w-fit backdrop-blur-sm">
                    <span className="text-xs font-jakarta font-bold mr-2 text-[#306EE8]">0{id}</span>
                    <span className="text-xs font-jakarta text-white/70 uppercase tracking-wider">{subtitle.split('// ')[1] || subtitle}</span>
                </div>

                {/* TITLE */}
                <h3 className="font-clash text-2xl md:text-3xl font-bold text-white leading-tight mb-4"
                    style={{ textShadow: '0 0 40px rgba(48,110,232,0.2)' }}>
                    {title}
                </h3>

                {/* DESCRIPTION */}
                <p className="font-jakarta text-base text-gray-400 leading-relaxed mb-8 max-w-sm">
                    {description}
                </p>

                {/* FEATURES WITH ASTERISKS */}
                {features.length > 0 && (
                    <div className="space-y-3 mb-8">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#306EE8]/50 border border-[#306EE8] shrink-0">
                                    <Asterisk className="w-3 h-3 text-white" />
                                </div>
                                <span className="font-jakarta text-sm font-medium text-gray-200">{feature}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA BUTTON */}
                <button className="mt-auto px-6 py-3 bg-[#306EE8] hover:bg-[#4080ff] text-white font-jakarta font-medium text-sm rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(48,110,232,0.4)]">
                    En savoir plus
                </button>
            </div>
        </div>
    );
};
