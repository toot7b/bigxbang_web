"use client";

import React from "react";

/**
 * PAGE DE DÉVELOPPEMENT - CAT HERO
 * URL: http://localhost:3000/cat-hero
 *
 * Cette page est isolée du reste du site pour développer le composant "CatHero"
 * sans casser la landing page principale.
 */

export default function CatHeroPage() {
    return (
        <main className="min-h-screen bg-black text-white overflow-hidden relative selection:bg-purple-500/30">
            {/* Zone de travail pour le composant Hero */}
            <div className="relative w-full h-screen flex flex-col items-center justify-center border-4 border-dashed border-zinc-800 m-4 rounded-3xl">
                <p className="text-zinc-500 font-mono mb-4 text-sm uppercase tracking-widest">Zone de Construction du Chat</p>
                <h1 className="text-4xl font-bold mb-2">The Cat Hero</h1>
                <p className="text-zinc-400">En attente des polices et des assets...</p>
            </div>

            {/* Note pour le dev */}
            <div className="absolute bottom-8 left-8 p-4 bg-zinc-900/80 backdrop-blur rounded-xl border border-zinc-800 text-xs text-zinc-400 font-mono">
                <p>Status: Ready to build</p>
                <p>Route: /cat-hero</p>
            </div>
        </main>
    );
}
