"use client";

import React from "react";

/**
 * PAGE DE DÉVELOPPEMENT - JOHNNY LE CHAT
 * URL: http://localhost:3000/johnny-le-chat
 */

export default function JohnnyLeChatPage() {
    return (
        <main
            className="min-h-screen relative overflow-hidden flex items-center justify-center"
            style={{
                /* NIVEAU 3: Global Color Grading - unifies all elements */
                filter: "saturate(0.9) contrast(1.05) sepia(0.08)"
            }}
        >

            {/* --- BACKGROUND: Radial Cream with bright center --- */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: "radial-gradient(ellipse 75% 65% at center 50%, #FFFBD6 0%, #FFFBD6 25%, #f5f0e8 70%, #e8e4df 100%)"
                }}
            />

            {/* Subtle vignette */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 80% 70% at center, transparent 0%, rgba(0,0,0,0.08) 100%)"
                }}
            />

            {/* Rainbow Background Asset - Arches from horizon */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-visible">
                <img
                    src="/rainbow_fixed.svg?v=16"
                    alt=""
                    className="absolute bottom-[-33%] left-[48%] -translate-x-1/2 w-[110vw] max-w-none h-auto object-cover opacity-70 scale-y-90 origin-bottom"
                />
            </div>

            {/* Horizon Line: Suggests ground level */}
            <div className="absolute bottom-[5.5%] w-full h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent z-0 pointer-events-none blur-[0.5px]" />


            {/* --- CONTENT LAYER --- */}
            <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center z-10 pt-20">
                {/* Title: Darker text for light background */}
                <h1 className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-6xl md:text-8xl mb-8 text-center">
                    <span className="font-londrina-solid font-black tracking-wide uppercase text-[#2a2a2a]">Johnny</span>
                    <span className="font-londrina font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-[#4a4a4a] to-[#8a8a8a] uppercase">le Chat</span>
                </h1>

                {/* Video Container */}
                <div className="relative w-full aspect-video flex items-end justify-center">
                    <video
                        className="w-full h-full object-contain"
                        style={{
                            maskImage: 'radial-gradient(ellipse closest-side at center, black 60%, transparent 100%)',
                            WebkitMaskImage: 'radial-gradient(ellipse closest-side at center, black 60%, transparent 100%)'
                        }}
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src="/fluffy_master.webm" type="video/webm" />
                    </video>

                    {/* Shadow on the ground to ground the character */}
                    <div className="absolute bottom-[0%] w-[40%] h-[10%] bg-black/30 blur-3xl rounded-[100%] -z-10 transform scale-y-50" />
                </div>
            </div>
        </main>
    );
}
