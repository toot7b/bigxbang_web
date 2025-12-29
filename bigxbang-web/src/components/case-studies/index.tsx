"use client";

import React from "react";

/**
 * CodeWindow - Modern Mac-style code block
 * Sleeker, with better contrast and hover effects
 */
export const CodeWindow = ({
    title,
    children,
    className = ""
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={`group relative bg-[#0c0c0c] border border-white/[0.08] rounded-2xl overflow-hidden my-10 transition-all duration-500 hover:border-[#306EE8]/30 hover:shadow-[0_0_60px_-12px_rgba(48,110,232,0.25)] ${className}`}>
        {/* Subtle glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#306EE8]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Header with traffic lights */}
        <div className="relative z-10 flex items-center px-5 py-3.5 bg-white/[0.02] border-b border-white/[0.06]">
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]/80" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]/80" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]/80" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 text-xs text-white/35 font-mono tracking-wide">{title}</div>
        </div>

        {/* Code content */}
        <div className="relative z-10 p-6 md:p-8 overflow-x-auto">
            <pre className="font-mono text-[13px] leading-[1.7] text-white/80">{children}</pre>
        </div>
    </div>
);

/**
 * InfoBox - Clean callout with accent bar
 */
export const InfoBox = ({
    title,
    children,
    className = ""
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={`relative bg-[#306EE8]/[0.04] border-l-2 border-[#306EE8] rounded-xl rounded-l-none pl-6 pr-6 py-5 my-8 ${className}`}>
        <div className="font-semibold mb-2 text-white/90 text-sm uppercase tracking-wide">{title}</div>
        <div className="text-white/60 leading-relaxed">{children}</div>
    </div>
);

/**
 * MetricCard - Minimal KPI display
 */
export const MetricCard = ({
    number,
    label,
    className = ""
}: {
    number: string;
    label: string;
    className?: string;
}) => (
    <div className={`group bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10 ${className}`}>
        <div className="text-3xl md:text-4xl font-bold font-clash text-white mb-2 group-hover:text-[#306EE8] transition-colors duration-300">{number}</div>
        <div className="text-xs md:text-sm text-white/45 font-medium uppercase tracking-wide">{label}</div>
    </div>
);

/**
 * ProcessStep - Clean numbered step
 */
export const ProcessStep = ({
    number,
    title,
    description,
    className = ""
}: {
    number: number;
    title: string;
    description: string;
    className?: string;
}) => (
    <div className={`flex gap-5 mb-8 items-start ${className}`}>
        <div className="flex-shrink-0 w-10 h-10 bg-[#306EE8] rounded-xl flex items-center justify-center font-bold text-sm text-white">
            {number}
        </div>
        <div className="flex-1 pt-1">
            <h4 className="font-clash text-lg font-semibold text-white mb-1.5">{title}</h4>
            <p className="text-white/50 text-sm leading-relaxed">{description}</p>
        </div>
    </div>
);

/**
 * SectionTitle - H3 with gradient
 */
export const SectionTitle = ({
    children,
    className = ""
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <h3 className={`font-clash text-xl md:text-2xl font-semibold mb-6 text-white/90 ${className}`}>
        {children}
    </h3>
);

/**
 * Paragraph - Standard text block
 */
export const Paragraph = ({
    children,
    className = ""
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <p className={`text-white/55 text-base md:text-lg leading-relaxed mb-5 font-light ${className}`}>
        {children}
    </p>
);

/**
 * BulletList - Styled unordered list
 */
export const BulletList = ({
    items,
    className = ""
}: {
    items: React.ReactNode[];
    className?: string;
}) => (
    <ul className={`text-white/55 space-y-2.5 mb-8 ${className}`}>
        {items.map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
                <span className="text-[#306EE8] mt-1.5">•</span>
                <span className="flex-1">{item}</span>
            </li>
        ))}
    </ul>
);

/**
 * Strong - Bold text highlight
 */
export const Strong = ({ children }: { children: React.ReactNode }) => (
    <strong className="text-white font-medium">{children}</strong>
);
