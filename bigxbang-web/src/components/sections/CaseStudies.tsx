"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Lock, Layout, BarChart3, Cpu, Target } from "lucide-react";
import { useLenis } from "lenis/react";
import OnboardingAutomation from "@/components/case-studies/content/OnboardingAutomation";
import ProspectionRefonte from "@/components/case-studies/content/ProspectionRefonte";
import MagneticWebsiteCaseStudy from "@/components/case-studies/content/MagneticWebsiteCaseStudy";
import SmartNewsletter from "@/components/case-studies/content/SmartNewsletter";

gsap.registerPlugin(ScrollTrigger);

// --- SKELETONS (R&D / Tech Theme) ---

const SkeletonNeural = () => {
    // Pulsing brain nodes
    const variants = {
        initial: { scale: 1, opacity: 0.5 },
        animate: { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5], transition: { duration: 2, repeat: Infinity } },
    };
    return (
        <motion.div
            initial="initial"
            animate="animate"
            className="flex flex-1 w-full h-full min-h-[6rem] bg-black/20 dark:bg-white/5 rounded-lg flex-col items-center justify-center space-y-2 overflow-hidden"
        >
            <div className="flex gap-2">
                <motion.div variants={variants} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md" />
                <motion.div variants={variants} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md" style={{ transitionDelay: "0.2s" }} />
            </div>
            <div className="flex gap-2">
                <motion.div variants={variants} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md" style={{ transitionDelay: "0.4s" }} />
            </div>
        </motion.div>
    );
};

const SkeletonEncryption = () => {
    // Shifting bars / code lines
    const variants = {
        initial: { width: "40%" },
        animate: {
            width: ["40%", "80%", "30%", "60%"],
            transition: { duration: 3, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" as const }
        }
    };
    return (
        <motion.div
            initial="initial"
            animate="animate"
            className="flex flex-1 w-full h-full min-h-[6rem] bg-black/20 dark:bg-white/5 rounded-lg flex-col justify-center px-4 space-y-2"
        >
            {[1, 2, 3, 4].map((i) => (
                <motion.div
                    key={i}
                    variants={variants}
                    style={{ width: `${Math.random() * 50 + 20}% ` }}
                    className="h-2 rounded-full bg-white/30"
                />
            ))}
        </motion.div>
    );
};

const SkeletonCore = () => {
    // Complex rotating geometry for the Core System
    const rotateVar = {
        animate: { rotate: 360, transition: { duration: 10, repeat: Infinity, ease: "linear" as const } }
    };
    return (
        <motion.div
            className="flex flex-1 w-full h-full min-h-[6rem] bg-transparent rounded-lg items-center justify-center relative overflow-hidden"
        >
            {/* Abstract Rings */}
            <motion.div
                variants={rotateVar}
                animate="animate"
                className="w-48 h-48 border-[1px] border-white/20 rounded-full absolute"
                style={{ borderStyle: "dashed" }}
            />
            <motion.div
                variants={rotateVar}
                animate="animate"
                className="w-32 h-32 border-[1px] border-white/40 rounded-full absolute"
            />
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-white rounded-full blur-xl absolute"
            />
        </motion.div>
    );
};

const SkeletonFluid = () => {
    // Floating UI cards
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] bg-black/20 dark:bg-white/5 rounded-lg relative overflow-hidden p-4">
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
                className="absolute top-4 left-4 w-24 h-16 bg-white/10 rounded-md border border-white/10"
            />
            <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" as const, delay: 1 }}
                className="absolute bottom-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-sm"
            />
        </div>
    );
};

const SkeletonAnalytics = () => {
    // Growing bars
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] bg-black/20 dark:bg-white/5 rounded-lg items-end justify-center space-x-2 p-4 pb-0">
            {[0.4, 0.8, 0.6, 0.9, 0.5].map((h, i) => (
                <motion.div
                    key={i}
                    initial={{ height: "10%" }}
                    animate={{ height: `${h * 100}% ` }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
                    className="w-4 bg-white/30 rounded-t-sm"
                />
            ))}
        </div>
    );
};


// --- BENTO ITEMS CONFIG ---

const items = [
    {
        title: "Onboarding Automation",
        description: "Zero-touch onboarding avec Stripe, Python et Notion.",
        header: <SkeletonNeural />,
        icon: <Brain className="h-4 w-4 text-neutral-300" />,
        className: "md:col-span-1",
        href: "/case-studies/onboarding-automation"
    },
    {
        title: "MagneticWebsite",
        description: "Le site qui se construit devant toi. Gamification de l'attention.",
        header: <SkeletonEncryption />,
        icon: <Lock className="h-4 w-4 text-neutral-300" />,
        className: "md:col-span-1",
        href: "/case-studies/magnetic-website"
    },
    {
        title: "Smart Newsletter",
        description: "La newsletter qui s'écrit (presque) toute seule.",
        header: <SkeletonFluid />,
        icon: <Layout className="h-4 w-4 text-neutral-300" />,
        className: "md:col-span-1",
        href: "/case-studies/smart-newsletter"
    },
    {
        title: "Pipeline de Prospection B2B",
        description: "Comment on a transformé 7h de travail répétitif en 47min d'exécution automatique.",
        header: <SkeletonCore />,
        icon: <Cpu className="h-4 w-4 text-white" />,
        // Styling specifically for the Blue Card
        className: "md:col-span-2 md:row-span-1 bg-[#306EE8] border-white/20 shadow-[0_0_50px_rgba(48,110,232,0.3)] [&>div>div]:text-white [&>div>div.font-jakarta]:text-white/80",
        href: "/case-studies/prospection-refonte"
    },
    {
        title: "Data Sentry",
        description: "Monitoring et analytics temps réel.",
        header: <SkeletonAnalytics />,
        icon: <BarChart3 className="h-4 w-4 text-neutral-300" />,
        className: "md:col-span-1",
        href: "/case-studies/data-sentry"
    },
];


export default function CaseStudies() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [openStudy, setOpenStudy] = useState<string | null>(null);
    const lenis = useLenis();

    useEffect(() => {
        if (openStudy) {
            lenis?.stop();
            document.body.style.overflow = 'hidden';
        } else {
            lenis?.start();
            document.body.style.overflow = '';
        }
    }, [openStudy, lenis]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!sectionRef.current || !contentRef.current || !overlayRef.current) return;

            // PARALLAX + REVEAL ANIMATION
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top bottom",
                end: "top top",
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const yPercent = -50 + (50 * progress);
                    contentRef.current!.style.transform = `translateY(${yPercent}%)`;
                    overlayRef.current!.style.opacity = `${1 - progress}`;
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div id="case-studies" className="scroll-mt-[100px]">
            <section
                ref={sectionRef}
                className="relative z-0 w-full min-h-screen bg-white text-black -mt-[100px] pt-[100px]"
            >
                {/* DIMMING OVERLAY */}
                <div
                    ref={overlayRef}
                    className="absolute inset-0 bg-black z-20 pointer-events-none"
                />

                {/* CONTENT CONTAINER */}
                <div
                    ref={contentRef}
                    className="relative z-10 w-full min-h-screen flex flex-col justify-start items-center p-4 md:p-8 pt-12 md:pt-24"
                    style={{ transform: 'translateY(-50%)' }}
                >
                    {/* HEADER */}
                    <div className="text-center max-w-4xl px-4 mb-16">
                        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-black/10 bg-black/5 backdrop-blur-sm mb-6">
                            <span className="font-jakarta text-xs font-medium text-black/80">R&D Lab</span>
                        </div>
                        <h1 className="font-clash text-3xl md:text-5xl font-medium text-black mb-4">
                            Experimental <span className="text-[#306EE8]">Protocols</span>
                        </h1>
                        <h2 className="font-jakarta text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed text-black/80">
                            Exploration des frontières numériques. Nos expérimentations deviennent vos standards de demain.
                        </h2>
                    </div>

                    {/* BENTO GRID */}
                    <BentoGrid className="max-w-5xl mx-auto md:auto-rows-[18rem]">
                        {items.map((item, i) => (
                            <BentoGridItem
                                key={i}
                                title={item.title}
                                description={item.description}
                                header={item.header}
                                icon={item.icon}
                                className={cn(item.className, item.title === "Pipeline de Prospection B2B" ? "!bg-[#306EE8] !border-transparent" : "bg-[#111111] border-white/5")}
                                href={item.href}
                                onClick={(e) => {
                                    if (item.href.includes('onboarding-automation')) {
                                        e.preventDefault();
                                        setOpenStudy('onboarding-automation');
                                    } else if (item.href.includes('prospection-refonte')) {
                                        e.preventDefault();
                                        setOpenStudy('prospection-refonte');
                                    } else if (item.href.includes('magnetic-website')) {
                                        e.preventDefault();
                                        setOpenStudy('magnetic-website');
                                    } else if (item.href.includes('smart-newsletter')) {
                                        e.preventDefault();
                                        setOpenStudy('smart-newsletter');
                                    } else {
                                        if (typeof window !== 'undefined') {
                                            sessionStorage.setItem('caseStudyReturnPosition', window.scrollY.toString());
                                        }
                                    }
                                }}
                            />
                        ))}
                    </BentoGrid>

                </div>
            </section>

            {/* MODAL OVERLAY */}
            <AnimatePresence>
                {openStudy === 'onboarding-automation' && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed inset-0 z-[200] overflow-y-auto bg-black"
                        data-lenis-prevent
                    >
                        <OnboardingAutomation mode="modal" onClose={() => setOpenStudy(null)} />
                    </motion.div>
                )}
                {openStudy === 'prospection-refonte' && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed inset-0 z-[200] overflow-y-auto bg-black"
                        data-lenis-prevent
                    >
                        <ProspectionRefonte mode="modal" onClose={() => setOpenStudy(null)} />
                    </motion.div>
                )}
                {openStudy === 'magnetic-website' && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed inset-0 z-[200] overflow-y-auto bg-black"
                        data-lenis-prevent
                    >
                        <MagneticWebsiteCaseStudy mode="modal" onClose={() => setOpenStudy(null)} />
                    </motion.div>
                )}
                {openStudy === 'smart-newsletter' && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed inset-0 z-[200] overflow-y-auto bg-black"
                        data-lenis-prevent
                    >
                        <SmartNewsletter mode="modal" onClose={() => setOpenStudy(null)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
