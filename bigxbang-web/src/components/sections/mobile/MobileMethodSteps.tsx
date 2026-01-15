"use client";

import React from "react";
import { motion } from "framer-motion";

interface Step {
  title: string;
  description: string;
}

interface MobileMethodStepsProps {
  steps: Step[];
}

export const MobileMethodSteps = ({ steps }: MobileMethodStepsProps) => {
  return (
    <div className="relative w-full px-6 pt-10 pb-10 flex flex-col min-h-dvh overflow-hidden bg-[linear-gradient(to_bottom,#000000_0%,#0c0c0c_15%,#0c0c0c_85%,#000000_100%)]">

      {/* Background Grid Pattern (Blueprint Effect) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_99%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* 1. SECTION HEADER */}
      <div className="relative z-10 flex flex-col items-start mb-20">
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm mb-6">
          <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest">La Méthode</span>
        </div>
        <h2 className="font-clash text-4xl font-bold text-white mb-6 leading-[1.1]">
          L'Art de la <br /><span className="text-[#306EE8]">Structure</span>
        </h2>
        <p className="font-jakarta text-base text-zinc-400 leading-relaxed max-w-sm">
          On ne décore pas le vide. Chaque pixel et chaque ligne de code ont une fonction précise.
        </p>
      </div>

      {/* 2. THE STEPS (HUD STYLE) */}
      <div className="flex flex-col gap-16 relative z-10">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative pl-4 border-l-2 border-white/5" // Bordure gauche technique
          >
            {/* Décoration technique coin haut droit */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20" />

            {/* GIANT NUMBER BACKDROP */}
            <div className="absolute -top-10 -left-6 text-[120px] font-bold font-clash text-white/[0.03] leading-none select-none pointer-events-none z-0">
              0{index + 1}
            </div>

            {/* Contenu */}
            <div className="relative z-10 pt-2">
              {/* Petit label technique */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 bg-[#306EE8] rounded-sm" />
                <span className="font-mono text-[10px] text-[#306EE8] tracking-widest uppercase">
                  Phase 0{index + 1}
                </span>
              </div>

              <h3 className="font-clash text-2xl font-semibold text-white mb-4">
                {step.title}
              </h3>

              <p className="font-jakarta text-[16px] text-zinc-400 leading-relaxed font-normal pr-4">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

