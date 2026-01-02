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
    <div className="w-full px-2 py-4 flex flex-col gap-6">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.35, delay: index * 0.05 }}
          className="relative flex flex-col gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <span className="font-clash text-4xl font-bold text-[#306EE8]/30">
              0{index + 1}
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#306EE8]/30 to-transparent" />
          </div>
          <div>
            <h3 className="font-clash text-2xl font-medium text-white mb-2">
              {step.title}
            </h3>
            <p className="font-jakarta text-sm text-gray-300 leading-relaxed">
              {step.description}
            </p>
          </div>
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
};

