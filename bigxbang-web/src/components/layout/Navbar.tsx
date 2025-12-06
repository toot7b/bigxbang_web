"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import LogoNavbar from "@/components/ui/LogoNavbar";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-fit",
                // Always show pill shape, but enhance it on scroll
                "bg-white/5 backdrop-blur-md border border-white/10 shadow-lg py-1 px-5 rounded-full"
            )}
        >
            <div className="flex items-center gap-6">
                {/* Logo */}
                <Link href="/" className="relative z-50 flex items-center">
                    <LogoNavbar className="h-8 w-auto" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6 border-l border-white/10 pl-6 h-5">
                    {["Méthode", "Cas concrets", "Offres", "Le manifeste"].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase().replace(" ", "-")}`}
                            className="text-xs font-medium text-gray-400 hover:text-white transition-colors tracking-wide"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="hidden md:block border-l border-white/10 pl-6">
                    <button className="btn-shiny text-xs">
                        Je contacte
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden relative z-50 text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden",
                    isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                )}
            >
                {["Méthode", "Cas concrets", "Offres", "Le manifeste"].map((item) => (
                    <Link
                        key={item}
                        href={`#${item.toLowerCase().replace(" ", "-")}`}
                        className="text-2xl font-medium text-white hover:text-blue-400 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {item}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
