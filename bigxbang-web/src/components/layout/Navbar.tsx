"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavOverlay from "./NavOverlay";
import { useSectionTheme } from "@/hooks/useSectionTheme";

import { Link } from "next-view-transitions";
import { GradientButton } from "@/components/ui/gradient-button";

interface NavbarProps {
    forceOpaqueMobile?: boolean;
}

export default function Navbar({ forceOpaqueMobile = false }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const theme = useSectionTheme();
    const [isScrolled, setIsScrolled] = useState(false);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // Track scroll for mobile navbar transition
    useEffect(() => {
        const handleScroll = () => {
            // Trigger transition just before the Hero section ends
            setIsScrolled(window.scrollY > window.innerHeight - 100);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isLight = theme === "light";
    const textColor = isLight ? "text-black" : "text-white";

    // Mobile: Transparent at top, Black + Border when scrolled
    // Desktop: Always transparent
    const mobileClasses = (isScrolled || forceOpaqueMobile)
        ? "bg-black border-b-[0.5px] border-white/15"
        : "bg-transparent border-transparent";

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-[110] px-6 py-4 md:px-12 md:py-8 flex items-center justify-between pointer-events-none transition-all duration-300 ${mobileClasses} md:bg-transparent md:border-none ${textColor}`}>

                {/* LEFT: LOGO + BRAND */}
                <Link href="/" className="pointer-events-auto flex items-center gap-3 md:gap-4 cursor-pointer">
                    <div className="w-10 h-10 md:w-12 md:h-12 relative">
                        {/* Dynamic Logo Color - simplified approach: use CSS filter or separate SVGs if strictly needed. 
                            For now, assuming logo.svg is white/black capable or we invert it.
                        */}
                        <img
                            src="/logo.svg"
                            alt="BigxBang"
                            className={`w-full h-full object-contain transition-all duration-0 ${isLight ? "invert" : ""}`}
                        />
                    </div>
                    <span className="font-clash text-xl md:text-2xl font-medium tracking-wide">Big<span className="text-sm md:text-[17px]">x</span>Bang</span>
                </Link>

                {/* RIGHT: CONTROLS */}
                <div className="pointer-events-auto flex items-center gap-6 relative">

                    {/* Pill Button */}
                    <Link href="/rendez-vous" className="hidden md:block">
                        <GradientButton
                            hoverText="C'est parti"
                            className="px-5 py-2 text-xs h-auto min-h-0"
                            theme={theme}
                            lightStyle="anthracite"
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
