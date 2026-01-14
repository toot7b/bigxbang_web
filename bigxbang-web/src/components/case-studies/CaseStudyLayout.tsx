"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import gsap from "gsap";
import { MetricCard } from "./index";
import { useLenis } from "lenis/react";
import { GradientButton } from "@/components/ui/gradient-button";
import MinimalFooter from "@/components/ui/MinimalFooter";

/**
 * CaseStudyLayout - Modern wrapper component for all case studies
 * Matches the main site's design language (Hero, Services, Method)
 */
export interface CaseStudyMeta {
    slug: string;
    title: string;
    subtitle: string;
    badge?: string;
    metrics?: { number: string; label: string }[];
}

interface CaseStudyLayoutProps {
    meta: CaseStudyMeta;
    children: React.ReactNode;
    mode?: 'page' | 'modal';
    onClose?: () => void;
    heroContent?: React.ReactNode;
}

export const CaseStudyLayout = ({
    meta,
    children,
    mode = 'page',
    onClose,
    heroContent
}: CaseStudyLayoutProps) => {
    const headerRef = useRef<HTMLElement>(null);
    const lenis = useLenis();

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header parallax on scroll - only if not in modal or handled within modal scroll container
            const handleScroll = () => {
                const scrollY = window.scrollY;
                if (headerRef.current && scrollY < 500) {
                    headerRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
                    headerRef.current.style.opacity = String(1 - scrollY / 600);
                }
            };

            // If in modal, we might need to attach this to the modal container scroll instead of window
            if (mode === 'page') {
                window.addEventListener("scroll", handleScroll);
            }
            return () => {
                if (mode === 'page') {
                    window.removeEventListener("scroll", handleScroll);
                }
            };
        });
        return () => ctx.revert();
    }, [mode]);

    return (
        <main className={`min-h-screen bg-[#0a0a0a] text-white font-jakarta selection:bg-[#306EE8] selection:text-white overflow-x-hidden ${mode === 'modal' ? 'pt-0' : ''}`}>
            {/* GRAIN TEXTURE OVERLAY */}
            <div
                className="fixed inset-0 pointer-events-none z-[9999] mix-blend-soft-light opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundSize: "320px 320px"
                }}
            />

            {/* AMBIENT GLOW */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[60vh] bg-[radial-gradient(ellipse_at_center,rgba(48,110,232,0.08)_0%,transparent_60%)]" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[40vh] bg-[radial-gradient(ellipse_at_bottom_left,rgba(48,110,232,0.05)_0%,transparent_50%)]" />
            </div>

            {/* NAVIGATION - Floating */}
            <nav className={`fixed top-0 left-0 w-full z-50 px-6 py-5 ${mode === 'modal' ? 'sticky' : ''}`}>
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    {mode === 'modal' ? (
                        <GradientButton
                            variant="ghost"
                            theme="dark"
                            onClick={onClose}
                            className="gap-2 px-6 rounded-full whitespace-nowrap"
                        >
                            <X className="w-4 h-4" />
                            <span>Fermer</span>
                        </GradientButton>
                    ) : (
                        <Link href="/" className="cursor-pointer">
                            <GradientButton
                                variant="ghost"
                                theme="dark"
                                className="gap-3 px-6 rounded-full whitespace-nowrap"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Retour</span>
                            </GradientButton>
                        </Link>
                    )}

                    <div className="text-xs font-mono text-white/40 tracking-wider uppercase">
                        {meta.slug.replace(/-/g, " ")}
                    </div>
                </div>
            </nav>

            {/* HEADER */}
            <header ref={headerRef} className="relative z-10 pt-32 md:pt-44 pb-20 md:pb-28 text-center px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2.5 px-5 py-2 mb-8 rounded-full bg-[#306EE8]/10 border border-[#306EE8]/25 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-[#306EE8] animate-pulse" />
                        <span className="text-sm font-semibold text-[#306EE8] tracking-wide uppercase">
                            {meta.badge || "Étude de cas"}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="font-clash text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                        <span className="bg-gradient-to-br from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                            {meta.title}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-white/55 max-w-2xl mx-auto leading-relaxed font-light">
                        {meta.subtitle}
                    </p>

                    {/* Metrics Grid */}
                    {meta.metrics && meta.metrics.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16 max-w-4xl mx-auto">
                            {meta.metrics.map((metric, index) => (
                                <MetricCard key={index} number={metric.number} label={metric.label} />
                            ))}
                        </div>
                    )}

                    {/* Custom Hero Content */}
                    {heroContent && (
                        <div className="mt-16 max-w-5xl mx-auto relative z-20">
                            {heroContent}
                        </div>
                    )}
                </div>
            </header>

            {/* CONTENT */}
            <div className="relative z-10 max-w-4xl mx-auto px-6">
                {children}
            </div>

            {/* CTA FOOTER */}
            <footer className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
                <div className="relative z-20 pointer-events-auto flex flex-col items-center p-8 md:p-12 border rounded-[2.5rem] backdrop-blur-md max-w-2xl mx-auto text-center gap-10 overflow-hidden border-[#306EE8] bg-[#306EE8]/10 shadow-[0_0_60px_rgba(48,110,232,0.3)]">
                    <div className="flex flex-col gap-3">
                        <h3 className="font-clash text-3xl font-bold text-white">Assez parlé du futur.</h3>
                        <p className="font-jakarta text-gray-400 text-lg">Vous avez la vision. Nous avons l'arsenal. Il est temps de connecter les deux.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                        <a
                            href="/rendez-vous"
                        >
                            <GradientButton
                                hoverText="On y va ?"
                                className="px-8 py-4 text-base sm:min-w-[240px]"
                            >
                                Je contacte
                            </GradientButton>
                        </a>
                        {mode === 'modal' ? (
                            <GradientButton
                                variant="ghost"
                                theme="dark"
                                onClick={onClose}
                                className="px-8 py-4 text-base sm:min-w-[240px]"
                            >
                                Fermer
                            </GradientButton>
                        ) : (
                            <Link href="/">
                                <GradientButton
                                    variant="ghost"
                                    theme="dark"
                                    className="px-8 py-4 text-base sm:min-w-[240px]"
                                >
                                    Retour à l&apos;accueil
                                </GradientButton>
                            </Link>
                        )}
                    </div>
                </div>

                <MinimalFooter visible={true} className="mt-16" iconClassName="w-6 h-6" />
            </footer>
        </main>
    );
};

/**
 * Section - Content section with elegant divider
 */
export const Section = ({
    children,
    withBorder = true,
    className = "",
}: {
    children: React.ReactNode;
    withBorder?: boolean;
    className?: string;
}) => (
    <section className={`py-16 md:py-24 ${withBorder ? 'border-t border-white/[0.06]' : ''} ${className}`}>
        {children}
    </section>
);

/**
 * SectionHeader - H2 with icon slot
 */
export const SectionHeader = ({
    icon,
    children,
    className = "",
}: {
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) => (
    <h2 className={`font-clash text-2xl md:text-4xl font-semibold mb-10 flex items-center gap-5 tracking-tight ${className}`}>
        {icon}
        <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            {children}
        </span>
    </h2>
);

export default CaseStudyLayout;
