"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, Layout, Dna } from "lucide-react";
import Asterisk from "@/components/ui/Asterisk";
import { useLenis } from "lenis/react";
import OnboardingAutomation from "@/components/case-studies/content/OnboardingAutomation";
import ProspectionRefonte from "@/components/case-studies/content/ProspectionRefonte";
import MagneticWebsiteCaseStudy from "@/components/case-studies/content/MagneticWebsiteCaseStudy";
import SmartNewsletter from "@/components/case-studies/content/SmartNewsletter";
import JohnnyLeChatCaseStudy from "@/components/case-studies/content/JohnnyLeChatCaseStudy";

gsap.registerPlugin(ScrollTrigger);

// --- LOTTIE IMPORTS ---
import RobotAnim from "@/../public/icons/Robot.json";
import WebDesignAnim from "@/../public/icons/Web design.json";
import EmailAnim from "@/../public/icons/email.json";
import ProspectionAnim from "@/../public/icons/Prospection.json";
import UFORocketAnim from "@/../public/icons/UFO_rocket2.json";

// Dynamic Lottie import to avoid SSR issues
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// --- LOTTIE HEADER COMPONENT ---
const LottieHeader = ({ animationData }: { animationData: object }) => {
    const lottieRef = React.useRef<any>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Use MutationObserver to detect when parent card is hovered (via group-hover class)
    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Find the closest group/bento parent
        const card = container.closest('.group\\/bento');
        if (!card) return;

        const handleMouseEnter = () => lottieRef.current?.play();
        const handleMouseLeave = () => lottieRef.current?.stop();

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="flex flex-1 w-full h-full min-h-[6rem] bg-black/20 dark:bg-white/5 rounded-lg items-center justify-center overflow-hidden p-4"
        >
            <div className="transition-opacity duration-300 opacity-20 group-hover/bento:opacity-60">
                <Lottie
                    lottieRef={lottieRef}
                    animationData={animationData}
                    loop={false}
                    autoplay={false}
                    className="w-16 h-16"
                />
            </div>
        </div>
    );
};

// --- SKELETON FOR BLUE CARD (Pipeline) ---
const SkeletonCore = () => {
    const lottieRef = React.useRef<any>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const card = container.closest('.group\\/bento');
        if (!card) return;

        const handleMouseEnter = () => lottieRef.current?.play();
        const handleMouseLeave = () => lottieRef.current?.stop();

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="flex flex-1 w-full h-full min-h-[6rem] bg-transparent rounded-lg items-center justify-center relative overflow-hidden"
        >
            <div className="transition-opacity duration-300 opacity-30 group-hover/bento:opacity-80">
                <Lottie
                    lottieRef={lottieRef}
                    animationData={ProspectionAnim}
                    loop={false}
                    autoplay={false}
                    className="w-24 h-24"
                />
            </div>
        </div>
    );
};


// --- BENTO ITEMS CONFIG ---

// Icon separator component
const IconSeparator = () => <Asterisk className="h-2 w-2 text-neutral-500 mx-1" />;

const items = [
    {
        title: "Onboarding Automation",
        description: "Zero-touch onboarding avec Stripe, Python et Notion.",
        header: <LottieHeader animationData={RobotAnim} />,
        icon: <BrainCircuit className="h-4 w-4 text-neutral-300" />,
        className: "md:col-span-1",
        href: "/case-studies/onboarding-automation"
    },
    {
        title: "MagneticWebsite",
        description: "Le site qui se construit devant toi. Gamification de l'attention.",
        header: <LottieHeader animationData={WebDesignAnim} />,
        icon: (
            <span className="flex items-center">
                <Layout className="h-4 w-4 text-neutral-300" />
                <IconSeparator />
                <Dna className="h-4 w-4 text-neutral-300" />
            </span>
        ),
        className: "md:col-span-1",
        href: "/case-studies/magnetic-website"
    },
    {
        title: "Smart Newsletter",
        description: "La newsletter qui s'écrit (presque) toute seule.",
        header: <LottieHeader animationData={EmailAnim} />,
        icon: (
            <span className="flex items-center">
                <BrainCircuit className="h-4 w-4 text-neutral-300" />
                <IconSeparator />
                <Dna className="h-4 w-4 text-neutral-300" />
            </span>
        ),
        className: "md:col-span-1",
        href: "/case-studies/smart-newsletter"
    },
    {
        title: "Pipeline de Prospection B2B",
        description: "Comment on a transformé 7h de travail répétitif en 47min d'exécution automatique.",
        header: <SkeletonCore />,
        icon: <BrainCircuit className="h-4 w-4 text-white" />,
        // Styling specifically for the Blue Card
        className: "md:col-span-2 md:row-span-1 bg-[#306EE8] border-white/20 shadow-[0_0_50px_rgba(48,110,232,0.3)] [&_div.font-clash]:text-white [&_div.font-jakarta]:text-white/80",
        href: "/case-studies/prospection-refonte"
    },
    {
        title: "Johnny Le Chat",
        description: "Une mascotte de qualité studio, sans le studio. Générée et animée par IA.",
        header: <LottieHeader animationData={UFORocketAnim} />,
        icon: (
            <span className="flex items-center">
                <BrainCircuit className="h-4 w-4 text-neutral-300" />
                <IconSeparator />
                <Layout className="h-4 w-4 text-neutral-300" />
                <IconSeparator />
                <Dna className="h-4 w-4 text-neutral-300" />
            </span>
        ),
        className: "md:col-span-1",
        href: "/case-studies/johnny-le-chat"
    },
];


export default function CaseStudies({ compact = false }: { compact?: boolean } = {}) {
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

    const [bentoVisible, setBentoVisible] = useState(false);

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

                    // Trigger Bento animation when overlay is fully gone
                    if (progress > 0.98 && !bentoVisible) {
                        setBentoVisible(true);
                    }
                }
            });


        }, sectionRef);

        return () => ctx.revert();
    }, [bentoVisible]);

    return (
        <div id="case-studies" className="scroll-mt-[100px]">
            <section
                ref={sectionRef}
                className={cn(
                    "relative z-10 w-full min-h-screen bg-white text-black overflow-hidden rounded-b-[60px]",
                    compact ? "-mt-[40px] pt-24 pb-16" : "-mt-[100px] pt-[100px]"
                )}
            >
                {/* DIMMING OVERLAY */}
                <div
                    ref={overlayRef}
                    className="absolute inset-0 bg-black z-20 pointer-events-none"
                />

                {/* CONTENT CONTAINER */}
                <div
                    ref={contentRef}
                    className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center p-4 md:p-8"
                    style={{ transform: 'translateY(-50%)' }}
                >
                    {/* SUBTLE DOT BACKGROUND - Increased visibility */}
                    <div className="absolute top-64 -bottom-32 left-1/2 -translate-x-1/2 w-[140vw] z-[-1] pointer-events-none">
                        <div className={cn(
                            "absolute inset-0 h-full w-full",
                            "[background-size:20px_20px]",
                            "[background-image:radial-gradient(#a1a1aa_1px,transparent_1px)]"
                        )} />
                        {/* Mask: Content visible in center, fading out to edges */}
                        <div className="absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black_80%)]" />
                    </div>

                    {/* HEADER */}
                    <div className="text-center max-w-4xl px-4 mt-40 mb-16">
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
                    <motion.div
                        className="max-w-5xl mx-auto grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4"
                        initial="hidden"
                        animate={bentoVisible ? "visible" : "hidden"}
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.12,
                                    delayChildren: 0.3
                                }
                            }
                        }}
                    >
                        {items.map((item, i) => {
                            // Determine slide direction based on position in grid
                            // Row 1: 0 (left), 1 (center), 2 (right)
                            // Row 2: 3 (left, spans 2), 4 (right)
                            const getInitialPosition = () => {
                                if (i === 0 || i === 3) return { x: -80, y: 0 }; // Left side
                                if (i === 2 || i === 4) return { x: 80, y: 0 };  // Right side
                                return { x: 0, y: 50 }; // Center (from bottom)
                            };
                            const initialPos = getInitialPosition();

                            return (
                                <motion.div
                                    key={i}
                                    variants={{
                                        hidden: { opacity: 0, x: initialPos.x, y: initialPos.y },
                                        visible: {
                                            opacity: 1,
                                            x: 0,
                                            y: 0,
                                            transition: {
                                                type: "spring",
                                                stiffness: 60,
                                                damping: 15
                                            }
                                        }
                                    }}
                                    className={cn(item.className, "rounded-xl")}
                                >
                                    <BentoGridItem
                                        title={item.title}
                                        description={item.description}
                                        header={item.header}
                                        icon={item.icon}
                                        className={cn("h-full", item.title === "Pipeline de Prospection B2B" ? "!bg-[#306EE8] !border-transparent" : "bg-[#111111] border-white/5")}
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
                                            } else if (item.href.includes('johnny-le-chat')) {
                                                e.preventDefault();
                                                setOpenStudy('johnny-le-chat');
                                            } else {
                                                if (typeof window !== 'undefined') {
                                                    sessionStorage.setItem('caseStudyReturnPosition', window.scrollY.toString());
                                                }
                                            }
                                        }}
                                    />
                                </motion.div>
                            );
                        })}
                    </motion.div>

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
                {openStudy === 'johnny-le-chat' && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed inset-0 z-[200] overflow-y-auto bg-black"
                        data-lenis-prevent
                    >
                        <JohnnyLeChatCaseStudy mode="modal" onClose={() => setOpenStudy(null)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
