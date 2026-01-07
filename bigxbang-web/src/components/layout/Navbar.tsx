"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import NavOverlay from "./NavOverlay";
import { useSectionTheme } from "@/hooks/useSectionTheme";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const theme = useSectionTheme();

    const isLight = theme === "light";
    const textColor = isLight ? "text-black" : "text-white";
    const bgColor = isLight ? "bg-black" : "bg-white"; // Inverse for some elements if needed

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-[110] px-6 py-6 md:px-12 md:py-8 flex items-center justify-between pointer-events-none transition-colors duration-0 ${textColor}`}>

                {/* LEFT: LOGO + BRAND */}
                <div className="pointer-events-auto flex items-center gap-4">
                    <div className="w-12 h-12 relative">
                        {/* Dynamic Logo Color - simplified approach: use CSS filter or separate SVGs if strictly needed. 
                            For now, assuming logo.svg is white/black capable or we invert it.
                        */}
                        <img
                            src="/logo.svg"
                            alt="BigxBang"
                            className={`w-full h-full object-contain transition-all duration-0 ${isLight ? "invert" : ""}`}
                        />
                    </div>
                    <span className="font-clash text-2xl font-medium tracking-wide">Big<span className="text-[17px]">x</span>Bang</span>
                </div>

                {/* RIGHT: CONTROLS */}
                <div className="pointer-events-auto flex items-center gap-6">

                    {/* Pill Button */}
                    <a
                        href="https://calendar.app.google/qk7pa13Mu3fP3ex16"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`hidden md:flex items-center gap-2 h-10 px-5 rounded-full font-medium text-xs transition-colors duration-200 ${isLight ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-200'}`}
                    >
                        <span>Talk to us</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </a>

                    {/* Animated Hamburger / Cross - FIXED SYMMETRY */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="relative z-[110] w-12 h-12 cursor-pointer"
                    >
                        {/* Both bars positioned at exact center, only rotation changes */}
                        <motion.span
                            animate={isMenuOpen ? { rotate: 45, backgroundColor: "#ffffff" } : { rotate: 0, y: -4, backgroundColor: isLight ? "#000000" : "#ffffff" }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-[2px]"
                        />
                        <motion.span
                            animate={isMenuOpen ? { rotate: -45, backgroundColor: "#ffffff" } : { rotate: 0, y: 4, backgroundColor: isLight ? "#000000" : "#ffffff" }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-[2px]"
                        />
                    </button>
                </div>
            </header>

            <NavOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}
