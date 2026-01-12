"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import "@/styles/horizon.css";
import Asterisk from "@/components/ui/Asterisk";
import { GradientButton } from "@/components/ui/gradient-button";
import { Link } from "next-view-transitions";

export default function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Background Animation (Subtle Pulse) - This was removed as per instruction, but the class is restored in JSX
            // gsap.to(".hero-glow", {
            //     scale: 1.1,
            //     opacity: 0.6,
            //     duration: 5,
            //     repeat: -1,
            //     yoyo: true,
            //     ease: "sine.inOut",
            // });

            // Text Reveal
            gsap.from(textRef.current, {
                y: 50,
                opacity: 0,
                duration: 1.5,
                ease: "power4.out",
                delay: 0.2,
            });

            // Shooting Stars Animation
            const particlesContainer = document.getElementById("particles-container");
            if (particlesContainer) {
                // CHANGE THIS NUMBER to adjust star count
                const particleCount = 15; // Reduced from 40

                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement("div");
                    // Trail effect: Thicker width (2px), long height, gradient
                    particle.className = "absolute w-[1.8px] bg-gradient-to-b from-transparent to-white opacity-0";
                    particlesContainer.appendChild(particle);

                    const animateParticle = () => {
                        const startX = gsap.utils.random(0, window.innerWidth);
                        const startY = gsap.utils.random(-window.innerHeight * 0.5, -100);
                        const endX = startX + gsap.utils.random(-20, 20); // Straighter fall
                        const endY = window.innerHeight + 100;
                        const duration = gsap.utils.random(6, 12); // Slow, majestic fall
                        const delay = gsap.utils.random(0, 10); // Spread out over time

                        const height = gsap.utils.random(50, 120); // Longer, bigger trails

                        gsap.set(particle, { height: height });

                        gsap.fromTo(particle,
                            { x: startX, y: startY, opacity: 0 },
                            {
                                x: endX,
                                y: endY,
                                opacity: gsap.utils.random(0.4, 0.9), // Slightly brighter
                                duration: duration,
                                delay: delay,
                                ease: "none",
                                onStart: () => {
                                    gsap.to(particle, { opacity: 1, duration: 1 }); // Slower fade in
                                },
                                onComplete: animateParticle
                            }
                        );
                    };

                    animateParticle();
                }
            }

            // Asterisk Rotation
            gsap.to(".hero-asterisk", {
                rotation: 360,
                duration: 40, // Slower rotation
                repeat: -1,
                ease: "linear",
            });

        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={heroRef}
            data-theme="dark"
            className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] text-white"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                {/* Particles Container */}
                <div id="particles-container" className="absolute inset-0 overflow-hidden"></div>

                {/* Restored Static Ambience (Subtle) */}
                <div className="hero-glow absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-[50%] bg-[#306EE8]/5 blur-[100px] rounded-full pointer-events-none"></div>
            </div>

            {/* Content */}
            <div className="relative z-30 text-center px-4 mb-16">
                <div ref={textRef} className="flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center justify-center mb-3">
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-[2px]">
                            <h3 className="font-jakarta text-[10px] md:text-xs font-medium text-white/50 uppercase tracking-[0.2em]">
                                Sites web • Automatisation • Stratégie de marque
                            </h3>
                        </div>
                    </div>

                    <h1 className="font-clash text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-none">
                        Human <span className="text-[#306EE8]">Intelligence</span>
                        <span className="inline-block align-top ml-2 -mt-1 md:-mt-2">
                            <Asterisk className="hero-asterisk w-5 h-5 md:w-8 md:h-8 text-white" />
                        </span>
                    </h1>

                    <h2 className="font-jakarta text-lg md:text-2xl text-gray-300 mt-6 max-w-4xl mx-auto font-normal leading-relaxed md:whitespace-nowrap">
                        Façonner votre image, coder votre univers, libérer votre temps.
                    </h2>

                    <div className="mt-10">
                        <Link href="/rendez-vous">
                            <GradientButton hoverText="C'est parti">Lancer mon projet</GradientButton>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Horizon Effect - Demi-cercle en bas */}
            <div className="loader-wrapper">
                <div className="loader"></div>
            </div>

        </section>
    );
}
