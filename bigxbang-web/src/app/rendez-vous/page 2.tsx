"use client";

import Navbar from "@/components/layout/Navbar";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { ContactForm } from "@/components/contact/ContactForm";
import dynamic from "next/dynamic";

const QuantumFlowBackground = dynamic(() => import("@/components/ui/QuantumFlowBackground"), { ssr: false });

export default function RendezVousPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
            <Navbar />

            {/* Background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <QuantumFlowBackground />
                {/* Additional ambient glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#306EE8] opacity-[0.08] blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900 opacity-[0.1] blur-[150px] rounded-full animate-pulse-slow delay-1000"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-12">
                    <h1 className="font-clash text-4xl md:text-5xl font-medium text-white mb-4">
                        Prendre rendez-vous
                    </h1>
                    <p className="font-jakarta text-gray-400">
                        Choisissez un créneau ou envoyez-nous un message.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto items-start">
                    {/* Colonne Gauche: Calendrier */}
                    <div className="w-full">
                        <div className="mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#306EE8]/20 border border-[#306EE8]/50 font-clash font-bold text-[#306EE8]">1</span>
                            <h2 className="font-clash text-xl text-white">Réserver un créneau</h2>
                        </div>
                        <BookingCalendar />
                    </div>

                    {/* Colonne Droite: Formulaire */}
                    <div className="w-full h-full">
                        <div className="mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/20 font-clash font-bold text-gray-400">2</span>
                            <h2 className="font-clash text-xl text-white">Ou nous écrire</h2>
                        </div>
                        <ContactForm className="h-full" />
                    </div>
                </div>
            </div>
        </main>
    );
}
