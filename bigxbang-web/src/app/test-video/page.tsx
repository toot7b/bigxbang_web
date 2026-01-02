"use client";

import React from "react";

export default function TestVideoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black flex items-center justify-center p-8">
            <div className="text-center w-full max-w-4xl">
                <h1 className="text-white text-2xl mb-8 font-bold">Test Alpha Video WebM (Final Config)</h1>
                <p className="text-white/60 mb-8">Configuration validée : Radial Gradient (Ellipse Closest-side, 60% opacity center)</p>

                {/* Video with alpha transparency and perfect mask */}
                <div className="relative w-full aspect-video flex items-center justify-center bg-transparent mx-auto">
                    <video
                        className="w-full max-w-2xl z-10"
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            maskImage: 'radial-gradient(ellipse closest-side at center, black 60%, transparent 100%)',
                            WebkitMaskImage: 'radial-gradient(ellipse closest-side at center, black 60%, transparent 100%)'
                        }}
                    >
                        <source src="/test-video.webm" type="video/webm" />
                    </video>
                    {/* Background gradient to verify alpha */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-blue-500/20 blur-3xl -z-10" />
                </div>

                <p className="text-white/40 text-sm mt-8">Fichier : /test-video.webm</p>
            </div>
        </div>
    );
}
