'use client';

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TechScanner, ScannerState } from "./TechScanner";
import { MagneticWebsite } from "@/components/ui/MagneticWebsite";
import { AutomationNetwork } from "@/components/ui/AutomationNetwork";
import { DNAHelix } from "@/components/ui/DNAHelix";
import { GradientButton } from "@/components/ui/gradient-button";
import { Link } from "next-view-transitions";
import Asterisk from "./Asterisk";

// Generate sparkle particles data (deterministic structure, random values)
interface SparkleParticle {
    width: string;
    height: string;
    top: string;
    left: string;
    animationDuration: string;
    animationDelay: string;
}

const generateSparkles = (count: number): SparkleParticle[] => {
    return Array.from({ length: count }, () => ({
        width: Math.random() > 0.5 ? '2px' : '1px',
        height: Math.random() > 0.5 ? '2px' : '1px',
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${2 + Math.random() * 3}s`,
        animationDelay: `${Math.random() * 2}s`
    }));
};


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
    // Callbacks
    // Callbacks
    onTabChange?: (id: number) => void;
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
    scannerState,
    onTabChange
}: ServiceCardProps) => {
    // Generate sparkles only on client-side to avoid hydration mismatch
    const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);

    useEffect(() => {
        setSparkles(generateSparkles(15));
    }, []);

    return (
        <div
            className={cn(
                "group/card relative w-full max-w-6xl flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl transition-all duration-500 shadow-[0_25px_50px_-12px_rgba(0,0,0,1),_0_0_0_1px_rgba(255,255,255,0.15),_30px_0_60px_-10px_rgba(48,110,232,0.2)] hover:shadow-[0_45px_90px_-15px_rgba(0,0,0,1),_0_0_0_1px_rgba(255,255,255,0.3),_0_0_100px_0_rgba(48,110,232,0.25)]",
                className
            )}
        >
            {/* HOVER PARTICLES (Sparkles) - Generated client-side only */}
            {sparkles.length > 0 && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover/card:opacity-100 transition-opacity duration-700">
                    {sparkles.map((sparkle, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full blur-[0.5px]"
                            style={{
                                width: sparkle.width,
                                height: sparkle.height,
                                top: sparkle.top,
                                left: sparkle.left,
                                opacity: 0,
                                animation: `sparkle ${sparkle.animationDuration} ease-in-out infinite`,
                                animationDelay: sparkle.animationDelay
                            }}
                        />
                    ))}
                </div>
            )}
            <style>
                {`
                @keyframes sparkle {
                    0%, 100% { transform: scale(0) translate(0, 0); opacity: 0; }
                    50% { transform: scale(1) translate(0, 0); opacity: 0.8; }
                }
                `}
            </style>

            {/* BROWSER HEADER */}
            <div className="w-full h-11 bg-[#1a1a1a]/90 border-b border-white/5 flex items-center px-4 gap-4 shrink-0">
                {/* Traffic Lights */}
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]/80" />
                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E]/80" />
                    <div className="w-3 h-3 rounded-full bg-[#28C840]/80" />
                </div>
                {/* TABS NAVIGATION (Replacing URL Bar) */}
                <div className="flex-1 h-full flex items-end justify-center px-4 gap-2">
                    {[
                        { id: 1, label: "01. WEB" },
                        { id: 2, label: "02. TECH" },
                        { id: 3, label: "03. BRAND" }
                    ].map((tab) => (
                        <div
                            key={tab.id}
                            onClick={() => onTabChange?.(tab.id)}
                            className={cn(
                                "group/tab relative h-8 px-5 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono font-medium tracking-wide transition-all duration-300 rounded-t-lg cursor-pointer select-none overflow-hidden",
                                tab.id === id
                                    ? "bg-gradient-to-b from-[#306EE8]/10 to-transparent text-[#306EE8] border-t border-[#306EE8]/30"
                                    : "text-white/30 hover:text-white/80 hover:bg-white/5 border-t border-transparent"
                            )}
                        >
                            {/* ACTIVE PULSING DOT */}
                            {tab.id === id && (
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#306EE8] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#306EE8]"></span>
                                </span>
                            )}

                            {tab.label}

                            {/* HOVER GLOW (Inactive Only) */}
                            {tab.id !== id && (
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/tab:opacity-100 transition-opacity duration-300 blur-sm" />
                            )}
                        </div>
                    ))}
                </div>
                <div className="w-14" /> {/* Balance */}
            </div>

            {/* CONTENT BODY */}
            <div className="relative w-full flex flex-col md:flex-row items-stretch justify-center p-8 gap-8 md:gap-16">

                {/* LEFT: VISUAL CONTAINER (The Stage) */}
                <div className="relative w-full md:w-1/2 flex items-center justify-center">



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
                    <div ref={visualRef} className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-[#020202] border border-white/10 shadow-[inner_0_0_40px_rgba(0,0,0,1),_0_0_0_1px_rgba(0,0,0,1)]">

                        {/* --- CRT SCANLINES EFFECT --- */}
                        <style>
                            {`
                        @keyframes scan-refresh {
                            0% { top: -25%; }
                            100% { top: 100%; }
                        }
                        `}
                        </style>

                        {/* 1. PHYSICAL SCANLINES (The Screen Texture) - Less visible (opacity-15) */}
                        {/* distinct horizontal lines, alternating dark/transparent */}
                        <div
                            className="absolute inset-0 z-40 pointer-events-none opacity-[0.15] mix-blend-overlay"
                            style={{
                                backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 50%, transparent 50%)',
                                backgroundSize: '100% 4px', // 4px hard lines = Classic TV
                            }}
                        />

                        {/* 2. REFRESH BAR (The "Hum" of the screen) - Faster (4s) & Brighter (0.25) */}
                        <div
                            className="absolute left-0 w-full z-30 pointer-events-none"
                            style={{
                                background: 'linear-gradient(to bottom, transparent, rgba(48, 110, 232, 0.25) 50%, transparent)',
                                height: '25%', // A bar passing through
                                animation: 'scan-refresh 6s linear infinite', // Faster refresh
                            }}
                        />

                        {/* 3. VIGNETTE (Tube Curve) */}
                        <div className="absolute inset-0 z-50 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] rounded-lg"></div>

                        {/* Holographic Base / Grid */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#306EE8]/10 to-transparent skew-x-12 opacity-50 pointer-events-none"></div>

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
                        <span className="text-xs font-jakarta text-white/90 uppercase tracking-wider font-semibold">{subtitle.split('// ')[1] || subtitle}</span>
                    </div>

                    {/* TITLE */}
                    <h3 className="font-clash text-2xl md:text-3xl font-bold text-white leading-tight mb-4"
                        style={{ textShadow: '0 0 40px rgba(48,110,232,0.2)' }}>
                        {title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="font-jakarta text-base text-gray-400 leading-relaxed mb-4 max-w-sm min-h-[135px]">
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

                    {/* CTA BUTTONS - Same as Method section */}
                    <div className="mt-auto w-full">
                        {/* Primary CTA */}
                        <Link href="/rendez-vous" className="w-full block">
                            <GradientButton
                                hoverText="C'est parti"
                                className="w-full py-4 text-sm"
                            >
                                Lancer mon projet
                            </GradientButton>
                        </Link>
                    </div>
                </div>
            </div>
        </div >
    );
};
