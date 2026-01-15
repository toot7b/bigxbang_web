"use client";

import React, { useRef } from "react";
import Asterisk from "@/components/ui/Asterisk";
import { GradientButton } from "@/components/ui/gradient-button";
import { Link } from "next-view-transitions";
import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

interface ServiceData {
  id: number;
  subtitle: string;
  title: string;
  description: string;
  features: string[];
}

interface MobileServicesStackProps {
  services: ServiceData[];
}

export const MobileServicesStack = ({ services }: MobileServicesStackProps) => {
  const scrollRef = useRef(null);
  const { scrollX, scrollXProgress } = useScroll({ container: scrollRef });
  const scrollXVelocity = useVelocity(scrollX);

  // Cartoon Physics: Bouncy Spring
  const smoothVelocity = useSpring(scrollXVelocity, {
    damping: 15, // Low damping = more bounce/wobble
    stiffness: 200, // Spring tension
    mass: 0.8
  });

  const tilt = useTransform(smoothVelocity, [-1500, 1500], [-25, 25]);

  return (
    <section className="w-full pt-10 pb-16 bg-[#0a0a0a] overflow-hidden rounded-b-[60px] relative z-20 md:rounded-none md:z-auto">

      {/* 1. SECTION HEADER */}
      <div className="relative z-10 flex flex-col items-start mb-20 px-6">
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm mb-6">
          <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest">Les Services</span>
        </div>
        <h2 className="font-clash text-4xl font-bold text-white mb-6 leading-[1.1]">
          Le Triptyque <br /><span className="text-[#306EE8]">Fondamental</span>
        </h2>
        <p className="font-jakarta text-base text-zinc-400 leading-relaxed max-w-sm">
          Nous ne sommes pas une agence 360°. Nous sommes spécialistes de trois domaines critiques qui ne devraient jamais être traités séparément.
        </p>
      </div>

      {/* 2. HORIZONTAL SCROLL CONTAINER */}
      <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory px-6 gap-5 pb-8 scrollbar-hide">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="relative flex-none w-[80vw] md:w-[400px] snap-center flex flex-col"
          >
            {/* CARD CONTAINER */}
            <div className="relative h-full bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">

              {/* Visual Top (Abstract Tech Art + CSS Totem) */}
              <div className="relative h-40 bg-gradient-to-b from-[#0f0f0f] to-[#0f0f0f] border-b border-white/5 overflow-hidden group">

                {/* 1. Background Grid & Glow */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
                <div className="absolute inset-0 bg-radial-gradient from-[#306EE8]/10 via-transparent to-transparent opacity-50" />

                {/* 2. THE CSS ART SCENES (Figurative Tech) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                  {/* SCÈNE 1: L'INTERFACE (Browser Window) */}
                  {index === 0 && (
                    <motion.div
                      style={{ rotate: tilt }}
                      animate={{ y: [0, -8, 0], rotateX: [0, 5, 0] }}
                      transition={{
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        rotateX: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="relative w-28 h-20 bg-zinc-900 border border-white/20 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
                    >
                      <div className="h-4 bg-zinc-800 border-b border-white/10 flex items-center px-1.5 gap-1">
                        <div className="w-1 h-1 rounded-full bg-red-500/50" />
                        <div className="w-1 h-1 rounded-full bg-yellow-500/50" />
                        <div className="w-1 h-1 rounded-full bg-green-500/50" />
                        <div className="ml-auto w-8 h-0.5 bg-white/5 rounded-full" />
                      </div>
                      <div className="p-2 space-y-1.5">
                        <div className="flex gap-1.5">
                          <div className="w-5 h-5 rounded bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)] flex items-center justify-center">
                            <Asterisk className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1 space-y-1 py-0.5">
                            <div className="h-1.5 bg-white/20 rounded w-full" />
                            <div className="h-1.5 bg-white/10 rounded w-2/3" />
                          </div>
                        </div>
                        <div className="h-10 bg-[#306EE8]/5 rounded border border-[#306EE8]/20 mt-1 flex flex-col items-center justify-center gap-0.5 overflow-hidden">
                          <div className="w-3/4 h-0.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="w-1/2 h-full bg-[#306EE8]"
                            />
                          </div>
                          <div className="text-[6px] font-mono text-[#306EE8]/60 uppercase tracking-tighter">Running...</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SCÈNE 2: LE PROCESSEUR (Complex Circuitry) */}
                  {index === 1 && (
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      {/* SVG Circuit Traces - PCB Style (matching desktop ElectricCircuitOverlay) */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 160">
                        {/* Glow filter */}
                        <defs>
                          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        {/* LEFT traces - VARIED elbow positions */}
                        <path d="M0,45 L10,45 L10,55 L40,55" stroke="#306EE8" strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#glow)" />
                        <path d="M0,80 L30,80 L30,75 L40,75" stroke="#306EE8" strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#glow)" />
                        <path d="M0,115 L22,115 L22,105 L40,105" stroke="#306EE8" strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#glow)" />

                        {/* RIGHT traces - VARIED elbow positions (asymmetric from left) */}
                        <path d="M160,50 L145,50 L145,60 L120,60" stroke="#306EE8" strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#glow)" />
                        <path d="M160,78 L130,78 L130,85 L120,85" stroke="#306EE8" strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#glow)" />
                        <path d="M160,120 L138,120 L138,100 L120,100" stroke="#306EE8" strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#glow)" />


                        {/* Connection nodes at chip edges */}
                        <circle cx="40" cy="55" r="2" fill="#306EE8" opacity="0.6" />
                        <circle cx="40" cy="75" r="2" fill="#306EE8" opacity="0.6" />
                        <circle cx="40" cy="105" r="2" fill="#306EE8" opacity="0.6" />
                        <circle cx="120" cy="60" r="2" fill="#306EE8" opacity="0.6" />
                        <circle cx="120" cy="85" r="2" fill="#306EE8" opacity="0.6" />
                        <circle cx="120" cy="100" r="2" fill="#306EE8" opacity="0.6" />

                        {/* Animated pulses - staggered starts for smooth continuous flow */}
                        <circle r="2" fill="white" opacity="0.8">
                          <animateMotion dur="7.3s" begin="0s" repeatCount="indefinite" path="M0,45 L10,45 L10,55 L40,55" />
                        </circle>
                        <circle r="2" fill="white" opacity="0.8">
                          <animateMotion dur="9.1s" begin="1.5s" repeatCount="indefinite" path="M0,80 L30,80 L30,75 L40,75" />
                        </circle>
                        <circle r="2" fill="white" opacity="0.8">
                          <animateMotion dur="6.2s" begin="3.2s" repeatCount="indefinite" path="M0,115 L22,115 L22,105 L40,105" />
                        </circle>
                        <circle r="2" fill="white" opacity="0.8">
                          <animateMotion dur="8.4s" begin="0.8s" repeatCount="indefinite" path="M160,50 L145,50 L145,60 L120,60" />
                        </circle>
                        <circle r="2" fill="white" opacity="0.8">
                          <animateMotion dur="5.7s" begin="2.4s" repeatCount="indefinite" path="M160,78 L130,78 L130,85 L120,85" />
                        </circle>
                        <circle r="2" fill="white" opacity="0.8">
                          <animateMotion dur="10.3s" begin="4.1s" repeatCount="indefinite" path="M160,120 L138,120 L138,100 L120,100" />
                        </circle>
                      </svg>

                      {/* The Main Chip */}
                      <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-zinc-800 to-black border-2 border-white/20 rounded shadow-[0_0_40px_rgba(48,110,232,0.3)] flex items-center justify-center">
                        <div className="absolute inset-0 border border-white/10 m-1" />
                        <div className="relative w-10 h-10 border border-[#306EE8]/50 bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)] flex items-center justify-center overflow-hidden">
                          <Asterisk className="w-6 h-6 text-white relative z-10" />
                          {/* Scroll-driven shine overlay */}
                          <motion.div
                            className="absolute inset-0 z-20 pointer-events-none"
                            style={{
                              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.4) 55%, transparent 60%)',
                              backgroundSize: '300% 100%',
                              backgroundPositionX: useTransform(scrollX, [0, 500], ['200%', '-200%']),
                            }}
                          />
                        </div>
                        {/* Hardware labels */}
                        <div className="absolute bottom-1 right-2 text-[6px] font-mono text-white/20">V.2.0</div>
                      </div>
                    </div>
                  )}

                  {/* SCÈNE 3: L'ADN (Strategy) */}
                  {index >= 2 && (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                      <svg className="w-24 h-32" viewBox="0 0 100 120">
                        {[...Array(8)].map((_, i) => (
                          <g key={i}>
                            <motion.circle
                              animate={{ x: [20, 80, 20] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                              cy={15 + i * 15} r="3" fill="white"
                            />
                            <motion.circle
                              animate={{ x: [80, 20, 80] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                              cy={15 + i * 15} r="3" fill="#306EE8"
                            />
                            <motion.line
                              initial={{ x1: 20, x2: 80 }}
                              animate={{ x1: [20, 80, 20], x2: [80, 20, 80] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                              y1={15 + i * 15} y2={15 + i * 15}
                              stroke="white" strokeWidth="0.5" strokeOpacity="0.2"
                            />
                          </g>
                        ))}
                      </svg>
                    </div>
                  )}
                </div>

                <div className="absolute top-4 left-4 inline-flex w-auto px-2 py-1 rounded bg-black/40 border border-white/10 backdrop-blur-md z-10">
                  <span className="font-mono text-[10px] text-white/60 tracking-wider uppercase">
                    {service.subtitle}
                  </span>
                </div>
              </div>

              {/* Content Bottom */}
              <div className="p-5 flex flex-col flex-1 bg-[#0f0f0f]">
                <h3 className="font-clash text-2xl font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="font-jakarta text-sm text-zinc-400 leading-relaxed mb-4 min-h-[40px]">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="space-y-3 mt-auto">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#306EE8]/20 border border-[#306EE8]/50 shrink-0">
                        <Asterisk className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="font-jakarta text-sm text-gray-200 leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Button Standard */}
                <div className="mt-5 pt-5 border-t border-white/5">
                  <Link href="/rendez-vous" className="w-full block">
                    <GradientButton className="w-full h-[48px] text-base" theme="dark">
                      En discuter
                    </GradientButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Spacer fin de liste pour le scroll */}
        <div className="w-1 shrink-0" />
      </div>

      {/* 3. PAGINATION DOTS */}
      <div className="relative mt-3 flex justify-center gap-3">
        {services.map((_, i) => (
          <DotIndicator
            key={i}
            index={i}
            total={services.length}
            scrollXProgress={scrollXProgress}
          />
        ))}
      </div>


    </section>
  );
};

const DotIndicator = ({ index, total, scrollXProgress }: { index: number, total: number, scrollXProgress: any }) => {
  const step = 1 / (total - 1);
  const start = index * step - step / 2;
  const target = index * step;
  const end = index * step + step / 2;

  const width = useTransform(scrollXProgress, [start, target, end], [6, 20, 6]);
  const opacity = useTransform(scrollXProgress, [start, target, end], [0.3, 1, 0.3]);

  return (
    <motion.div
      className="h-1.5 rounded-full bg-white"
      style={{ width, opacity }}
    />
  );
};