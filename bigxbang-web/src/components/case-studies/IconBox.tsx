"use client";

import React from "react";
import dynamic from "next/dynamic";

// Lottie (dynamic import to avoid SSR issues)
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

/**
 * IconBox - Animated Lottie icon in a modern container
 */
export const IconBox = ({
    animation,
    size = "md",
    className = ""
}: {
    animation: object;
    size?: "sm" | "md" | "lg";
    className?: string;
}) => {
    const sizeClasses = {
        sm: "w-9 h-9 p-2 rounded-lg",
        md: "w-12 h-12 p-2.5 rounded-xl",
        lg: "w-16 h-16 p-3 rounded-2xl"
    };

    return (
        <span className={`inline-flex items-center justify-center ${sizeClasses[size]} bg-[#306EE8]/10 border border-[#306EE8]/20 flex-shrink-0 ${className}`}>
            <Lottie animationData={animation} loop={false} className="w-full h-full" />
        </span>
    );
};

/**
 * TechItem - Technology card with Lottie icon
 */
export const TechItem = ({
    name,
    description,
    animation,
    className = ""
}: {
    name: string;
    description: string;
    animation: object;
    className?: string;
}) => (
    <div className={`group bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10 ${className}`}>
        <div className="flex items-center gap-3.5 mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-[#306EE8]/10 rounded-lg p-2">
                <Lottie animationData={animation} loop={false} className="w-full h-full" />
            </div>
            <div className="font-semibold text-white/90">{name}</div>
        </div>
        <div className="text-white/45 text-sm leading-relaxed">{description}</div>
    </div>
);

/**
 * TechItemEmoji - Technology card with emoji fallback
 */
export const TechItemEmoji = ({
    name,
    description,
    emoji,
    className = ""
}: {
    name: string;
    description: string;
    emoji: string;
    className?: string;
}) => (
    <div className={`group bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10 ${className}`}>
        <div className="flex items-center gap-3.5 mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-[#306EE8]/10 rounded-lg text-xl">
                {emoji}
            </div>
            <div className="font-semibold text-white/90">{name}</div>
        </div>
        <div className="text-white/45 text-sm leading-relaxed">{description}</div>
    </div>
);
