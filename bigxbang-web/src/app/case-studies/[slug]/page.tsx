"use client";

import React, { use } from "react";
import { CASE_STUDIES } from "@/data/case-studies";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper for params in Next.js 15 (Client Component)
// Note: In Next.js 15, params is a Promise. We use React.use() to unwrap it.
export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const study = CASE_STUDIES.find((s) => s.slug === slug);

    if (!study) {
        return notFound();
    }

    return (
        <main className="min-h-screen bg-black text-zinc-300 font-jakarta selection:bg-white selection:text-black">
            {/* NAVIGATION */}
            <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference">
                <Link href="/" className="flex items-center gap-2 group text-white hover:opacity-70 transition-opacity">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-xs uppercase tracking-widest">Retour au QG</span>
                </Link>
                <div className="font-mono text-xs text-white/50">{study.slug.toUpperCase()}</div>
            </nav>

            {/* HERO HEADER */}
            <header className="pt-32 pb-16 px-6 md:px-12 max-w-5xl mx-auto border-b border-white/10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs font-mono text-white/70 mb-8">
                    <span className="w-2 h-2 rounded-full bg-[#306EE8] animate-pulse" />
                    RAPPORT DE MISSION
                </div>

                <h1 className="font-clash text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    {study.title}
                </h1>
                <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed mb-12">
                    {study.subtitle}
                </p>

                {/* METADATA GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-8">
                    <div>
                        <div className="font-mono text-xs text-zinc-500 mb-2 uppercase tracking-wide">Client</div>
                        <div className="text-white font-medium">{study.client}</div>
                    </div>
                    <div>
                        <div className="font-mono text-xs text-zinc-500 mb-2 uppercase tracking-wide">Durée</div>
                        <div className="text-white font-medium">{study.timeline}</div>
                    </div>
                    <div className="col-span-2">
                        <div className="font-mono text-xs text-zinc-500 mb-2 uppercase tracking-wide">Technologies</div>
                        <div className="flex flex-wrap gap-2">
                            {study.stack.map(tech => (
                                <span key={tech} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-white font-mono">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* CONTENT BODY */}
            <article className="max-w-4xl mx-auto px-6 md:px-12 py-16 space-y-12">
                {study.content.map((block, index) => {
                    switch (block.type) {
                        case "section_header":
                            return (
                                <h2 key={index} className="font-clash text-2xl md:text-3xl text-white font-semibold pt-8 border-l-2 border-[#306EE8] pl-6 mb-8">
                                    {block.value}
                                </h2>
                            );

                        case "text":
                            return (
                                <div key={index} className="text-lg leading-relaxed text-zinc-300 [&>strong]:text-white [&>strong]:font-semibold mb-6" dangerouslySetInnerHTML={{ __html: block.value }} />
                            );

                        case "info_box":
                            return (
                                <div key={index} className="my-8 p-6 bg-[#306EE8]/10 border border-[#306EE8]/30 rounded-lg">
                                    <div className="text-[#306EE8] font-bold mb-2 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                                        INFO
                                    </div>
                                    <p className="text-zinc-200">{block.value}</p>
                                </div>
                            );

                        case "code":
                            return (
                                <div key={index} className="bg-[#1e1e1e] rounded-xl overflow-hidden my-10 shadow-2xl border border-white/5 font-mono text-sm">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-[#252526] border-b border-black/50">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                        </div>
                                        <div className="ml-4 text-zinc-500 text-xs">{block.language || 'code'}</div>
                                    </div>
                                    <div className="p-6 overflow-x-auto">
                                        <pre className="text-[#d4d4d4]">
                                            <code>{block.value}</code>
                                        </pre>
                                    </div>
                                </div>
                            );

                        default:
                            return null;
                    }
                })}
            </article>

            {/* FOOTER NAV */}
            <footer className="border-t border-white/10 py-24 text-center">
                <Link
                    href="/#case-studies"
                    className="inline-block px-8 py-4 bg-white text-black font-medium rounded-full hover:scale-105 transition-transform"
                >
                    Retour aux Opérations
                </Link>
            </footer>
        </main>
    );
}
