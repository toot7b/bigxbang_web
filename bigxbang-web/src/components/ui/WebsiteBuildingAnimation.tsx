import React from 'react';

export const WebsiteBuildingAnimation = () => {
    return (
        <div className="w-full h-full relative overflow-hidden flex flex-col" style={{ background: 'linear-gradient(145deg, rgba(23, 32, 64, 0.92) 0%, rgba(8, 12, 24, 0.94) 60%, rgba(5, 8, 18, 0.96) 100%)' }}>
            <style>
                {`
                    @keyframes scrollUp {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(-50%); }
                    }
                    .scroll-content {
                        animation: scrollUp 12s linear infinite;
                    }
                `}
            </style>

            {/* Scrolling Container - Website Content Only */}
            <div className="scroll-content flex flex-col gap-8 p-6">

                {/* Set 1: Full Website Mock */}
                {/* Navbar - NO TRAFFIC LIGHTS */}
                <div className="w-full h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between px-4">
                    <div className="w-20 h-3 rounded bg-white/20"></div>
                    <div className="flex gap-4">
                        <div className="w-12 h-2 rounded bg-white/10"></div>
                        <div className="w-12 h-2 rounded bg-white/10"></div>
                        <div className="w-12 h-2 rounded bg-white/10"></div>
                    </div>
                    <div className="w-20 h-7 rounded-md bg-[#306EE8]/80"></div>
                </div>

                {/* Hero Section */}
                <div className="w-full py-12 flex flex-col items-center gap-4 border border-white/5 rounded-xl bg-white/[0.02]">
                    <div className="w-[70%] h-6 bg-white/15 rounded"></div>
                    <div className="w-[50%] h-3 bg-white/10 rounded"></div>
                    <div className="flex gap-4 mt-4">
                        <div className="w-28 h-9 rounded-lg bg-[#306EE8]"></div>
                        <div className="w-28 h-9 rounded-lg border border-white/20 bg-white/5"></div>
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#306EE8]/30 mb-2"></div>
                            <div className="w-[80%] h-3 bg-white/15 rounded"></div>
                            <div className="w-full h-2 bg-white/10 rounded"></div>
                            <div className="w-[60%] h-2 bg-white/10 rounded"></div>
                        </div>
                    ))}
                </div>

                {/* Footer Section */}
                <div className="w-full h-20 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center">
                    <div className="w-32 h-3 bg-white/10 rounded"></div>
                </div>

                {/* Set 2: Duplicate for infinite scroll effect */}
                <div className="w-full h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between px-4 mt-16">
                    <div className="w-20 h-3 rounded bg-white/20"></div>
                    <div className="flex gap-4">
                        <div className="w-12 h-2 rounded bg-white/10"></div>
                        <div className="w-12 h-2 rounded bg-white/10"></div>
                        <div className="w-12 h-2 rounded bg-white/10"></div>
                    </div>
                    <div className="w-20 h-7 rounded-md bg-[#306EE8]/80"></div>
                </div>

                <div className="w-full py-12 flex flex-col items-center gap-4 border border-white/5 rounded-xl bg-white/[0.02]">
                    <div className="w-[70%] h-6 bg-white/15 rounded"></div>
                    <div className="w-[50%] h-3 bg-white/10 rounded"></div>
                    <div className="flex gap-4 mt-4">
                        <div className="w-28 h-9 rounded-lg bg-[#306EE8]"></div>
                        <div className="w-28 h-9 rounded-lg border border-white/20 bg-white/5"></div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={`dup-${i}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#306EE8]/30 mb-2"></div>
                            <div className="w-[80%] h-3 bg-white/15 rounded"></div>
                            <div className="w-full h-2 bg-white/10 rounded"></div>
                            <div className="w-[60%] h-2 bg-white/10 rounded"></div>
                        </div>
                    ))}
                </div>

                <div className="w-full h-20 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center">
                    <div className="w-32 h-3 bg-white/10 rounded"></div>
                </div>
            </div>
        </div>
    );
};
