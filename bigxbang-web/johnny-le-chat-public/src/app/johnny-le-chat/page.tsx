"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/**
 * PAGE DE DÉVELOPPEMENT - JOHNNY LE CHAT
 * URL: http://localhost:3000/johnny-le-chat
 */

function CloudButton() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-[50%] -translate-y-1/2 z-30 md:top-auto md:translate-y-0 md:left-auto md:translate-x-0 md:right-[16%] md:bottom-[27%]"
            animate={{ y: [0, -6, 0] }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            {/* Ombre portée douce sous le bouton */}
            <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-3 rounded-[100%] bg-black/8 blur-md transition-all duration-300"
                style={{
                    opacity: isHovered ? 0.12 : 0.06,
                    transform: `translateX(-50%) scale(${isHovered ? 1.1 : 1})`
                }}
            />

            <motion.button
                className="relative px-12 py-5 md:px-10 md:py-3.5 font-nunito font-medium text-2xl md:text-xl tracking-wide cursor-pointer"
                style={{
                    borderRadius: '24px 18px 26px 20px',
                    backgroundColor: 'rgba(255, 250, 242, 0.85)',
                    color: '#5a4a3a',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: `
                        0 8px 32px -4px rgba(0, 0, 0, 0.08),
                        0 4px 16px -2px rgba(0, 0, 0, 0.04)
                    `
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{
                    scale: 1.03,
                    y: -2,
                    rotate: [0, -1, 1, -1, 0],
                    boxShadow: `
                        0 12px 40px -4px rgba(0, 0, 0, 0.1),
                        0 6px 20px -2px rgba(0, 0, 0, 0.05),
                        0 0 20px 2px rgba(255, 250, 242, 0.4)
                    `
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    rotate: { duration: 0.6, ease: "easeInOut" }
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                    const audio = new Audio('/meow.mp3');
                    audio.volume = 0.5;
                    audio.play().catch(e => console.log("Audio play failed", e));
                }}
            >
                <motion.span
                    className="inline-block"
                    animate={{ x: isHovered ? -8 : 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                >
                    Miaou
                </motion.span>
                <motion.span
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        scale: isHovered ? 1 : 0.3
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                >
                    🐾
                </motion.span>
            </motion.button>


        </motion.div >
    );
}

export default function JohnnyLeChatPage() {
    return (
        <main
            className="min-h-screen relative overflow-hidden flex items-center justify-center"
            style={{
                /* NIVEAU 3: Global Color Grading - unifies all elements */
                filter: "saturate(0.9) contrast(1.05) sepia(0.08)"
            }}
        >

            {/* --- FAKE NAVBAR --- */}
            <nav className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-20 font-nunito text-black/60 uppercase tracking-widest text-sm mix-blend-multiply pointer-events-none select-none">
                <img src="/cat-paw.svg" alt="Badge" className="w-20 h-20 rotate-[-5deg] drop-shadow-sm opacity-80" />
                <div className="flex gap-8 md:gap-12 hidden md:flex">
                    <span className="relative">
                        Accueil
                        <svg
                            className="absolute left-0 top-1/2 w-full h-4 -translate-y-1/2 pointer-events-none"
                            viewBox="0 0 60 12"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M1 6 Q15 2, 30 7 T59 5 M2 8 Q20 4, 40 9 T58 6"
                                stroke="rgba(180, 100, 80, 0.7)"
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                    <a href="https://github.com/toot7b/johnny-le-chat" target="_blank" rel="noopener noreferrer" className="pointer-events-auto hover:text-black transition-colors">Github</a>
                    <span>Croquettes</span>
                    <span className="border-b-2 border-black/20">Contact</span>
                </div>
                <div className="flex gap-4 md:hidden text-xs">
                    <span className="relative">
                        Accueil
                        <svg className="absolute left-0 top-1/2 w-full h-3 -translate-y-1/2 pointer-events-none" viewBox="0 0 60 12" preserveAspectRatio="none">
                            <path d="M1 6 Q15 2, 30 7 T59 5 M2 8 Q20 4, 40 9 T58 6" stroke="rgba(180, 100, 80, 0.7)" strokeWidth="4" fill="none" strokeLinecap="round" />
                        </svg>
                    </span>
                    <a href="https://github.com/toot7b/johnny-le-chat" target="_blank" rel="noopener noreferrer" className="pointer-events-auto hover:text-black transition-colors">Github</a>
                    <span>Croquettes</span>
                </div>
            </nav>

            {/* --- CURVED TITLE (SVG Arc) --- */}
            <div className="absolute top-[12%] md:top-[8%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[900px] h-[200px] z-10 pointer-events-none" style={{ background: 'transparent' }}>
                <svg viewBox="0 0 900 200" width="100%" height="100%" overflow="visible" fill="none" style={{ background: 'transparent' }}>
                    <defs>
                        <path id="textArc" d="M 50,180 Q 450,50 850,180" fill="transparent" />
                    </defs>
                    <text fill="#5a4a3a" fontSize="72" fontFamily="'Londrina Solid', cursive" fontWeight="900" letterSpacing="4">
                        <textPath href="#textArc" startOffset="18%">
                            JOHNNY
                        </textPath>
                    </text>
                    <text fill="#8b7355" fontSize="72" fontFamily="'Londrina Outline', cursive" fontWeight="400" letterSpacing="4">
                        <textPath href="#textArc" startOffset="52%">
                            LE CHAT
                        </textPath>
                    </text>
                </svg>
            </div>

            {/* --- BACKGROUND: Radial Cream with bright center --- */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: "radial-gradient(ellipse 75% 65% at center 50%, #FFFBD6 0%, #FFFBD6 25%, #f5f0e8 70%, #e8e4df 100%)"
                }}
            />

            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 80% 70% at center, transparent 0%, rgba(0,0,0,0.08) 100%)"
                }}
            />

            {/* --- CLOUDS LAYER (behind rainbow) --- */}
            <div className="absolute inset-0 z-0 overflow-visible pointer-events-none">
                {/* 1. Far Left - High & Faint */}
                <motion.img
                    src="/cloud.png"
                    alt=""
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                    className="absolute top-[5%] left-[5%] w-[12vw] h-auto object-contain opacity-40"
                />

                {/* 2. Mid Left - Prominent */}
                <motion.img
                    src="/cloud.png"
                    alt=""
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-[12%] left-[15%] w-[20vw] h-auto object-contain opacity-80"
                />

                {/* 3. Center Left-Back - Small */}
                <motion.img
                    src="/cloud.png"
                    alt=""
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-[8%] left-[35%] w-[10vw] h-auto object-contain opacity-30"
                />

                {/* 4. Center Right - Subtle */}
                <motion.img
                    src="/cloud.png"
                    alt=""
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-[10%] left-[55%] w-[14vw] h-auto object-contain opacity-50"
                />

                {/* 5. Mid Right - Prominent */}
                <motion.img
                    src="/cloud.png"
                    alt=""
                    animate={{ y: [0, -14, 0] }}
                    transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    className="absolute top-[15%] right-[15%] w-[18vw] h-auto object-contain opacity-70"
                />

                {/* 6. Far Right - High & Small */}
                <motion.img
                    src="/cloud.png"
                    alt=""
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                    className="absolute top-[6%] right-[5%] w-[12vw] h-auto object-contain opacity-50"
                />

                {/* 7. Lower Left - Large & Hazy (Depth) */}
                <motion.img
                    src="/cloud.png"
                    alt=""
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                    className="absolute top-[22%] left-[-2%] w-[25vw] h-auto object-contain opacity-30 blur-[1px]"
                />

                {/* 8. Lower Right - Large & Hazy (Depth) */}
                <motion.img
                    src="/cloud.png"
                    alt=""
                    animate={{ y: [0, -18, 0] }}
                    transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-[20%] right-[-5%] w-[22vw] h-auto object-contain opacity-30 blur-[1px]"
                />
            </div>

            {/* Rainbow Background Asset - Arches from horizon */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-visible">
                {/* Mobile */}
                <img
                    src="/rainbow_fixed.svg?v=16"
                    alt=""
                    className="absolute left-1/2 -translate-x-1/2 w-[200vw] max-w-none h-auto object-cover opacity-60 scale-y-90 origin-bottom blur-[2px] saturate-[0.8] mix-blend-multiply md:hidden"
                    style={{ bottom: '11%' }}
                />
                {/* Desktop */}
                <img
                    src="/rainbow_fixed.svg?v=16"
                    alt=""
                    className="absolute left-[48%] -translate-x-1/2 w-[110vw] max-w-none h-auto object-cover opacity-60 scale-y-90 origin-bottom blur-[2px] saturate-[0.8] mix-blend-multiply hidden md:block"
                    style={{ bottom: '-33%' }}
                />
            </div>

            {/* Contact Shadow for Cat */}
            <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[35vw] h-[8vh] bg-black/20 blur-2xl rounded-[100%] pointer-events-none z-5 mix-blend-multiply" />

            {/* Horizon Line: Suggests ground level */}
            <div className="absolute bottom-[5.5%] w-full h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent z-0 pointer-events-none blur-[0.5px]" />


            {/* --- CONTENT LAYER --- */}
            <div className="absolute bottom-[3%] md:bottom-[1%] left-1/2 -translate-x-1/2 w-full max-w-7xl flex flex-col items-center z-10">

                {/* Video Container */}
                <div className="relative w-[120%] md:w-[80%] flex items-end justify-center">
                    <video
                        className="w-full h-full object-contain"
                        style={{
                            maskImage: 'radial-gradient(ellipse closest-side at center, black 40%, transparent 95%)',
                            WebkitMaskImage: 'radial-gradient(ellipse closest-side at center, black 40%, transparent 95%)'
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

                    {/* --- CLOUD BUTTON DESKTOP --- */}
                    <div className="hidden md:block">
                        <CloudButton />
                    </div>
                </div>
            </div>

            {/* --- CLOUD BUTTON MOBILE --- */}
            <div className="block md:hidden">
                <CloudButton />
            </div>
        </main>
    );
}
