"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavOverlay from "./NavOverlay";
import { useSectionTheme } from "@/hooks/useSectionTheme";

import { Link } from "next-view-transitions";
import { GradientButton } from "@/components/ui/gradient-button";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const theme = useSectionTheme();

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const isLight = theme === "light";
    const textColor = isLight ? "text-black" : "text-white";
    const bgColor = isLight ? "bg-black" : "bg-white"; // Inverse for some elements if needed

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-[110] px-6 py-6 md:px-12 md:py-8 flex items-center justify-between pointer-events-none transition-colors duration-0 ${textColor}`}>

                {/* LEFT: LOGO + BRAND */}
                <Link href="/" className="pointer-events-auto flex items-center gap-4 cursor-pointer">
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
                </Link>

                {/* RIGHT: CONTROLS */}
                <div className="pointer-events-auto flex items-center gap-6">

                    {/* Pill Button */}
                    <Link href="/rendez-vous" className="hidden md:block">
                        <GradientButton
                            hoverText="C'est parti"
                            className="px-5 py-2 text-xs h-auto min-h-0"
                        >
                            Contact
                        </GradientButton>
                    </Link>

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
