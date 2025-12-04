"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Problem() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse",
                },
            });

            tl.from(textRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="probleme"
            ref={containerRef}
            className="relative min-h-[80vh] w-full flex flex-col items-center justify-center bg-[#0a0a0a] text-white py-24"
        >
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-blue-900/10 blur-[120px] rounded-full opacity-50"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div ref={textRef} className="max-w-4xl mx-auto text-center space-y-12">
                    <h2 className="font-clash text-4xl md:text-6xl font-medium leading-tight">
                        L'automatisation est devenue <br />
                        <span className="text-gray-500">trop complexe.</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 text-left mt-16">
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                            <h3 className="font-clash text-xl mb-4 text-blue-400">Le Constat</h3>
                            <p className="font-jakarta text-gray-400 leading-relaxed">
                                Les entreprises se noient sous les outils. Chaque nouveau logiciel promet de gagner du temps, mais ajoute une couche de friction. L'humain disparaît derrière les processus.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                            <h3 className="font-clash text-xl mb-4 text-blue-400">La Conséquence</h3>
                            <p className="font-jakarta text-gray-400 leading-relaxed">
                                Vos équipes passent plus de temps à gérer la machine qu'à créer de la valeur. La technologie qui devait vous libérer finit par vous asservir.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
