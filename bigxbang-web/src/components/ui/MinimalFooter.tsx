"use client";

import React from "react";
import { Github, Linkedin, Mail, Instagram, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MinimalFooterProps {
    visible: boolean;
    className?: string;
}

export default function MinimalFooter({ visible, className }: MinimalFooterProps) {
    const icons = [
        { id: "github", icon: Github, href: "https://github.com/topics/portfolio", label: "Open Source" },
        { id: "linkedin", icon: Linkedin, href: "#", label: "Connect" },
        { id: "mail", icon: Mail, href: "mailto:contact@studio.com", label: "Contact" },
        { id: "instagram", icon: Instagram, href: "#", label: "Vibe" },
        { id: "legal", icon: Scale, href: "/legal", label: "Legal" },
    ];

    return (
        <div
            className={cn(
                "relative w-full flex items-center justify-center gap-6 z-20",
                visible ? "pointer-events-auto" : "pointer-events-none",
                className
            )}
        >
            <div className="flex items-center gap-8">
                {icons.map((item, index) => (
                    <FooterIcon key={item.id} href={item.href} visible={visible} index={index}>
                        <item.icon className="w-5 h-5 transition-all duration-300" />
                    </FooterIcon>
                ))}
            </div>
        </div>
    );
}

function FooterIcon({ children, href, visible, index }: { children: React.ReactNode, href: string, visible: boolean, index: number }) {
    return (
        <motion.a
            href={href}
            target={href.startsWith('http') ? "_blank" : "_self"}
            rel="noopener noreferrer"
            // CSS: Only transition colors/bg options. NO transform/all transitions.
            className="group relative p-3 rounded-full transition-colors duration-300 hover:bg-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: visible ? 1 : 0,
                y: visible ? 0 : 20
            }}
            whileHover={{ scale: 1.1 }}
            transition={{
                duration: 0.5,
                delay: visible ? 0.3 + (index * 0.1) : 0,
                ease: "easeOut"
            }}
        >
            {/* HOVER GLOW - The "Sympa" Glow */}
            <div className="absolute inset-0 rounded-full bg-[#306EE8] blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300 scale-125" />

            {/* CORE ICON STYLING */}
            <div className="relative z-10 text-white/40 group-hover:text-[#306EE8] group-hover:drop-shadow-[0_0_8px_rgba(48,110,232,0.8)] transition-colors duration-300">
                {children}
            </div>
        </motion.a>
    );
}
