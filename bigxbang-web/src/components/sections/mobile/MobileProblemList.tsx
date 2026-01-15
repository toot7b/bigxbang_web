"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Asterisk from "@/components/ui/Asterisk";
import { GradientButton } from "@/components/ui/gradient-button";
import { motion } from "framer-motion";
import { Link } from "next-view-transitions";

interface Point {
  id: number;
  label: string;
  description: string;
}

interface MobileProblemListProps {
  problems: Point[];
}

export const MobileProblemList = ({ problems }: MobileProblemListProps) => {
  return (
    <div className="w-full px-6 pt-10 pb-32 flex flex-col min-h-dvh">

      {/* 1. SECTION HEADER */}
      <div className="relative z-10 flex flex-col items-start mb-20">
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm mb-6">
          <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest">Le Problème</span>
        </div>
        <h2 className="font-clash text-4xl font-bold text-white mb-6 leading-[1.1]">
          Entre ce que vous valez <br />et ce que vous montrez <br /> <span className="text-[#306EE8]">il y a un monde.</span>
        </h2>
        <p className="font-jakarta text-base text-zinc-400 leading-relaxed max-w-sm">
          C'est là que s'efface l'exceptionnel. Vos outils et votre image doivent être à la hauteur de votre expertise.
        </p>
      </div>

      <div className="flex flex-col gap-14 relative z-10">
        {problems.map((problem, index) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="relative"
          >

            {/* Timeline Connector (Neon Beam) - Ne s'affiche pas pour le dernier élément */}
            {index !== problems.length - 1 && (
              <div className="absolute left-[21px] top-12 bottom-[-80px] w-[2px] bg-gradient-to-b from-[#306EE8]/40 via-white/5 to-transparent z-0" />
            )}

            <div className="relative z-10 flex flex-col gap-1.5"> {/* Resserrement Titre/Texte */}
              {/* Header: Icon + Title */}
              <div className="flex items-center gap-5">
                {/* Orbite de l'icone */}
                <div className="relative shrink-0 flex items-center justify-center w-11 h-11">
                  <div className="absolute inset-0 bg-[#306EE8] blur-[20px] opacity-30 rounded-full animate-pulse" />
                  <div className="relative flex items-center justify-center w-full h-full rounded-full bg-black border border-white/10 shadow-[0_0_15px_rgba(48,110,232,0.2)]">
                    <Asterisk className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                </div>

                {/* Titre : Hiérarchie de niveau 1 */}
                <h3 className="font-clash text-[22px] font-bold text-white tracking-tight leading-snug pt-1">
                  {problem.label}
                </h3>
              </div>

              {/* Corps : Hiérarchie de niveau 2 */}
              <div className="pl-16 relative">
                {/* Petite barre verticale décorative pour structurer la lecture */}
                <div className="absolute left-[21px] top-1 bottom-1 w-[1px] bg-white/5" />

                <p className="font-jakarta text-[16px] text-zinc-400 leading-relaxed font-normal">
                  {problem.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* CTA Final : La porte de sortie */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-8 pl-6"
        >
          <Link href="/rendez-vous" className="w-full max-w-xs block">
            <GradientButton className="w-full h-[52px] text-base" theme="dark">
              Je me reconnais
            </GradientButton>
          </Link>
        </motion.div>
      </div>
    </div >
  );
};

