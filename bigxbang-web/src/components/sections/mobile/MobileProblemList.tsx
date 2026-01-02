"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Asterisk from "@/components/ui/Asterisk";

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
    <div className="w-full px-2 py-4 flex flex-col gap-6">
      {problems.map((problem, index) => (
        <div key={problem.id} className="relative flex flex-col items-center">

          {index !== problems.length - 1 && (
            <div className="absolute top-12 bottom-[-24px] w-[1px] border-l border-dashed border-white/10 z-0" />
          )}

          <div className="relative z-10 w-full bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-5 flex items-start gap-4">
            <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/5">
              <Asterisk className="w-4 h-4 text-[#306EE8]" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-clash text-lg font-medium text-white mb-1">
                {problem.label}
              </h3>
              <p className="font-jakarta text-sm text-gray-300 leading-relaxed">
                {problem.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

