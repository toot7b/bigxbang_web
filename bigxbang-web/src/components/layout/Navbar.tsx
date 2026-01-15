"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavOverlay from "./NavOverlay";
import { useSectionTheme } from "@/hooks/useSectionTheme";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { GradientButton } from "@/components/ui/gradient-button";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const theme = useSectionTheme();
    const [isScrolled, setIsScrolled] = useState(false);

    // Page-specific behaviors
    const isLegalPage = pathname === "/mentions-legales";
    const isRendezVous = pathname === "/rendez-vous";

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // Track scroll for navbar transition
    useEffect(() => {
        const handleScroll = () => {
            // Solid background after moving a bit
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isLight = theme === "light";
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

    // Solid background logic:
    // 1. Always on light sections (to ensure contrast)
    // 2. Always on Rendez-vous page
    // 3. On mobile when scrolled
    const showGlass = isLight || (isMobile && isScrolled);

    const navBackground = showGlass
        ? "bg-black/95 backdrop-blur-xl border-b-[0.5px] border-white/10"
        : "bg-transparent border-transparent";

    // Text and Icon Color Logic:
    // If we have a glass bar (black), elements are white.
    // If transparent and light section (emergency case), elements are black.
    const isTextBlack = isLight && !showGlass;
    const textColor = isTextBlack ? "text-black" : "text-white";

    // Skip rendering if on legal or Johnny page
    if (isLegalPage || pathname === "/johnny-le-chat") return null;

    return (
        <>
            <header className={cn(
                "fixed top-0 left-0 right-0 z-[110] transition-all duration-500 ease-in-out pointer-events-none",
                (isScrolled || isRendezVous) ? "py-6 md:py-4" : "py-6 md:py-8",
                navBackground,
                textColor
            )}>
                <div className="px-6 md:px-12 flex items-center justify-between">
                    {/* LEFT: LOGO + BRAND */}
                    <Link href="/" className="pointer-events-auto flex items-center gap-3 md:gap-4 cursor-pointer">
                        <div className="w-10 h-10 md:w-11 md:h-11 relative">
                            <img
                                src="/logo.svg"
                                alt="BigxBang"
                                className={cn(
                                    "w-full h-full object-contain transition-all duration-300",
                                    isTextBlack ? "invert" : ""
                                )}
                            />
                        </div>
                        <span className="font-clash text-xl md:text-2xl font-medium tracking-wide">Big<span className="text-sm md:text-[17px]">x</span>Bang</span>
                    </Link>

                    {/* RIGHT: CONTROLS */}
                    <div className="pointer-events-auto flex items-center gap-4 md:gap-6 relative">
                        {/* Pill Button */}
                        <Link href="/rendez-vous" className="hidden md:block">
                            <GradientButton
                                hoverText="C'est parti"
                                className="px-5 py-2 text-xs h-auto min-h-0"
                                theme={isTextBlack ? "light" : "dark"}
                                lightStyle="anthracite"
                            >
                                Contact
                            </GradientButton>
                        </Link>

                        {/* Animated Hamburger / Cross */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="relative z-[110] w-10 h-10 md:w-12 md:h-12 cursor-pointer"
                        >
                            <motion.span
                                animate={isMenuOpen ? { rotate: 45, backgroundColor: "#ffffff" } : { rotate: 0, y: -4, backgroundColor: isTextBlack ? "#000000" : "#ffffff" }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-[2px]"
                            />
                            <motion.span
                                animate={isMenuOpen ? { rotate: -45, backgroundColor: "#ffffff" } : { rotate: 0, y: 4, backgroundColor: isTextBlack ? "#000000" : "#ffffff" }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-[2px]"
                            />
                        </button>
                    </div>
                </div>
            </header>

            <NavOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}
