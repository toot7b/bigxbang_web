"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import Link from "next/link";

const NAV_LINKS = [
    { label: "Problème", href: "/#probleme" },
    { label: "Méthode", href: "/#methode" },
    { label: "Services", href: "/#services" },
    { label: "Manifesto", href: "/#manifesto" },
    { label: "Contact", href: "/rendez-vous" },
];

export default function NavOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex flex-col pointer-events-none">
                    {/* BACKDROP - Curtain Effect */}
                    <motion.div
                        initial={{ y: "-100%", borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}
                        animate={{
                            y: "0%",
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            transition: {
                                duration: 0.6,
                                ease: [0.76, 0, 0.24, 1]
                            }
                        }}
                        exit={{
                            y: "-100%",
                            borderBottomLeftRadius: 50,
                            borderBottomRightRadius: 50,
                            transition: {
                                y: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 },
                                borderBottomLeftRadius: { duration: 0.3, ease: "easeOut" },
                                borderBottomRightRadius: { duration: 0.3, ease: "easeOut" }
                            }
                        }}
                        className="absolute inset-0 bg-[#050505] pointer-events-auto overflow-hidden will-change-transform"
                        style={{ transform: "translateZ(0)" }}
                    >
                        {/* Internal Blue Glow (Abyss Effect) - Optimized Blur for Mobile */}
                        <div className="absolute bottom-[-20%] left-[-10%] right-[-10%] h-[50%] bg-[#306EE8] blur-[60px] md:blur-[120px] opacity-20 pointer-events-none rounded-[100%] will-change-[filter]" />
                    </motion.div>

                    {/* CONTENT CONTAINER */}
                    <div className="relative z-10 w-full h-full pointer-events-none flex flex-col overflow-y-auto">
                        <div className="flex-1 flex flex-col items-center justify-center pt-40 pb-20 min-h-0">
                            {/* LINKS LIST */}
                            <nav className="flex flex-col items-center gap-8 md:gap-4 shrink-0">
                                {NAV_LINKS.map((link, i) => (
                                    <div key={link.label} className="overflow-hidden">
                                        <motion.div
                                            initial={{ y: "100%" }}
                                            animate={{
                                                y: "0%",
                                                transition: {
                                                    duration: 0.4,
                                                    ease: [0.76, 0, 0.24, 1],
                                                    delay: 0.2 + (i * 0.08)
                                                }
                                            }}
                                            exit={{
                                                y: "100%",
                                                transition: {
                                                    duration: 0.3,
                                                    ease: [0.76, 0, 0.24, 1],
                                                    delay: 0 // No delay on exit, instant response
                                                }
                                            }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={onClose}
                                                className="block group relative pointer-events-auto p-2 md:p-4 will-change-transform"
                                            >
                                                <span className="font-clash text-5xl md:text-7xl font-medium text-white transition-colors duration-300 hover:text-[#306EE8]">
                                                    {link.label}
                                                </span>
                                            </Link>
                                        </motion.div>
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* FOOTER INFO */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{
                                opacity: 0,
                                transition: { duration: 0.2 } // Instant exit
                            }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="pb-8 pt-4 flex flex-col items-center gap-6 pointer-events-auto shrink-0"
                        >
                            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 px-6 text-gray-500 text-center">
                                <a href="https://github.com/toot7b" target="_blank" className="hover:text-white transition-colors text-xs md:text-sm uppercase tracking-wider">Github</a>
                                <a href="https://www.linkedin.com/in/thomas-sarazin-11845a195/" target="_blank" className="hover:text-white transition-colors text-xs md:text-sm uppercase tracking-wider">LinkedIn</a>
                                <a href="mailto:thomas.sarazin@bigxbang.studio" className="hover:text-white transition-colors text-xs md:text-sm uppercase tracking-wider">Mail</a>
                                <a href="https://www.instagram.com/bigxbang.exe/" target="_blank" className="hover:text-white transition-colors text-xs md:text-sm uppercase tracking-wider">Instagram</a>
                                <Link href="/mentions-legales" onClick={onClose} className="hover:text-white transition-colors text-xs md:text-sm uppercase tracking-wider text-gray-500">Mentions Légales</Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
