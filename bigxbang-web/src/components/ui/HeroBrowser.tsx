"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface HeroBrowserProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: number;
    height?: number;
    url?: string;
    children?: React.ReactNode;
}

export const HeroBrowser = ({
    className,
    width = 800,
    height = 500,
    url = "bigxbang.studio",
    children,
    ...props
}: HeroBrowserProps) => {
    return (
        <div
            className={cn(
                "relative flex flex-col rounded-xl overflow-hidden shadow-2xl border border-white/10",
                "bg-[#1A1A1A]", // Lighter than full black, requested "un peu plus clair"
                className
            )}
            style={{ width: "100%", height: "100%", transformOrigin: "center" }} // Scale handled by parent via Html wrapper or Framer, but here we just ensure origin
            {...props}
        >
            {/* WINDOW TOP BAR */}
            <div className="h-10 bg-[#252525] border-b border-white/5 flex items-center px-4 gap-4 select-none">
                {/* Traffic Lights */}
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-inner" />
                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-inner" />
                    <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-inner" />
                </div>

                {/* Back/Forward (Visual only) */}
                <div className="flex gap-2 opacity-50">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </div>

                {/* URL Bar */}
                <div className="flex-1 max-w-[400px] h-7 bg-[#1A1A1A] rounded-md flex items-center justify-center text-xs text-gray-400 font-medium border border-white/5 shadow-inner mx-auto my-auto">
                    <span className="flex items-center gap-1 opacity-60">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>
                        {url}
                    </span>
                </div>

                {/* Right Placeholder */}
                <div className="w-10" />
            </div>

            {/* CONTENT CONTENT */}
            <div className="flex-1 relative overflow-hidden bg-[#121212]">
                {children}
            </div>
        </div>
    );
};
