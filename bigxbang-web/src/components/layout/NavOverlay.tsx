"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
                                duration: 0.8,
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
                        className="absolute inset-0 bg-[#050505] pointer-events-auto overflow-hidden"
                    >
                        {/* Internal Blue Glow (Abyss Effect) */}
                        <div className="absolute bottom-[-20%] left-[-10%] right-[-10%] h-[50%] bg-[#306EE8] blur-[120px] opacity-20 pointer-events-none rounded-[100%]" />
                    </motion.div>

                    {/* CONTENT CONTAINER */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none">

                        {/* LINKS LIST */}
                        <nav className="flex flex-col items-center gap-2 md:gap-4">
                            {NAV_LINKS.map((link, i) => (
                                <div key={link.label} className="overflow-hidden">
                                    <motion.a
                                        href={link.href}
                                        onClick={onClose}
                                        initial={{ y: "100%" }}
                                        animate={{
                                            y: "0%",
                                            transition: {
                                                duration: 0.5,
                                                ease: [0.76, 0, 0.24, 1],
                                                delay: 0.4 + (i * 0.1)
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
                                        className="block group relative pointer-events-auto p-4"
                                    >
                                        <span className="font-clash text-5xl md:text-8xl font-medium text-white transition-colors duration-300 hover:text-[#306EE8]">
                                            {link.label}
                                        </span>
                                    </motion.a>
                                </div>
                            ))}
                        </nav>

                        {/* FOOTER INFO */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{
                                opacity: 0,
                                transition: { duration: 0.2 } // Instant exit
                            }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="absolute bottom-12 flex flex-col items-center gap-6 pointer-events-auto"
                        >
                            <div className="flex gap-6 text-gray-500">
                                <a href="https://github.com/topics/portfolio" target="_blank" className="hover:text-white transition-colors text-sm uppercase tracking-wider">Github</a>
                                <a href="#" className="hover:text-white transition-colors text-sm uppercase tracking-wider">LinkedIn</a>
                                <a href="mailto:contact@studio.com" className="hover:text-white transition-colors text-sm uppercase tracking-wider">Mail</a>
                                <a href="#" className="hover:text-white transition-colors text-sm uppercase tracking-wider">Instagram</a>
                                <a href="/legal" onClick={onClose} className="hover:text-white transition-colors text-sm uppercase tracking-wider text-gray-500">Legal</a>
                            </div>
                        </motion.div>

                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
