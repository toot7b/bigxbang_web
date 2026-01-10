"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface WindowFrameProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

export function WindowFrame({ children, className, title }: WindowFrameProps) {
    return (
        <div
            className={cn(
                "group relative w-full flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl transition-all duration-500 shadow-[0_25px_50px_-12px_rgba(0,0,0,1),_0_0_0_1px_rgba(255,255,255,0.15),_30px_0_60px_-10px_rgba(48,110,232,0.2)] hover:shadow-[0_45px_90px_-15px_rgba(0,0,0,1),_0_0_0_1px_rgba(255,255,255,0.3),_0_0_100px_0_rgba(48,110,232,0.25)]",
                className
            )}
        >
            {/* BROWSER HEADER */}
            <div className="w-full h-11 bg-[#1a1a1a]/90 border-b border-white/5 flex items-center px-4 gap-4 shrink-0">
                {/* Traffic Lights */}
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]/80" />
                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E]/80" />
                    <div className="w-3 h-3 rounded-full bg-[#28C840]/80" />
                </div>
                {/* Optional Title Bar */}
                {title && (
                    <div className="flex-1 text-center text-xs font-mono text-white/30 uppercase tracking-widest">
                        {title}
                    </div>
                )}
                {/* Balance if no title, empty if title */}
                {!title && <div className="flex-1" />}
            </div>

            {/* CONTENT BODY */}
            <div className="w-full h-full relative">
                {children}
            </div>
        </div>
    );
}
