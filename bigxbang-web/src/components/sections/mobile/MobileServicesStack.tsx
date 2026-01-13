"use client";

import React, { useRef } from "react";
import Asterisk from "@/components/ui/Asterisk";
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
  const { scrollX } = useScroll({ container: scrollRef });
  const scrollXVelocity = useVelocity(scrollX);

  // Cartoon Physics: Bouncy Spring
  const smoothVelocity = useSpring(scrollXVelocity, {
    damping: 15, // Low damping = more bounce/wobble
    stiffness: 200, // Spring tension
    mass: 0.8
  });

  const tilt = useTransform(smoothVelocity, [-1500, 1500], [-25, 25]);

  return (
    <section className="w-full pt-32 pb-32 bg-[#0a0a0a] overflow-hidden">

      {/* 1. SECTION HEADER */}
      <div className="px-6 mb-12">
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm mb-6">
          <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest">Offres</span>
        </div>
        <h2 className="font-clash text-4xl font-bold text-white mb-4 leading-[1.1]">
          Codez votre <br /><span className="text-[#306EE8]">Univers</span>
        </h2>
        <p className="font-jakarta text-base text-zinc-400 leading-relaxed max-w-sm">
          Des solutions calibrées pour chaque étape de votre croissance.
        </p>
      </div>

      {/* 2. HORIZONTAL SCROLL CONTAINER */}
      <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory px-6 gap-5 pb-8 scrollbar-hide">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="relative flex-none w-[85vw] md:w-[400px] snap-center flex flex-col"
          >
            {/* CARD CONTAINER */}
            <div className="relative h-full bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">

              {/* Visual Top (Abstract Tech Art + CSS Totem) */}
              <div className="relative h-48 bg-gradient-to-b from-[#0f0f0f] to-[#0f0f0f] border-b border-white/5 overflow-hidden group">

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
                      className="relative w-36 h-28 bg-zinc-900 border border-white/20 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
                    >
                      <div className="h-6 bg-zinc-800 border-b border-white/10 flex items-center px-2 gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                        <div className="ml-auto w-12 h-1 bg-white/5 rounded-full" />
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded bg-white/10 animate-pulse" />
                          <div className="flex-1 space-y-1.5 py-1">
                            <div className="h-2 bg-white/20 rounded w-full" />
                            <div className="h-2 bg-white/10 rounded w-2/3" />
                          </div>
                        </div>
                        <div className="h-16 bg-[#306EE8]/5 rounded border border-[#306EE8]/20 mt-2 flex flex-col items-center justify-center gap-1 overflow-hidden">
                          <div className="w-3/4 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="w-1/2 h-full bg-[#306EE8]"
                            />
                          </div>
                          <div className="text-[8px] font-mono text-[#306EE8]/60 uppercase tracking-tighter">Optimizing...</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SCÈNE 2: LE PROCESSEUR (Complex Circuitry) */}
                  {index === 1 && (
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      {/* SVG Circuit Traces */}
                      <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 160 160">
                        <path d="M20,80 L60,80 M140,80 L100,80 M80,20 L80,60 M80,140 L80,100" stroke="#306EE8" strokeWidth="1" fill="none" />
                        <path d="M30,30 L65,65 M130,130 L95,95 M30,130 L65,95 M130,30 L95,65" stroke="#306EE8" strokeWidth="0.5" fill="none" />
                        {/* Animated signal dots */}
                        <circle r="1.5" fill="#306EE8">
                          <animateMotion dur="3s" repeatCount="indefinite" path="M20,80 L60,80" />
                        </circle>
                        <circle r="1.5" fill="white">
                          <animateMotion dur="2.5s" repeatCount="indefinite" path="M80,20 L80,60" />
                        </circle>
                      </svg>

                      {/* The Main Chip */}
                      <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-zinc-800 to-black border-2 border-white/20 rounded shadow-[0_0_40px_rgba(48,110,232,0.3)] flex items-center justify-center">
                        <div className="absolute inset-0 border border-white/10 m-1" />
                        <div className="w-10 h-10 border border-[#306EE8]/50 bg-[#306EE8]/5 flex items-center justify-center">
                          <Asterisk className="w-6 h-6 text-[#306EE8] animate-pulse" />
                        </div>
                        {/* Hardware labels */}
                        <div className="absolute bottom-1 right-2 text-[6px] font-mono text-white/20">V.2.0</div>
                      </div>
                    </div>
                  )}

                  {/* SCÈNE 3: L'ADN (Strategy) */}
                  {index >= 2 && (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                      <svg className="w-32 h-40" viewBox="0 0 100 120">
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

                {/* Badge Tech */}
                <div className="absolute top-4 left-4 px-2 py-1 rounded bg-black/40 border border-white/10 backdrop-blur-md z-10">
                  <span className="font-mono text-[10px] text-white/60 tracking-wider uppercase">
                    PACK 0{index + 1}
                  </span>
                </div>
              </div>

              {/* Content Bottom */}
              <div className="p-6 flex flex-col flex-1 bg-[#0f0f0f]">
                <h3 className="font-clash text-2xl font-bold text-white mb-3">
                  {service.title}
                </h3>
                <p className="font-jakarta text-sm text-zinc-400 leading-relaxed mb-8 min-h-[60px]">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="space-y-4 mt-auto">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-[#306EE8]/20 border border-[#306EE8]/50 shrink-0">
                        <Asterisk className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="font-jakarta text-sm text-gray-200 leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Button Placeholder */}
                <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="text-center font-mono text-xs text-zinc-500 uppercase tracking-widest group-active:text-white transition-colors">
                    Sélectionner
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Spacer fin de liste pour le scroll */}
        <div className="w-1 shrink-0" />
      </div>

      {/* Scroll Hint */}
      <div className="text-center mt-6">
        <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.2em] animate-pulse">
          Swipe pour découvrir &rarr;
        </span>
      </div>

    </section>
  );
};