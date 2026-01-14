"use client";

import React from "react";

/**
 * EmailTemplate - Modern email preview mockup
 */
export interface EmailTask {
    title: string;
    description: string;
}

export const EmailTemplate = ({
    title = "Bienvenue à bord",
    greeting,
    intro,
    tasks,
    ctaText = "Planifier le kick-off",
    ctaUrl = "/rendez-vous",
    footerItems = ["Guide de démarrage en pièce jointe", "Support disponible 7j/7"],
    signature = "L'équipe bigxbang",
    className = ""
}: {
    title?: string;
    greeting: string;
    intro: string;
    tasks: EmailTask[];
    ctaText?: string;
    ctaUrl?: string;
    footerItems?: string[];
    signature?: string;
    className?: string;
}) => (
    <div className={`group relative bg-[#0c0c0c] border border-white/[0.08] rounded-2xl overflow-hidden my-10 transition-all duration-500 hover:border-[#306EE8]/30 hover:shadow-[0_0_60px_-12px_rgba(48,110,232,0.25)] ${className}`}>
        {/* Subtle glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#306EE8]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center px-5 py-3.5 bg-white/[0.02] border-b border-white/[0.06]">
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]/80" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]/80" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]/80" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 text-xs text-white/35 font-mono tracking-wide">email_welcome.html</div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 md:p-10">
            {/* Logo & Badge Row */}
            <div className="flex justify-between items-center gap-4 mb-8">
                <div className="text-2xl font-clash font-bold text-white">bigxbang</div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#306EE8]/10 border border-[#306EE8]/20 text-[#306EE8] text-xs font-semibold tracking-wide">
                    Jour 0 · Onboarding
                </span>
            </div>

            <h4 className="text-xl font-semibold text-white mb-4">{title}</h4>
            <p className="text-white/60 mb-3 leading-relaxed">{greeting}</p>
            <p className="text-white/60 mb-6 leading-relaxed">{intro}</p>

            {/* Tasks */}
            <div className="space-y-3 mb-8">
                {tasks.map((task, index) => (
                    <div key={index} className="flex gap-4 items-start p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#306EE8] text-white text-xs font-bold">
                            {index + 1}
                        </span>
                        <div>
                            <strong className="text-white block mb-0.5 text-sm">{task.title}</strong>
                            <p className="text-white/50 text-sm leading-relaxed m-0">{task.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm mb-6 transition-all duration-300 hover:bg-[#306EE8] hover:text-white hover:shadow-[0_0_30px_-5px_rgba(48,110,232,0.5)]"
            >
                {ctaText} <span className="opacity-60">→</span>
            </a>

            <div className="flex flex-wrap gap-4 items-center mb-4 text-white/40 text-xs">
                {footerItems.map((item, index) => (
                    <span key={index} className="inline-flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#306EE8]/50" />
                        {item}
                    </span>
                ))}
            </div>

            <p className="text-white/60 text-sm">
                À très vite,<br /><strong className="text-white">{signature}</strong>
            </p>
        </div>
    </div>
);

export default EmailTemplate;
