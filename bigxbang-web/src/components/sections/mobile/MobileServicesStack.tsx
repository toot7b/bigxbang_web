"use client";

import React, { useState } from "react";
import Asterisk from "@/components/ui/Asterisk";

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
  const [activeId, setActiveId] = useState(services[0]?.id ?? 1);
  const active = services.find((s) => s.id === activeId) ?? services[0];

  if (!active) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-5 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
        {services.map((service) => {
          const shortLabel = service.subtitle.split("// ")[1] || service.subtitle;
          const isActive = service.id === activeId;
          return (
            <button
              key={service.id}
              type="button"
              className={[
                "flex-1 py-2.5 px-3 rounded-full text-[11px] font-mono tracking-wide uppercase transition-all",
                isActive
                  ? "bg-white text-black shadow-[0_10px_30px_rgba(48,110,232,0.25)]"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              ].join(" ")}
              onClick={() => setActiveId(service.id)}
            >
              {shortLabel}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-[#0a0a0a] border border-white/10 overflow-hidden">
        <div className="relative w-full aspect-video bg-[radial-gradient(ellipse_at_center,rgba(48,110,232,0.25)_0%,transparent_70%)]">
          <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:18px_18px] opacity-20" />
          <div className="absolute inset-4 rounded-2xl border border-white/10 opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] text-white/80 uppercase tracking-widest">
              {active.subtitle}
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <h3 className="font-clash text-2xl font-bold text-white">
            {active.title}
          </h3>
          <p className="font-jakarta text-sm text-gray-300 leading-relaxed">
            {active.description}
          </p>
          <div className="space-y-3">
            {active.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#306EE8]/40 border border-[#306EE8] shrink-0">
                  <Asterisk className="w-3 h-3 text-white" />
                </div>
                <span className="font-jakarta text-sm text-gray-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

